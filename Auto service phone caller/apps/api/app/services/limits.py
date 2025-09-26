from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import and_, func
from sqlalchemy.orm import Session

from app import models


@dataclass
class PlanLimits:
    outbound_calls_per_month: Optional[int]  # None = unlimited
    minutes_per_month: Optional[int]        # None = unlimited
    agents_per_shop: Optional[int]
    phone_numbers_per_shop: Optional[int]


PLAN_LIMITS: dict[str, PlanLimits] = {
    "basic_answer": PlanLimits(
        outbound_calls_per_month=0, minutes_per_month=0, agents_per_shop=1, phone_numbers_per_shop=1
    ),
    "assistant_calendar": PlanLimits(
        outbound_calls_per_month=50, minutes_per_month=200, agents_per_shop=2, phone_numbers_per_shop=1
    ),
    "assistant_outbound": PlanLimits(
        outbound_calls_per_month=200, minutes_per_month=1000, agents_per_shop=3, phone_numbers_per_shop=2
    ),
    "service_shop": PlanLimits(
        outbound_calls_per_month=1000, minutes_per_month=5000, agents_per_shop=5, phone_numbers_per_shop=3
    ),
}


def get_plan_limits(plan: str) -> PlanLimits:
    return PLAN_LIMITS.get(plan, PLAN_LIMITS["basic_answer"])  # default conservative


def _month_bounds_utc(now: Optional[datetime] = None) -> tuple[datetime, datetime]:
    now = now or datetime.now(tz=timezone.utc)
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    if start.month == 12:
        end = start.replace(year=start.year + 1, month=1)
    else:
        end = start.replace(month=start.month + 1)
    return start, end


def count_outbound_calls_mtd(db: Session, shop_id: int) -> int:
    month_start, _ = _month_bounds_utc()
    q = (
        db.query(func.count(models.Call.id))
        .filter(
            and_(
                models.Call.shop_id == shop_id,
                models.Call.created_at >= month_start,
                models.Call.call_type.in_(["job_update", "appt_reminder"]),
            )
        )
    )
    return int(q.scalar() or 0)


def sum_minutes_mtd(db: Session, shop_id: int) -> int:
    month_start, _ = _month_bounds_utc()
    # Sum completed call durations in minutes for the month
    seconds = (
        db.query(
            func.sum(
                func.extract("epoch", (models.Call.ended_at - models.Call.started_at))
            )
        )
        .filter(
            and_(
                models.Call.shop_id == shop_id,
                models.Call.created_at >= month_start,
                models.Call.started_at.isnot(None),
                models.Call.ended_at.isnot(None),
            )
        )
        .scalar()
        or 0
    )
    minutes = int(seconds // 60)
    return minutes


def require_outbound_call_quota(db: Session, shop_id: int) -> None:
    shop = db.get(models.Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    limits = get_plan_limits(shop.plan)
    # Calls per month limit
    if limits.outbound_calls_per_month is not None:
        used = count_outbound_calls_mtd(db, shop_id)
        if used >= limits.outbound_calls_per_month:
            raise HTTPException(
                status_code=403,
                detail="Monthly outbound call limit reached for your plan. Please upgrade in Settings → Onboarding.",
            )


def get_usage_snapshot(db: Session, shop_id: int) -> dict:
    shop = db.get(models.Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    limits = get_plan_limits(shop.plan)
    month_start, month_end = _month_bounds_utc()
    return {
        "shop_id": shop_id,
        "plan": shop.plan,
        "limits": {
            "outbound_calls_per_month": limits.outbound_calls_per_month,
            "minutes_per_month": limits.minutes_per_month,
            "agents_per_shop": limits.agents_per_shop,
            "phone_numbers_per_shop": limits.phone_numbers_per_shop,
        },
        "usage": {
            "outbound_calls_mtd": count_outbound_calls_mtd(db, shop_id),
            "minutes_mtd": sum_minutes_mtd(db, shop_id),
        },
        "month": {
            "start": month_start.isoformat(),
            "end": month_end.isoformat(),
        },
    }


def require_minutes_quota(db: Session, shop_id: int) -> None:
    """Enforce monthly minutes cap. Conservative: block when used >= limit.

    We do not estimate upcoming call duration here; we simply prevent new
    outbound calls if minutes MTD already meet the plan's limit.
    """
    shop = db.get(models.Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    limits = get_plan_limits(shop.plan)
    if limits.minutes_per_month is None:
        return
    used = sum_minutes_mtd(db, shop_id)
    if used >= limits.minutes_per_month:
        raise HTTPException(
            status_code=403,
            detail="Monthly minutes limit reached for your plan. Please upgrade in Settings → Onboarding.",
        )


def require_agent_quota(db: Session, shop_id: int) -> None:
    shop = db.get(models.Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    limits = get_plan_limits(shop.plan)
    if limits.agents_per_shop is None:
        return
    count = db.query(models.Agent).filter(models.Agent.shop_id == shop_id).count()
    if count >= limits.agents_per_shop:
        raise HTTPException(
            status_code=403,
            detail="Agent limit reached for your plan. Please upgrade in Settings → Onboarding.",
        )


def require_phone_number_quota(db: Session, shop_id: int) -> None:
    shop = db.get(models.Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    limits = get_plan_limits(shop.plan)
    if limits.phone_numbers_per_shop is None:
        return
    count = db.query(models.PhoneNumber).filter(models.PhoneNumber.shop_id == shop_id).count()
    if count >= limits.phone_numbers_per_shop:
        raise HTTPException(
            status_code=403,
            detail="Phone number limit reached for your plan. Please upgrade in Settings → Onboarding.",
        )
