from __future__ import annotations

from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo
from typing import Optional


def parse_hhmm(s: Optional[str]) -> Optional[time]:
    if not s:
        return None
    try:
        hh, mm = s.split(":")
        return time(int(hh), int(mm))
    except Exception:
        return None


def is_within_window(now: datetime, start: Optional[time], end: Optional[time]) -> bool:
    if not start or not end:
        return True
    start_dt = now.replace(hour=start.hour, minute=start.minute, second=0, microsecond=0)
    end_dt = now.replace(hour=end.hour, minute=end.minute, second=0, microsecond=0)
    if start_dt <= end_dt:
        return start_dt <= now <= end_dt
    # window wraps midnight
    return now >= start_dt or now <= end_dt


def next_window_start(now: datetime, start: Optional[time]) -> datetime:
    if not start:
        return now
    candidate = now.replace(hour=start.hour, minute=start.minute, second=0, microsecond=0)
    if candidate <= now:
        candidate = candidate + timedelta(days=1)
    return candidate


def compute_next_allowed(now_utc: datetime, *, customer_tz: Optional[str], shop_tz: str,
                         customer_start: Optional[str], customer_end: Optional[str],
                         shop_start: Optional[str], shop_end: Optional[str]) -> Optional[datetime]:
    tz = None
    try:
        tz = ZoneInfo(customer_tz or shop_tz)
    except Exception:
        return None
    local_now = now_utc.astimezone(tz)
    c_start = parse_hhmm(customer_start)
    c_end = parse_hhmm(customer_end)
    s_start = parse_hhmm(shop_start)
    s_end = parse_hhmm(shop_end)

    # Customer window takes precedence if set, otherwise shop window
    start = c_start or s_start
    end = c_end or s_end

    if is_within_window(local_now, start, end):
        return None  # already allowed

    start_dt = next_window_start(local_now, start)
    return start_dt.astimezone(ZoneInfo("UTC"))
