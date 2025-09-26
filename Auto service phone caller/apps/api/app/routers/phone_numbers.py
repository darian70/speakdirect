from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db import get_db
from app import models
from app.services.auth import get_current_user
from app.services.tenant import ensure_membership, require_role, get_active_shop_id
from app.services.limits import require_phone_number_quota

router = APIRouter()


class PhoneNumberCreate(BaseModel):
    shop_id: int
    number: str
    provider: str | None = "twilio"
    friendly_name: str | None = None


class PhoneNumberOut(BaseModel):
    id: int
    shop_id: int
    provider: str
    number: str
    friendly_name: str | None
    status: str

    class Config:
        from_attributes = True


@router.get("/", response_model=list[PhoneNumberOut])
def list_numbers(request: Request, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    shop_id = get_active_shop_id(request, user, db)
    ensure_membership(user, shop_id, db)
    rows = db.query(models.PhoneNumber).filter(models.PhoneNumber.shop_id == shop_id).order_by(models.PhoneNumber.created_at.desc()).all()
    return [PhoneNumberOut.model_validate(r) for r in rows]


@router.post("/", response_model=PhoneNumberOut)
def create_number(payload: PhoneNumberCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ensure_membership(user, payload.shop_id, db)
    require_role(user, payload.shop_id, db, {"owner", "admin", "manager"})
    # Enforce plan quota for phone numbers count
    require_phone_number_quota(db, payload.shop_id)

    # Enforce unique number globally
    existing = db.query(models.PhoneNumber).filter(models.PhoneNumber.number == payload.number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already linked to a shop")

    row = models.PhoneNumber(
        shop_id=payload.shop_id,
        provider=payload.provider or "twilio",
        number=payload.number,
        friendly_name=payload.friendly_name,
        status="active",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return PhoneNumberOut.model_validate(row)
