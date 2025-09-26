from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.schemas import AppointmentCreate, AppointmentOut
from app.events.queue import enqueue_appt_reminder_task
from app.services.google_calendar import create_event
from app.services.auth import get_current_user
from app.services.tenant import ensure_membership
from app.services.entitlements import require_feature
from app.services.limits import require_outbound_call_quota, require_minutes_quota

router = APIRouter()


@router.post("/", response_model=AppointmentOut)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    shop = db.get(models.Shop, payload.shop_id)
    customer = db.get(models.Customer, payload.customer_id)
    if not shop or not customer:
        raise HTTPException(status_code=400, detail="Invalid shop or customer")
    ensure_membership(user, payload.shop_id, db)
    require_feature(shop.plan, "appointments")

    appt = models.Appointment(
        shop_id=payload.shop_id,
        customer_id=payload.customer_id,
        starts_at=payload.starts_at,
        ends_at=payload.ends_at,
        status=payload.status or "scheduled",
        location=payload.location,
        notes=payload.notes,
        calendar_provider=payload.calendar_provider,
        calendar_event_id=payload.calendar_event_id,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)

    # If Google Calendar linked, auto-create event when not provided
    if not appt.calendar_event_id:
        try:
            event_id = create_event(
                shop_id=appt.shop_id,
                summary=f"Service Appointment for Customer {appt.customer_id}",
                starts_at=appt.starts_at,
                ends_at=appt.ends_at,
                location=appt.location,
                description=appt.notes,
            )
            if event_id:
                appt.calendar_provider = "google"
                appt.calendar_event_id = event_id
                db.add(appt)
                db.commit()
                db.refresh(appt)
        except Exception:
            pass
    return appt


@router.get("/", response_model=list[AppointmentOut])
def list_appointments(shop_id: int = Query(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ensure_membership(user, shop_id, db)
    shop = db.get(models.Shop, shop_id)
    if shop:
        require_feature(shop.plan, "appointments")
    q = (
        db.query(models.Appointment)
        .filter(models.Appointment.shop_id == shop_id)
        .order_by(models.Appointment.starts_at.asc())
    )
    return q.all()


@router.post("/{appointment_id}/remind", response_model=dict)
def trigger_reminder(appointment_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    appt = db.get(models.Appointment, appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    ensure_membership(user, appt.shop_id, db)
    shop = db.get(models.Shop, appt.shop_id)
    if shop:
        require_feature(shop.plan, "outbound_reminders")
        # Quotas: outbound calls and monthly minutes
        require_outbound_call_quota(db, shop.id)
        require_minutes_quota(db, shop.id)

    job_id = enqueue_appt_reminder_task(appointment_id)
    return {"enqueued": True, "job_id": job_id}
