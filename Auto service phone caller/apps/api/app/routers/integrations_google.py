from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.services.google_calendar import start_auth, exchange_code

router = APIRouter()


@router.get("/start", response_model=dict)
def google_start(shop_id: int = Query(...), db: Session = Depends(get_db)):
    shop = db.get(models.Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    url = start_auth(shop_id)
    return {"auth_url": url}


@router.get("/callback", response_model=dict)
def google_callback(code: str, state: str, db: Session = Depends(get_db)):
    try:
        shop_id = int(state)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid state")
    ok = exchange_code(shop_id, code)
    return {"ok": ok}
