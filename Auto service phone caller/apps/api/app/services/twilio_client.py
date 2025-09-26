from __future__ import annotations

from urllib.parse import urlencode
from twilio.rest import Client

from app.config import settings


def get_client() -> Client:
    return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)


def create_outbound_call(*, call_id: int, to_number: str, needs_approval: bool, record: bool = True) -> str:
    """Create an outbound call via Twilio and return the Call SID."""
    client = get_client()

    answer_params = {"call_id": call_id}
    answer_url = f"{settings.TWILIO_WEBHOOK_BASE_URL}/twilio/answer?{urlencode(answer_params)}"

    status_params = {"call_id": call_id}
    status_url = f"{settings.TWILIO_WEBHOOK_BASE_URL}/twilio/status?{urlencode(status_params)}"

    # Basic AMD and recording enabled
    call = client.calls.create(
        to=to_number,
        from_=settings.TWILIO_CALLER_ID,
        url=answer_url,
        status_callback=status_url,
        status_callback_method="POST",
        status_callback_event=["initiated", "ringing", "answered", "completed"],
        machine_detection="Enable",
        record="record-from-answer" if record else "do-not-record",
    )

    return call.sid
