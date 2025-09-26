from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Core
    ENV: str = Field(default="development")
    BASE_URL: str = Field(default="http://localhost:8000")

    # DB
    DATABASE_URL: str = Field(default="postgresql+psycopg://autosvc:autosvc@db:5432/autosvc")

    # Redis / Queue
    REDIS_URL: str = Field(default="redis://redis:6379/0")
    RQ_QUEUE: str = Field(default="default")

    # API
    API_HOST: str = Field(default="0.0.0.0")
    API_PORT: int = Field(default=8000)

    # Twilio
    TWILIO_ACCOUNT_SID: str = Field(default="", description="Twilio Account SID")
    TWILIO_AUTH_TOKEN: str = Field(default="", description="Twilio Auth Token")
    TWILIO_CALLER_ID: str = Field(default="+15551234567")
    TWILIO_WEBHOOK_BASE_URL: str = Field(default="http://localhost:8000")
    TWILIO_VALIDATE_SIGNATURE: bool = Field(default=False, description="Validate Twilio webhook signatures")

    # ElevenLabs
    ELEVENLABS_API_KEY: str = Field(default="")
    ELEVENLABS_AGENT_ID: str = Field(default="")
    ELEVENLABS_VOICE_ID: str = Field(default="21m00Tcm4TlvDq8ikWAM")

    # Voice Bridge
    VOICE_BRIDGE_WSS_URL: str = Field(default="")

    # Recording / Compliance
    RECORD_CALLS: bool = Field(default=True)
    REGION: str = Field(default="US")
    QUIET_HOURS_START: str = Field(default="20:00")
    QUIET_HOURS_END: str = Field(default="08:00")
    DEFAULT_LOCALE: str = Field(default="en")
    DEFAULT_TIMEZONE: str = Field(default="America/Los_Angeles")

    # Google Calendar
    GOOGLE_CLIENT_ID: str = Field(default="")
    GOOGLE_CLIENT_SECRET: str = Field(default="")
    GOOGLE_REDIRECT_URI: str = Field(default="http://localhost:8000/integrations/google/callback")

    # Sentry
    SENTRY_DSN: str = Field(default="")

    # Auth / JWT
    JWT_SECRET: str = Field(default="devsecret_change_me")
    JWT_ALGORITHM: str = Field(default="HS256")
    JWT_EXPIRES_MINUTES: int = Field(default=60 * 24)

    # Admin
    ADMIN_EMAIL: str = Field(default="", description="Email address for platform admin")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
