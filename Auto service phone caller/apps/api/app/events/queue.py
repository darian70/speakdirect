from __future__ import annotations

from rq import Queue, Retry
from redis import Redis
from app.config import settings


def get_queue() -> Queue:
    redis = Redis.from_url(settings.REDIS_URL)
    return Queue(settings.RQ_QUEUE, connection=redis)


def enqueue_call_task(job_update_id: int) -> str:
    # Lazy import to avoid circulars at module import time
    from app.events.tasks.call_tasks import process_job_update_call

    q = get_queue()
    job = q.enqueue(process_job_update_call, job_update_id, retry=Retry(max=3), job_timeout=600)
    return job.id


def enqueue_appt_reminder_task(appointment_id: int) -> str:
    from app.events.tasks.appt_tasks import process_appt_reminder_call

    q = get_queue()
    job = q.enqueue(process_appt_reminder_call, appointment_id, retry=Retry(max=3), job_timeout=600)
    return job.id
