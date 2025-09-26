from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.services.auth import get_current_user
from app.services.tenant import ensure_membership

router = APIRouter()


@router.post("/", response_model=dict)
def create_customer(
    shop_id: int,
    name: str,
    phone: str,
    preferred_language: str | None = None,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    shop = db.get(models.Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    ensure_membership(user, shop_id, db)
    customer = models.Customer(
        shop_id=shop_id, name=name, phone=phone, preferred_language=preferred_language or "en"
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return {"id": customer.id, "name": customer.name, "phone": customer.phone}


@router.get("/", response_model=list[dict])
def list_customers(shop_id: int = Query(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ensure_membership(user, shop_id, db)
    items = (
        db.query(models.Customer)
        .filter(models.Customer.shop_id == shop_id)
        .order_by(models.Customer.created_at.desc())
        .all()
    )
    return [
        {
            "id": c.id,
            "name": c.name,
            "phone": c.phone,
            "preferred_language": c.preferred_language,
        }
        for c in items
    ]
