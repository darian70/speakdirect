from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.schemas import JobCreate, JobOut, JobUpdateCreate, JobUpdateOut, CallOut
from app.services.auth import get_current_user
from app.services.tenant import ensure_membership, require_role
from app.events.queue import enqueue_call_task
from app.services.entitlements import require_feature
from app.services.limits import require_outbound_call_quota, require_minutes_quota
from app.schemas import JobSummaryOut, CustomerLiteOut

router = APIRouter()


@router.post("/", response_model=JobOut)
def create_job(payload: JobCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    # Ensure shop/customer exist
    shop = db.get(models.Shop, payload.shop_id)
    customer = db.get(models.Customer, payload.customer_id)
    if not shop or not customer:
        raise HTTPException(status_code=400, detail="Invalid shop or customer")
    # Tenant membership check
    ensure_membership(user, payload.shop_id, db)

    job = models.Job(
        shop_id=payload.shop_id,
        customer_id=payload.customer_id,
        vehicle_id=payload.vehicle_id,
        status=payload.status or "open",
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/my", response_model=list[JobSummaryOut])
def my_jobs(shop_id: int = Query(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ensure_membership(user, shop_id, db)
    shop = db.get(models.Shop, shop_id)
    if shop:
        require_feature(shop.plan, "technician_ui")
    # Jobs assigned to current user
    rows = (
        db.query(models.Job, models.Customer)
        .join(models.Customer, models.Job.customer_id == models.Customer.id)
        .filter(models.Job.shop_id == shop_id, models.Job.assigned_user_id == user.id)
        .order_by(models.Job.created_at.desc())
        .all()
    )
    out: list[JobSummaryOut] = []
    for job, cust in rows:
        out.append(
            JobSummaryOut(
                id=job.id,
                status=job.status,
                created_at=job.created_at,
                customer=CustomerLiteOut(id=cust.id, name=cust.name, phone=cust.phone),
            )
        )
    return out


@router.get("/queue", response_model=list[JobSummaryOut])
def queue_jobs(shop_id: int = Query(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ensure_membership(user, shop_id, db)
    shop = db.get(models.Shop, shop_id)
    if shop:
        require_feature(shop.plan, "technician_ui")
    # Unassigned, open jobs in this shop
    rows = (
        db.query(models.Job, models.Customer)
        .join(models.Customer, models.Job.customer_id == models.Customer.id)
        .filter(models.Job.shop_id == shop_id, models.Job.assigned_user_id.is_(None), models.Job.status != "completed")
        .order_by(models.Job.created_at.desc())
        .all()
    )
    out: list[JobSummaryOut] = []
    for job, cust in rows:
        out.append(
            JobSummaryOut(
                id=job.id,
                status=job.status,
                created_at=job.created_at,
                customer=CustomerLiteOut(id=cust.id, name=cust.name, phone=cust.phone),
            )
        )
    return out


@router.post("/{job_id}/assign", response_model=JobOut)
def assign_job(job_id: int, user_id: int | None = Query(None), db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    ensure_membership(user, job.shop_id, db)
    shop = db.get(models.Shop, job.shop_id)
    if shop:
        require_feature(shop.plan, "technician_ui")
    # If assigning to someone else, require admin/owner/manager; otherwise allow self-assign
    target_user_id = user_id or user.id
    if target_user_id != user.id:
        require_role(user, job.shop_id, db, {"owner", "admin", "manager"})
    # Ensure target user is a member of the shop
    target_user = db.get(models.User, target_user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    # simple membership check via Membership table
    mem = (
        db.query(models.Membership)
        .filter(models.Membership.user_id == target_user_id, models.Membership.shop_id == job.shop_id)
        .first()
    )
    if not mem:
        raise HTTPException(status_code=403, detail="User is not a member of this shop")
    job.assigned_user_id = target_user_id
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.post("/{job_id}/status", response_model=JobOut)
def update_job_status(job_id: int, status: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    ensure_membership(user, job.shop_id, db)
    shop = db.get(models.Shop, job.shop_id)
    if shop:
        require_feature(shop.plan, "technician_ui")
    # Allow assigned tech or admin/owner/manager
    if job.assigned_user_id != user.id:
        require_role(user, job.shop_id, db, {"owner", "admin", "manager"})
    job.status = status
    db.add(job)
    db.commit()
    db.refresh(job)
    return job
@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    ensure_membership(user, job.shop_id, db)
    return job


@router.post("/{job_id}/updates", response_model=JobUpdateOut)
def create_job_update(job_id: int, payload: JobUpdateCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    ensure_membership(user, job.shop_id, db)
    # Feature gate: job update calls are only for certain plans
    shop = db.get(models.Shop, job.shop_id)
    if shop:
        require_feature(shop.plan, "job_update_calls")
        # Quotas: outbound calls and monthly minutes
        require_outbound_call_quota(db, shop.id)
        require_minutes_quota(db, shop.id)

    ju = models.JobUpdate(
        job_id=job.id,
        status=payload.status,
        summary=payload.summary,
        cost=payload.cost,
        needs_approval=payload.needs_approval,
        notes=payload.notes,
    )
    db.add(ju)
    db.commit()
    db.refresh(ju)

    # Enqueue call task
    enqueue_call_task(ju.id)

    return ju


@router.get("/{job_id}/updates", response_model=list[JobUpdateOut])
def list_job_updates(job_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    ensure_membership(user, job.shop_id, db)
    return job.updates


@router.get("/{job_id}/calls", response_model=list[CallOut])
def list_job_calls(job_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    job = db.get(models.Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    ensure_membership(user, job.shop_id, db)
    calls = db.query(models.Call).filter(models.Call.job_id == job_id).order_by(models.Call.created_at.desc()).all()
    return calls


@router.get("/", response_model=list[JobOut])
def list_jobs(shop_id: int = Query(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ensure_membership(user, shop_id, db)
    items = (
        db.query(models.Job)
        .filter(models.Job.shop_id == shop_id)
        .order_by(models.Job.created_at.desc())
        .all()
    )
    return items
