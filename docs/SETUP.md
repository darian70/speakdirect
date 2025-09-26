# Setup

## Requirements
- Node 20+
- pnpm 9+
- Python 3.11+

## Install
```bash
pnpm install
```

## Run
- Web (Next.js):
```bash
pnpm --filter @omniagents/web dev
```
- API (Express):
```bash
pnpm --filter @omniagents/api dev
```
- Agents Hub (FastAPI):
```bash
uvicorn app.main:app --reload --port 8000 --app-dir apps/agents-hub
```

## Environment
- apps/web:
  - NEXT_PUBLIC_POSTHOG_KEY=<your_posthog_key>
  - NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com (optional)
- apps/api: copy `.env.example` to `.env` and fill values if needed

## Notes
- Next.js imports packages/* via aliases in `apps/web/next.config.js`
- Consent gating controls analytics initialization; accept in the banner to enable tracking
