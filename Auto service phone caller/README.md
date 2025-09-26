# Auto Service Phone Caller Platform

Phone-first customer communication platform for mechanic and service shops. Technicians update jobs; the system automatically calls customers with a natural AI voice to deliver updates, request approvals, and log outcomes. Text/SMS is used only as a fallback (voicemail summary, confirmation links). The phone call is the product.

## Core Value
- Save technician time by eliminating phone tag and interruptions
- Keep customers consistently informed with professional, short calls
- Give owners visibility and trust via complete call logs and outcomes

## Architecture Overview
- API: FastAPI (Python), Postgres (core data), Redis (events/queues)
- Voice: Twilio Programmable Voice, ElevenLabs Realtime Voice Agent
- Orchestration: n8n workflows for call lifecycles and follow-ups
- Eventing: Job updates -> enqueue call -> AI call -> callbacks -> logs
- Admin Dashboard (Next.js) for jobs, updates, calls, approvals (coming next)

## Features (Phase 1)
- Multi-tenant (shops, users)
- Jobs and Job Updates (status, summary, cost, notes, photos)
- Automatic call on update via AI voice
- Approvals: approve/decline/escalate during call
- Voicemail detection and SMS fallback
- Complete call records and transcripts
- Webhooks for Twilio/n8n status callbacks

## Roadmap
- Analytics: time-to-contact, approval rates, pickup time
- Customer preferences (call windows, language)
- SLA alerts and escalation routing
- Advanced approval flows (partial approvals, upsell options)
- Dashboard UI (Next.js + Tailwind + shadcn) with real-time updates

## Quickstart (Local, Docker Compose)
Prereqs: Docker Desktop, Make, ngrok (for public webhooks), Python 3.11 (optional for local-only running)

1. Copy and fill environment
```
cp .env.example .env
# Fill Twilio/ElevenLabs keys, ngrok base URL, etc.
```

2. Start core stack
```
make up
```
This starts Postgres, Redis, n8n, API, RQ worker, and RQ dashboard.

3. Run DB migrations
```
make migrate
```

4. Expose API publicly for Twilio/n8n callbacks
```
ngrok http 8000
# Set N8N_WEBHOOK_BASE_URL and TWILIO_WEBHOOK_BASE_URL to ngrok URL
```

5. Verify
- API: http://localhost:8000/health
- RQ Dashboard: http://localhost:9181
- n8n: http://localhost:5678

## Repository Layout
```
apps/
  api/                # FastAPI service
    app/
      routers/        # HTTP endpoints (jobs, webhooks, health)
      services/       # business logic (calls, approvals)
      events/         # RQ queue + tasks
      db.py           # SQLAlchemy engine/session
      models.py       # DB models
      schemas.py      # Pydantic DTOs
      config.py       # Settings via pydantic-settings
    alembic/          # migrations
    requirements.txt
    Dockerfile
infra/
  n8n/flows/          # n8n workflow JSON exports
  docker/             # future infra assets
.vscode/
```

## Environment Variables
See `.env.example` for full list, including:
- Postgres/Redis
- Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_CALLER_ID`
- ElevenLabs: `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`
- Webhook base URLs for ngrok

## Security & Compliance (Phase 1 Basics)
- Recording consent via opening line and regional toggle
- Call windows (quiet hours) per customer preference
- PII minimization and encryption-at-rest (DB config TBD)
- Audit logs for calls and approvals

## Development
- Python linting/formatting to be added (ruff/black)
- CI via GitHub Actions (coming)
- Frontend (Next.js) to be scaffolded next

## License
Proprietary. All rights reserved.
