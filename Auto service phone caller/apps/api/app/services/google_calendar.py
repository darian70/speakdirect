from __future__ import annotations

import json
from typing import Optional
from datetime import datetime, timedelta

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from app.config import settings
from app.db import SessionLocal
from app import models


SCOPES = [
    "https://www.googleapis.com/auth/calendar.events",
]


def _get_flow() -> Flow:
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": settings.__dict__.get("GOOGLE_CLIENT_ID", ""),
                "client_secret": settings.__dict__.get("GOOGLE_CLIENT_SECRET", ""),
                "redirect_uris": [settings.__dict__.get("GOOGLE_REDIRECT_URI", "http://localhost:8000/integrations/google/callback")],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
    )
    flow.redirect_uri = settings.__dict__.get("GOOGLE_REDIRECT_URI", "http://localhost:8000/integrations/google/callback")
    return flow


def start_auth(shop_id: int) -> str:
    flow = _get_flow()
    auth_url, _ = flow.authorization_url(prompt="consent", access_type="offline", include_granted_scopes="true", state=str(shop_id))
    return auth_url


def exchange_code(shop_id: int, code: str) -> bool:
    flow = _get_flow()
    flow.fetch_token(code=code)
    creds = flow.credentials
    token_json = json.dumps({
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": creds.scopes,
    })
    db = SessionLocal()
    try:
        ic = models.IntegrationCredential(shop_id=shop_id, provider="google", token_json=token_json)
        db.add(ic)
        db.commit()
        return True
    finally:
        db.close()


def _get_creds_for_shop(shop_id: int) -> Optional[Credentials]:
    db = SessionLocal()
    try:
        ic = (
            db.query(models.IntegrationCredential)
            .filter(models.IntegrationCredential.shop_id == shop_id, models.IntegrationCredential.provider == "google")
            .order_by(models.IntegrationCredential.created_at.desc())
            .first()
        )
        if not ic:
            return None
        data = json.loads(ic.token_json)
        creds = Credentials(
            token=data.get("token"),
            refresh_token=data.get("refresh_token"),
            client_id=data.get("client_id"),
            client_secret=data.get("client_secret"),
            scopes=data.get("scopes"),
        )
        return creds
    finally:
        db.close()


def create_event(shop_id: int, summary: str, starts_at: datetime, ends_at: Optional[datetime], location: Optional[str], description: Optional[str]) -> Optional[str]:
    creds = _get_creds_for_shop(shop_id)
    if not creds:
        return None
    service = build("calendar", "v3", credentials=creds)
    event = {
        "summary": summary,
        "start": {"dateTime": starts_at.isoformat()},
        "end": {"dateTime": (ends_at or (starts_at + timedelta(hours=1))).isoformat()},
        "location": location,
        "description": description,
    }
    created = service.events().insert(calendarId="primary", body=event).execute()
    return created.get("id")
