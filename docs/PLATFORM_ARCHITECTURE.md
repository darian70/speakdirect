# SpeakDirect Platform Architecture & Roadmap

This document outlines the target architecture for a multi‑tenant SaaS with a marketing site, customer console, public API, admin backoffice, and shared packages. It also contains execution phases and operator checklists.

## High‑Level Architecture

- Website (Next.js App Router, static export)
  - Path: `website/`
  - Host: Vercel (recommended) or Netlify
  - Purpose: Marketing, SEO, lead capture, public docs, resources
  - Edge redirects and security headers via `vercel.json`/`netlify.toml`

- Customer Console (Next.js App Router, SSR/ISR)
  - Path: `apps/web/`
  - Host: Vercel (SSR)
  - Purpose: Tenant dashboards, agents UI, analytics, settings, billing
  - Feature gating via `packages/shared/src/plans.ts`

- Public API (Express)
  - Path: `apps/api/`
  - Host: Render.com or Fly.io (always‑on, TLS, zero cold start for webhooks)
  - Purpose: Telephony (Twilio) callbacks, lead API, future tenant/user APIs
  - Env: `API_PUBLIC_URL` must be publicly reachable by Twilio

- Admin Backoffice (Next.js App Router, SSR)
  - Path: `apps/admin/` (to be scaffolded)
  - Host: Vercel (protected by SSO)
  - Purpose: Internal ops for leads, tenants, usage, flags, support tooling

- Database & Auth
  - DB: Neon Postgres (serverless), ORM: Prisma, Migrations: Prisma migrate
  - Auth: Clerk (recommended) for email/password + SSO + orgs; alternative: Auth0
  - Billing: Stripe Billing (products, prices, customer portal, usage metering)

- Packages (Monorepo)
  - `packages/shared`: schemas, plan defs, constants, shared types
  - `packages/ui`: shared UI components
  - `packages/agents-sdk`: stubs for agent templates & integrations

## Multi‑Tenant Model

- Core tables (Prisma): `Tenant`, `User`, `Membership`, `Agent`, `Entitlement`, `UsageEvent`, `Subscription` (Stripe)
- Tenant isolation: `tenant_id` on all per‑tenant records; row‑level checks in API
- AuthZ: Clerk Organizations map to `Tenant`; RBAC: `owner`, `admin`, `agent_operator`, `viewer`
- Plans & Entitlements: derive access using `packages/shared/plans` + Stripe product metadata

## Networking & Security

- Domains
  - `www.speakdirect.ai` — website
  - `app.speakdirect.ai` — console (Vercel)
  - `api.speakdirect.ai` — API (Render/Fly)
  - `status.speakdirect.ai` — (optional) status page

- Security hardening
  - Strict CSP in both website and console
  - HSTS, X‑Frame‑Options, Referrer‑Policy, Permissions‑Policy headers
  - SSO for admin and enterprise tenants; audit logs (Pro+)

## Observability

- Sentry for frontends (JS) and API (Node)
- (Optional) PostHog for product analytics in console
- Uptime monitoring (Healthchecks or Better Uptime) for API

## CI/CD

- Turborepo cache for builds
- GitHub Actions: lint, typecheck, unit tests, Playwright smoke tests for website + console
- Deploy hooks
  - Vercel: preview per PR, production on main
  - API: Render auto‑deploy on main

## Phased Execution

- Phase A — Console foundation (DONE in code scaffolding)
  - Console shell, navigation, plan gating, initial pages: Agents, Technicians, Analytics, Settings, Billing
  - Website integrates Console link and `/app` redirect

- Phase B — Auth + Tenancy (NEXT)
  - Add Clerk to `apps/web` and `apps/admin`, protect routes
  - Add Prisma + Neon, initial schema (tenants, users, memberships)
  - Seed script and migration workflow

- Phase C — Billing + Entitlements
  - Add Stripe products/prices, customer portal
  - Stripe webhooks in `apps/api` to sync subscriptions -> entitlements
  - Gate features via `plans` + entitlements table

- Phase D — Admin Backoffice
  - Scaffold `apps/admin/`: Leads, Tenants, Users, Usage, Feature flags
  - SSO enforced (Clerk/IdP)

- Phase E — Analytics & Ops
  - Product analytics events (PostHog), funnels (Pro+)
  - Usage collection into `UsageEvent` and hourly aggregation for billing

## Operator Checklist

- Provision
  - Create Vercel projects for `website/` and `apps/web/`
  - Create Render/Fly app for `apps/api/`
  - Create Neon project; set DATABASE_URL in API and console
  - Create Stripe products; set keys in API and console
  - Create Clerk app; configure organizations and SSO

- Configure
  - Env variables across all services (see `website/.env.example`, `apps/web/.env.example`, `apps/api/.env.example`)
  - Domains and DNS per host

- Validate
  - Twilio call flow via `/technicians`
  - Auth login/signup, org switch, role permissions
  - Billing: subscribe, upgrade/downgrade, portal access

## Next Work Items

1. Add Clerk to `apps/web` and protect `(console)` routes
2. Add Prisma + Neon; define Tenants/Users/Memberships schema
3. Stripe integration: billing portal + webhooks in API
4. Scaffold `apps/admin` with Clerk SSO
5. Playwright smoke tests for critical flows
