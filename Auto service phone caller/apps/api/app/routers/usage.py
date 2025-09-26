from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.services.auth import get_current_user
from app.services.tenant import ensure_membership
from app.services.limits import get_usage_snapshot

router = APIRouter()


@router.get("/", response_model=dict)
def usage(shop_id: int = Query(...), db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ensure_membership(user, shop_id, db)
    return get_usage_snapshot(db, shop_id)
