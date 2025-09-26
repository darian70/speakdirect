from __future__ import annotations

from datetime import datetime
from loguru import logger
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app import models
from app.services.prompts import build_update_script
from app.services.elevenlabs import synthesize_to_file
from app.services.twilio_client import create_outbound_call
from app.config import settings
from app.services.timewindows import compute_next_allowed
from rq_scheduler import Scheduler
from redis import Redis


def process_job_update_call(job_update_id: int) -> None:
    """Background task: turn a job update into an outbound call.

    Steps:
      1) Load job update, job, customer and shop data
      2) Build a short, natural update script
      3) Synthesize TTS to mp3 and store path
      4) Create Call record
      5) Trigger Twilio outbound call and update SID/status
    """
    db: Session = SessionLocal()
    try:
        ju = db.get(models.JobUpdate, job_update_id)
        if not ju:
            logger.error(f"JobUpdate {job_update_id} not found")
            return

        job = db.get(models.Job, ju.job_id)
        customer = db.get(models.Customer, job.customer_id) if job else None
        shop = db.get(models.Shop, job.shop_id) if job else None
        vehicle = db.get(models.Vehicle, job.vehicle_id) if job and job.vehicle_id else None

        if not job or not customer or not shop:
            logger.error("Missing related entities for job update {}".format(job_update_id))
            return

        # Determine recording notice now (used in TTS prompt)
        record_flag_for_notice = bool(shop.record_calls and (customer.recording_consent is None or customer.recording_consent))

        script = build_update_script(
            shop_name=shop.name,
            customer_name=customer.name or "",
            vehicle_year=vehicle.year if vehicle else None,
            vehicle_make=vehicle.make if vehicle else None,
            vehicle_model=vehicle.model if vehicle else None,
            status=ju.status,
            summary=ju.summary,
            cost=float(ju.cost) if ju.cost is not None else None,
            needs_approval=ju.needs_approval,
            include_recording_notice=record_flag_for_notice,
        )

        tts_public_url = None
        try:
            fs_path, public_uri = synthesize_to_file(script)
            base = settings.TWILIO_WEBHOOK_BASE_URL.rstrip("/")
            tts_public_url = f"{base}{public_uri}"
        except Exception as e:
            logger.warning(f"TTS synthesis failed for job_update {job_update_id}: {e}. Falling back to say().")

        call = models.Call(
            shop_id=job.shop_id,
            job_id=job.id,
            job_update_id=ju.id,
            customer_id=customer.id,
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
            shop_tz=shop.default_timezone or settings.DEFAULT_TIMEZONE,
            customer_start=customer.call_window_start,
            customer_end=customer.call_window_end,
            shop_start=settings.QUIET_HOURS_END,
            shop_end=settings.QUIET_HOURS_START,
        )

        if next_allowed:
            # schedule with rq-scheduler
            scheduler = Scheduler(queue_name=settings.RQ_QUEUE, connection=Redis.from_url(settings.REDIS_URL))
            scheduler.enqueue_at(next_allowed, process_job_update_call, job_update_id)
            logger.info(f"JobUpdate {job_update_id} call deferred to {next_allowed} due to quiet hours")
            return

        try:
            record_flag = bool(shop.record_calls and (customer.recording_consent is None or customer.recording_consent))
            sid = create_outbound_call(call_id=call.id, to_number=customer.phone, needs_approval=ju.needs_approval, record=record_flag)
            call.twilio_sid = sid
            call.status = "initiated"
            db.add(call)
            db.commit()
            logger.info(f"Queued call {call.id} to {customer.phone} with Twilio SID {sid}")
        except Exception as e:
            logger.exception("Failed to create Twilio call: {}".format(e))
            call.status = "error"
            call.outcome = "twilio_error"
            db.add(call)
            db.commit()

    finally:
        db.close()
