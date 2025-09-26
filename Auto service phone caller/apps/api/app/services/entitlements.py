from __future__ import annotations

from typing import Literal
from fastapi import HTTPException

Plan = Literal["basic_answer", "assistant_calendar", "assistant_outbound", "service_shop"]

FEATURES_BY_PLAN: dict[Plan, set[str]] = {
    "basic_answer": {"inbound_answer", "call_logs"},
    "assistant_calendar": {"inbound_answer", "call_logs", "appointments"},
    "assistant_outbound": {"inbound_answer", "call_logs", "appointments", "outbound_reminders"},
    "service_shop": {
        "inbound_answer",
        "call_logs",
        "appointments",
        "outbound_reminders",
        "job_update_calls",
        "technician_ui",
    },
}


def has_feature(plan: Plan, feature: str) -> bool:
    allowed = FEATURES_BY_PLAN.get(plan, set())
    return feature in allowed


def require_feature(shop_plan: str, feature: str):
    if not has_feature(shop_plan, feature):
        raise HTTPException(status_code=403, detail=f"Feature '{feature}' not enabled for plan '{shop_plan}'")
