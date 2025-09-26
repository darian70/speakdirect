# OmniAgents Monorepo Architecture

## Top-level
- apps/ — Product-facing apps and services
- packages/ — Shared libraries reused by apps
- infra/ — Placeholder for deployment/infra (k8s/Terraform/Docker)
- .github/workflows/ — CI config

## Apps
- apps/web/ (Next.js)
  - app/ — App Router pages (layout.tsx, page.tsx)
  - lib/ — Client libs (analytics, api clients)
  - next.config.js — Aliases to packages/* for DX
  - Uses consent-gated PostHog via env vars
- apps/api/ (Node/Express)
  - src/server.ts — REST endpoints
    - GET /health — liveness
    - POST /leads — accepts lead payloads; echoes consent/attribution
  - .env.example — config template
- apps/agents-hub/ (Python/FastAPI)
  - app/main.py — API skeleton for agent workflows
  - requirements.txt — server deps

## Packages
- packages/ui/
  - src/CookieBanner.tsx — Consent banner component
  - src/index.ts — Exports from UI package
- packages/shared/
  - src/schemas.ts — Zod schemas (LeadSchema)
  - src/index.ts — Exports
- packages/agents-sdk/
  - src/index.ts — Minimal SDK (submitLead)

## Cross-cutting concerns
- Consent: localStorage key `omni_consent` (accepted|declined|unknown)
- Attribution: store first-touch UTM/referrer in `omni_attrib` (client); attach to lead payload as `x_attribution`
- Analytics: PostHog loads only after consent is accepted
- CI: Turbo tasks build/lint/test; cached outputs in dist/.next/build

## Data flow (happy path)
1) Visitor lands on web → CookieBanner prompts consent
2) On accept → PostHog initialized; `page_view` tracked on route changes
3) Lead form submit → POST apps/api /leads with `x_consent` + `x_attribution`
4) API layer stores/forwards to CRM or email (stubbed now)
