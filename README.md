# OmniAgents Monorepo

A multi-language monorepo for your company’s AI agent stack. Structured for rapid product dev, compliance, and scale.

## Structure

- apps/
  - web/ — Next.js App Router marketing+app shell (consent-gated analytics, UI)
  - api/ — Node/Express service for leads, webhooks, CRM/Helpdesk
  - agents-hub/ — Python FastAPI for agent workflows (LangGraph/CrewAI-ready)
- packages/
  - shared/ — Shared types, zod schemas
  - ui/ — Reusable React UI components (e.g., CookieBanner)
  - agents-sdk/ — Lightweight SDK for API calls from apps/services
- infra/ — Placeholder for Docker, Terraform, k8s (add later)
- .github/workflows/ — CI pipelines (build, lint, test)

## Quickstart

- Requirements: Node 20+, pnpm 9+, Python 3.11+
- Install deps
  - pnpm install
- Dev
  - pnpm --filter @omniagents/web dev  # Next.js on 3000
  - pnpm --filter @omniagents/api dev  # API on 8080
  - uvicorn app.main:app --reload --port 8000 --app-dir apps/agents-hub  # Python API

## Analytics & Consent

- Consent lives in localStorage `omni_consent`.
- PostHog initialized only after acceptance.
- Set env vars for web app:
  - NEXT_PUBLIC_POSTHOG_KEY=<your_ph_key>
  - NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com (optional)

## Attribution

- First-touch UTM/referrer capture recommended in web app (client). Starter util provided; store in localStorage, attach to lead payloads.

## Migration note

- Your current single-file site `omni_agents_website.jsx` remains at repo root for reference.
- Migrate sections into `apps/web` incrementally, reusing `packages/ui` components and `packages/shared` schemas.

## Repo policies

- TypeScript for Node/Next packages, Python for agents.
- Lint/test/build via Turborepo. CI included.

## Directory map

```
.
├─ apps/
│  ├─ web/               # Next.js App Router app
│  ├─ api/               # Node/Express API
│  └─ agents-hub/        # FastAPI microservice
├─ packages/
│  ├─ shared/            # Types & schemas
│  ├─ ui/                # Reusable UI components
│  └─ agents-sdk/        # Client SDK
├─ infra/                # (Placeholder) infra configs
├─ .github/workflows/    # CI
├─ package.json          # workspace scripts
├─ pnpm-workspace.yaml   # workspaces
├─ turbo.json            # turborepo pipeline
└─ tsconfig.base.json    # TS base config
```
