from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.services.auth import get_current_user
from app.services.tenant import ensure_membership

router = APIRouter()


@router.get("/summary", response_model=dict)
def summary(shop_id: int = Query(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ensure_membership(user, shop_id, db)
    # Total calls
    total_calls = db.query(func.count(models.Call.id)).filter(models.Call.shop_id == shop_id).scalar() or 0

    # Answered calls
    answered_calls = (
        db.query(func.count(models.Call.id))
        .filter(models.Call.shop_id == shop_id, models.Call.status == "answered")
        .scalar()
        or 0
    )

    # Machine detections (Twilio AnsweredBy stored in outcome)
    machine_calls = (
        db.query(func.count(models.Call.id))
        .filter(models.Call.shop_id == shop_id, models.Call.outcome == "machine")
        .scalar()
        or 0
    )

    # Approval metrics for job updates
    needs_approval = (
        db.query(func.count(models.JobUpdate.id))
        .join(models.Job, models.JobUpdate.job_id == models.Job.id)
        .filter(models.Job.shop_id == shop_id, models.JobUpdate.needs_approval.is_(True))
        .scalar()
        or 0
    )
    approved = (
        db.query(func.count(models.JobUpdate.id))
        .join(models.Job, models.JobUpdate.job_id == models.Job.id)
        .filter(models.Job.shop_id == shop_id, models.JobUpdate.approved.is_(True))
        .scalar()
        or 0
    )

    # Average time-to-contact: from JobUpdate.created_at to Call.started_at for job_update calls
    q = (
        db.query(models.JobUpdate.created_at, models.Call.started_at)
        .join(models.Job, models.JobUpdate.job_id == models.Job.id)
        .join(models.Call, models.Call.job_update_id == models.JobUpdate.id)
        .filter(models.Job.shop_id == shop_id, models.Call.call_type == "job_update", models.Call.started_at.isnot(None))
    )
    deltas = []
    for ju_created_at, call_started_at in q.all():
        try:
            deltas.append((call_started_at - ju_created_at).total_seconds())
        except Exception:
            continue
    avg_time_to_contact = (sum(deltas) / len(deltas)) if deltas else None

    return {
        "total_calls": total_calls,
        "answered_calls": answered_calls,
        "machine_calls": machine_calls,
        "approval": {
            "needs_approval": needs_approval,
            "approved": approved,
            "approval_rate": (approved / needs_approval) if needs_approval else None,
        },
        "avg_time_to_contact_seconds": avg_time_to_contact,
        "call_success_rate": (answered_calls / total_calls) if total_calls else None,
    }
