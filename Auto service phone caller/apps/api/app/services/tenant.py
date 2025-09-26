from __future__ import annotations

from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from app import models


def ensure_membership(user: models.User, shop_id: int, db: Session) -> None:
    # allow legacy user.shop_id or membership
    if user.shop_id == shop_id:
        return
    exists = (
        db.query(models.Membership)
        .filter(models.Membership.user_id == user.id, models.Membership.shop_id == shop_id)
        .first()
    )
    if not exists:
        raise HTTPException(status_code=403, detail="Not a member of this shop")


def get_active_shop_id(request: Request, user: models.User, db: Session) -> int:
    # Preference order: header -> query -> user.shop_id -> first membership
    hdr = request.headers.get("X-Shop-Id")
    if hdr:
        try:
            return int(hdr)
        except Exception:
            pass
    shop_qs = request.query_params.get("shop_id")
    if shop_qs:
        try:
            return int(shop_qs)
        except Exception:
            pass
    if user.shop_id:
        return user.shop_id
    # fallback: first membership
    m = (
        db.query(models.Membership)
        .filter(models.Membership.user_id == user.id)
        .order_by(models.Membership.created_at.asc())
        .first()
    )
    if not m:
        raise HTTPException(status_code=400, detail="No associated shop for user")
    return m.shop_id


def require_role(user: models.User, shop_id: int, db: Session, allowed: set[str] | list[str]) -> None:
    # Treat legacy user.role for primary shop
    allowed_set = set(allowed)
    if user.shop_id == shop_id and user.role in allowed_set:
        return
    m = (
        db.query(models.Membership)
        .filter(models.Membership.user_id == user.id, models.Membership.shop_id == shop_id)
        .first()
    )
    role = m.role if m else None
    if not role or role not in allowed_set:
        raise HTTPException(status_code=403, detail="Insufficient role for this action")
