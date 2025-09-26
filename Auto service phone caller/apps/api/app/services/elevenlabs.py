from __future__ import annotations

import uuid
from pathlib import Path
import httpx
from typing import Tuple

from app.config import settings


def synthesize_to_file(text: str, voice_id: str | None = None, filename: str | None = None) -> Tuple[str, str]:
    """
    Synthesizes speech using ElevenLabs and writes an mp3 file under app/media/tts.

    Returns:
        (filesystem_path, public_uri) where public_uri is served under /media.
    """
    if not text or not text.strip():
        raise ValueError("Text is required for TTS")

    voice_id = voice_id or settings.ELEVENLABS_VOICE_ID

    media_dir = Path(__file__).resolve().parents[1] / "media" / "tts"
    media_dir.mkdir(parents=True, exist_ok=True)

    filename = filename or f"{uuid.uuid4().hex}.mp3"
    dest_path = media_dir / filename

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": settings.ELEVENLABS_API_KEY,
        "accept": "audio/mpeg",
        "content-type": "application/json",
    }
    payload = {
        "text": text,
        # Sensible defaults; can be made configurable per shop/customer later
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8,
            "style": 0.0,
            "use_speaker_boost": True,
        },
    }

    with httpx.Client(timeout=60.0) as client:
        resp = client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        dest_path.write_bytes(resp.content)

    public_uri = f"/media/tts/{filename}"
    return str(dest_path), public_uri
