from __future__ import annotations

from datetime import datetime
from loguru import logger
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app import models
from app.services.prompts import build_appt_reminder_script
from app.services.elevenlabs import synthesize_to_file
from app.services.twilio_client import create_outbound_call
from app.config import settings
from app.services.timewindows import compute_next_allowed
from rq_scheduler import Scheduler
from redis import Redis


def _format_starts_at(dt: datetime) -> str:
    try:
        return dt.strftime("%A, %B %d at %I:%M %p")
    except Exception:
        return dt.isoformat()


def process_appt_reminder_call(appointment_id: int) -> None:
    db: Session = SessionLocal()
    try:
        appt = db.get(models.Appointment, appointment_id)
        if not appt:
            logger.error(f"Appointment {appointment_id} not found")
            return

        shop = db.get(models.Shop, appt.shop_id)
        customer = db.get(models.Customer, appt.customer_id)
        if not shop or not customer:
            logger.error("Missing shop or customer for appointment {}".format(appointment_id))
            return

        script = build_appt_reminder_script(
            shop_name=shop.name,
            customer_name=customer.name or "",
            starts_at_text=_format_starts_at(appt.starts_at),
            location=appt.location,
            include_recording_notice=True,
        )

        tts_public_url = None
        try:
            fs_path, public_uri = synthesize_to_file(script)
            base = settings.TWILIO_WEBHOOK_BASE_URL.rstrip("/")
            tts_public_url = f"{base}{public_uri}"
        except Exception as e:
            logger.warning(f"TTS synthesis failed for appointment {appointment_id}: {e}. Falling back to say().")

        call = models.Call(
            shop_id=appt.shop_id,
            job_id=None,
            job_update_id=None,
            customer_id=appt.customer_id,
            appointment_id=appt.id,
            call_type="appt_reminder",
            to_number=customer.phone,
            from_number=settings.TWILIO_CALLER_ID,
            status="queued",
            tts_path=tts_public_url,
            created_at=datetime.utcnow(),
        )
        db.add(call)
        db.commit()
        db.refresh(call)

        # Quiet hours enforcement
        next_allowed = compute_next_allowed(
            datetime.utcnow(),
            customer_tz=customer.timezone,
            shop_tz=shop.default_timezone or "America/Los_Angeles",
            customer_start=customer.call_window_start,
            customer_end=customer.call_window_end,
            shop_start=settings.QUIET_HOURS_END,
            shop_end=settings.QUIET_HOURS_START,
        )

        if next_allowed:
            scheduler = Scheduler(queue_name=settings.RQ_QUEUE, connection=Redis.from_url(settings.REDIS_URL))
            scheduler.enqueue_at(next_allowed, process_appt_reminder_call, appointment_id)
            logger.info(f"Appointment {appointment_id} reminder deferred to {next_allowed} due to quiet hours")
            return

        try:
            record_flag = bool(shop.record_calls and (customer.recording_consent is None or customer.recording_consent))
            sid = create_outbound_call(call_id=call.id, to_number=customer.phone, needs_approval=True, record=record_flag)
            call.twilio_sid = sid
            call.status = "initiated"
            db.add(call)
            db.commit()
            logger.info(f"Queued appointment reminder call {call.id} to {customer.phone} with Twilio SID {sid}")
        except Exception as e:
            logger.exception("Failed to create Twilio call: {}".format(e))
            call.status = "error"
            call.outcome = "twilio_error"
            db.add(call)
            db.commit()
    finally:
        db.close()
