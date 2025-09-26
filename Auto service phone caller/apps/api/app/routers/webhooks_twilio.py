from __future__ import annotations

from datetime import datetime
from fastapi import APIRouter, Request, Depends, Response, HTTPException
from twilio.twiml.voice_response import VoiceResponse, Gather
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.config import settings
from app.services.twilio_sms import send_sms
from twilio.request_validator import RequestValidator

router = APIRouter()


async def _validate_twilio_request(request: Request) -> None:
    """Optionally validate Twilio webhook signature when enabled via settings.
    Raises HTTPException 403 on invalid signature.
    """
    if not bool(getattr(settings, "TWILIO_VALIDATE_SIGNATURE", False)):
        return
    signature = request.headers.get("X-Twilio-Signature", "")
    validator = RequestValidator(settings.TWILIO_AUTH_TOKEN or "")
    url = str(request.url)
    # Collect form params for validation when present
    params: dict[str, str] = {}
    if request.method in {"POST", "PUT", "PATCH"}:
        try:
            form = await request.form()
            params = {k: v for k, v in form.items()}
        except Exception:
            params = {}
    if not validator.validate(url, params, signature):
        raise HTTPException(status_code=403, detail="Invalid Twilio signature")


@router.post("/answer")
async def twilio_answer(request: Request, call_id: int, db: Session = Depends(get_db)):
    await _validate_twilio_request(request)
    # consume form (Twilio sends POST form data), but we don't need fields here
    try:
        await request.form()
    except Exception:
        pass
    call = db.get(models.Call, call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    # Build TwiML to play TTS update and optionally gather approval
    resp = VoiceResponse()

    # In case of machine detection, we still play the message; voicemail summary is fine
    # Play synthesized audio
    if call.tts_path:
        resp.play(url=str(call.tts_path))
    else:
        resp.say("We have an update from your service shop.")

    base = settings.TWILIO_WEBHOOK_BASE_URL.rstrip("/")
    gather_action = f"{base}/twilio/gather?call_id={call_id}"

    if call.call_type == "appt_reminder":
        gather = Gather(input="dtmf", num_digits=1, action=gather_action, method="POST", timeout=5)
        gather.say("To confirm your appointment, press 1. To request a different time, press 2. To speak to a person, press 3.")
        resp.append(gather)
        resp.say("No input received. We'll follow up with a message. Thank you.")
    else:
        # Default job_update behavior
        ju = db.get(models.JobUpdate, call.job_update_id)
        needs_approval = ju.needs_approval if ju else False
        if needs_approval:
            gather = Gather(input="dtmf", num_digits=1, action=gather_action, method="POST", timeout=5)
            gather.say("To approve the work, press 1. To decline, press 2. To have a person call you back, press 3.")
            resp.append(gather)
            resp.say("No input received. We'll proceed to send a follow-up if needed. Thank you.")
        else:
            resp.say("No action is needed. Thank you.")

    xml = str(resp)
    return Response(content=xml, media_type="application/xml")


@router.post("/incoming")
async def twilio_incoming(request: Request, shop_id: int | None = None, db: Session = Depends(get_db)):
    await _validate_twilio_request(request)
    """Inbound handler: resolves tenant by Twilio 'To' number or fallback query param.

    Production: We map the 'To' number to `phone_numbers.number` to find `shop_id`.
    """
    form = await request.form()
    from_number = form.get("From") or form.get("Caller") or ""
    to_number = (form.get("To") or "").strip()

    resolved_shop_id = None
    if to_number:
        pn = db.query(models.PhoneNumber).filter(models.PhoneNumber.number == to_number).first()
        if pn:
            resolved_shop_id = pn.shop_id
    if not resolved_shop_id and shop_id:
        resolved_shop_id = shop_id
    if not resolved_shop_id:
        return Response(content="", media_type="text/plain")

    shop = db.get(models.Shop, int(resolved_shop_id))
    if not shop:
        return Response(content="", media_type="text/plain")

    # Find or create customer by phone under this shop
    customer = (
        db.query(models.Customer)
        .filter(models.Customer.shop_id == resolved_shop_id, models.Customer.phone == from_number)
        .first()
    )
    if not customer:
        customer = models.Customer(shop_id=resolved_shop_id, name=from_number, phone=from_number, preferred_language="en")
        db.add(customer)
        db.commit()
        db.refresh(customer)

    call = models.Call(
        shop_id=resolved_shop_id,
        job_id=None,
        job_update_id=None,
        customer_id=customer.id,
        appointment_id=None,
        call_type="inbound",
        to_number=to_number,
        from_number=from_number,
        status="answered",
        created_at=datetime.utcnow(),
    )
    db.add(call)
    db.commit()

    resp = VoiceResponse()
    # Stream media to voice-bridge for realtime AI agent
    base_wss = settings.__dict__.get("VOICE_BRIDGE_WSS_URL", "") or "wss://example/stream"
    # include shop_id for routing
    stream_url = f"{base_wss}?shop_id={resolved_shop_id}"
    with resp.start() as start:
        start.stream(url=stream_url)
    resp.say("You are connected. Please hold while our assistant responds.")

    xml = str(resp)
    return Response(content=xml, media_type="application/xml")


@router.post("/gather")
async def twilio_gather(request: Request, call_id: int, db: Session = Depends(get_db)):
    await _validate_twilio_request(request)
    form = await request.form()
    digits = form.get("Digits")

    call = db.get(models.Call, call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    resp = VoiceResponse()

    if call.call_type == "appt_reminder":
        appt = db.get(models.Appointment, call.appointment_id) if call.appointment_id else None
        shop = db.get(models.Shop, call.shop_id) if call.shop_id else None
        if digits == "1":
            if appt:
                appt.status = "confirmed"
                db.add(appt)
            call.approval_result = "confirmed"
            resp.say("Thanks. Your appointment is confirmed.")
        elif digits == "2":
            call.approval_result = "reschedule"
            if appt and (not appt.notes or "reschedule" not in (appt.notes or "").lower()):
                appt.notes = (appt.notes or "") + "\nReschedule requested via IVR."
                db.add(appt)
            # Send SMS follow-up to confirm reschedule request
            if shop:
                try:
                    send_sms(to=call.to_number, body=f"Hi! This is {shop.name}. We received your request to reschedule your appointment. Reply with preferred times or we will contact you shortly.")
                except Exception:
                    pass
            resp.say("Thanks. We will contact you to reschedule.")
        elif digits == "3":
            call.approval_result = "escalate"
            resp.say("Thanks. A team member will call you shortly.")
        else:
            resp.say("Sorry, we did not understand. A team member will follow up. Goodbye.")
        db.add(call)
        db.commit()
    else:
        ju = db.get(models.JobUpdate, call.job_update_id)
        if not ju:
            raise HTTPException(status_code=404, detail="Job update not found")
        if digits == "1":
            ju.approved = True
            call.approval_result = "approved"
            resp.say("Thanks. Your approval has been recorded. We will proceed.")
        elif digits == "2":
            ju.approved = False
            call.approval_result = "declined"
            resp.say("Thanks. We have recorded that you do not approve. A team member will reach out.")
        elif digits == "3":
            call.approval_result = "escalate"
            resp.say("Thanks. A team member will call you back shortly.")
        else:
            resp.say("Sorry, we did not understand. A team member will follow up. Goodbye.")
        db.add(ju)
        db.add(call)
        db.commit()

    xml = str(resp)
    return Response(content=xml, media_type="application/xml")


@router.post("/status")
async def twilio_status(request: Request, call_id: int, db: Session = Depends(get_db)):
    await _validate_twilio_request(request)
    form = await request.form()
    call_status = form.get("CallStatus")  # initiated, ringing, answered, completed
    call_sid = form.get("CallSid")
    recording_url = form.get("RecordingUrl")
    answered_by = form.get("AnsweredBy")  # human or machine

    call = db.get(models.Call, call_id)
    if not call:
        # Avoid 4xx to Twilio; just ack
        return Response(content="", media_type="text/plain")

    # Update call record
    if call_sid:
        call.twilio_sid = call_sid

    if call_status:
        call.status = call_status
        if call_status == "answered" and not call.started_at:
            call.started_at = datetime.utcnow()
        if call_status == "completed" and not call.ended_at:
            call.ended_at = datetime.utcnow()

    if recording_url:
        call.recording_url = recording_url

    if answered_by:
        call.outcome = answered_by  # store raw for now

    db.add(call)
    db.commit()

    return Response(content="", media_type="text/plain")
