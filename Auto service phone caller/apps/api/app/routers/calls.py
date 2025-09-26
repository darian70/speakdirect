from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.schemas import CallOut
from app.services.auth import get_current_user
from app.services.tenant import ensure_membership
from app.services.entitlements import require_feature

router = APIRouter()


@router.get("/", response_model=list[CallOut])
def list_calls(
    shop_id: int = Query(...),
    call_type: str | None = Query(None),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    ensure_membership(user, shop_id, db)
    # Feature: call logs
    shop = db.get(models.Shop, shop_id)
    if shop:
        require_feature(shop.plan, "call_logs")
    q = db.query(models.Call).filter(models.Call.shop_id == shop_id)
    if call_type:
        q = q.filter(models.Call.call_type == call_type)
    q = q.order_by(models.Call.created_at.desc())
    return q.all()


@router.get("/{call_id}", response_model=CallOut)
def get_call(call_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    call = db.get(models.Call, call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    ensure_membership(user, call.shop_id, db)
    shop = db.get(models.Shop, call.shop_id)
    if shop:
        require_feature(shop.plan, "call_logs")
    return call
