from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.schemas import SignupIn, LoginIn, AuthOut, UserOut
from app.services.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


@router.post("/signup", response_model=AuthOut)
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    # Check existing user
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create shop (tenant)
    shop = models.Shop(name=payload.shop_name)
    db.add(shop)
    db.flush()  # get id

    # Create user (owner)
    user = models.User(
        email=payload.email,
        name=payload.name,
        role="owner",
        shop_id=shop.id,  # legacy primary association
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.flush()

    # Create membership
    mem = models.Membership(user_id=user.id, shop_id=shop.id, role="owner")
    db.add(mem)

    db.commit()

    token = create_access_token({"sub": str(user.id)})
    return AuthOut(access_token=token, user=UserOut.model_validate(user), default_shop_id=shop.id)


@router.post("/login", response_model=AuthOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    # default shop preference: user.shop_id
    return AuthOut(access_token=token, user=UserOut.model_validate(user), default_shop_id=user.shop_id)


@router.get("/me", response_model=UserOut)
def me(user: models.User = Depends(get_current_user)):
    return UserOut.model_validate(user)
