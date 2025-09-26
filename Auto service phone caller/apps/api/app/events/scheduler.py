from __future__ import annotations

from datetime import datetime, timedelta, timezone
from rq_scheduler import Scheduler
from redis import Redis
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app import models
from app.config import settings
from app.events.tasks.appt_tasks import process_appt_reminder_call


def scan_upcoming_appointments(window_minutes: int = 180) -> int:
    """Find upcoming appointments and enqueue reminders if not already queued/sent recently.

    Returns number of reminders scheduled.
    """
    db: Session = SessionLocal()
    scheduled = 0
    try:
        now = datetime.now(timezone.utc)
        end = now + timedelta(minutes=window_minutes)
        # Pick scheduled appointments starting within window
        appts = (
            db.query(models.Appointment)
            .filter(models.Appointment.status == "scheduled")
            .filter(models.Appointment.starts_at >= now)
            .filter(models.Appointment.starts_at <= end)
            .all()
        )
        r = Redis.from_url(settings.REDIS_URL)
        scheduler = Scheduler(queue_name=settings.RQ_QUEUE, connection=r)

        for appt in appts:
            # Skip if a reminder call exists for this appointment recently
            existing_call = (
                db.query(models.Call)
                .filter(models.Call.appointment_id == appt.id, models.Call.call_type == "appt_reminder")
                .order_by(models.Call.created_at.desc())
                .first()
            )
            if existing_call:
                continue
            scheduler.enqueue(process_appt_reminder_call, appt.id)
            scheduled += 1
        return scheduled
    finally:
        db.close()


if __name__ == "__main__":
    # Register a repeating job every 5 minutes
    r = Redis.from_url(settings.REDIS_URL)
    scheduler = Scheduler(queue_name=settings.RQ_QUEUE, connection=r)
    # Remove prior jobs with same func if duplicated
    for job in scheduler.get_jobs():
        if job.func_name.endswith("scan_upcoming_appointments"):
            scheduler.cancel(job)
    scheduler.schedule(
        scheduled_time=datetime.utcnow(),  # run immediately
        func=scan_upcoming_appointments,
        args=[180],
        interval=300,  # 5 minutes
        repeat=None,
    )
