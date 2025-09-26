from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from app.config import settings
from app.routers import health, jobs, webhooks_twilio, shops, customers, calls, appointments
from app.routers import integrations_google
from app.routers import analytics
from app.routers import auth, phone_numbers, agents
from app.routers import usage
from app.routers import users
import sentry_sdk
import os

if settings and getattr(settings, "__dict__", None):
    dsn = os.getenv("SENTRY_DSN", "")
    if dsn:
        sentry_sdk.init(dsn=dsn, traces_sample_rate=0.2)

app = FastAPI(title="Auto Service Phone Caller API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static media (TTS audio)
app.mount("/media", StaticFiles(directory="app/media"), name="media")

# Routers
app.include_router(health.router)
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(webhooks_twilio.router, prefix="/twilio", tags=["twilio"])
app.include_router(shops.router, prefix="/shops", tags=["shops"])
app.include_router(customers.router, prefix="/customers", tags=["customers"])
app.include_router(calls.router, prefix="/calls", tags=["calls"])
app.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
app.include_router(integrations_google.router, prefix="/integrations/google", tags=["integrations-google"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(phone_numbers.router, prefix="/phone-numbers", tags=["phone-numbers"])
app.include_router(agents.router, prefix="/agents", tags=["agents"])
app.include_router(usage.router, prefix="/usage", tags=["usage"])
app.include_router(users.router, prefix="/users", tags=["users"])


@app.get("/health")
def healthcheck():
    return {"status": "ok", "env": settings.ENV}
