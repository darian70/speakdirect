from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.services.auth import get_current_user, hash_password
from app.services.tenant import require_role, ensure_membership

router = APIRouter()


@router.get("/", response_model=list[dict])
def list_users(shop_id: int = Query(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Owner or admin may view; members can also view their shop's users if desired.
    ensure_membership(current_user, shop_id, db)
    q = (
        db.query(models.User, models.Membership)
        .join(models.Membership, models.Membership.user_id == models.User.id)
        .filter(models.Membership.shop_id == shop_id)
        .order_by(models.User.created_at.desc())
    )
    items: list[dict] = []
    for user, mem in q.all():
        items.append({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": mem.role,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        })
    return items


@router.post("/", response_model=dict, status_code=201)
def create_user(
    shop_id: int,
    email: str,
    name: str,
    role: str = "tech",
    password: str | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Only owner/admin of this shop can create users in it
    require_role(current_user, shop_id, db, allowed={"owner", "admin"})

    if not email:
        raise HTTPException(status_code=400, detail="email is required")
    if db.query(models.User).filter(models.User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # Create user with optional password
    user = models.User(
        email=email,
        name=name or email,
        role=role if role else "tech",
        shop_id=shop_id,
        password_hash=hash_password(password or "changeme123"),
    )
    db.add(user)
    db.flush()

    # Create membership in the target shop
    mem = models.Membership(user_id=user.id, shop_id=shop_id, role=role if role else "tech")
    db.add(mem)

    db.commit()
    db.refresh(user)

    return {"id": user.id, "email": user.email, "name": user.name, "role": mem.role}
