from __future__ import annotations

from twilio.rest import Client
from app.config import settings


def send_sms(to: str, body: str) -> str:
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    msg = client.messages.create(to=to, from_=settings.TWILIO_CALLER_ID, body=body)
    return msg.sid
