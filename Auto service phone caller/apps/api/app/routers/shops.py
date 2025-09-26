from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.services.auth import get_current_user
from app.config import settings
from app.services.tenant import require_role

router = APIRouter()


def _is_admin(user: models.User) -> bool:
    admin_email = (settings.ADMIN_EMAIL or "").strip().lower()
    return bool(admin_email) and (user.email or "").lower() == admin_email


@router.post("/", response_model=dict)
def create_shop(
    name: str,
    plan: str | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not _is_admin(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    if not name:
        raise HTTPException(status_code=400, detail="name is required")
    shop = models.Shop(name=name, plan=plan or "basic_answer")
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return {"id": shop.id, "name": shop.name, "plan": shop.plan}


@router.get("/", response_model=list[dict])
def list_shops(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Return shops the current user is a member of (including legacy primary shop_id)
    q = (
        db.query(models.Shop)
        .join(models.Membership, models.Membership.shop_id == models.Shop.id)
        .filter(models.Membership.user_id == current_user.id)
        .order_by(models.Shop.created_at.desc())
    )
    shops = list(q.all())
    # Ensure legacy primary shop is included
    if current_user.shop_id:
        s = db.get(models.Shop, current_user.shop_id)
        if s and all(x.id != s.id for x in shops):
            shops.append(s)
    return [{"id": s.id, "name": s.name, "plan": s.plan} for s in shops]


@router.get("/admin", response_model=list[dict])
def list_shops_admin(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not _is_admin(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    shops = db.query(models.Shop).order_by(models.Shop.created_at.desc()).all()
    return [{"id": s.id, "name": s.name, "plan": s.plan} for s in shops]


@router.post("/{shop_id}/plan", response_model=dict)
def update_plan(
    shop_id: int,
    plan: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Require owner/admin of this shop
    require_role(current_user, shop_id, db, allowed={"owner", "admin"})
    shop = db.get(models.Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    shop.plan = plan
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return {"id": shop.id, "name": shop.name, "plan": shop.plan}


@router.post("/{shop_id}/settings", response_model=dict)
def update_settings(
    shop_id: int,
    record_calls: bool | None = None,
    default_timezone: str | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Require owner/admin of this shop
    require_role(current_user, shop_id, db, allowed={"owner", "admin"})
    shop = db.get(models.Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    if record_calls is not None:
        shop.record_calls = bool(record_calls)
    if default_timezone:
        shop.default_timezone = default_timezone
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return {"id": shop.id, "name": shop.name, "plan": shop.plan, "record_calls": shop.record_calls, "default_timezone": shop.default_timezone}
