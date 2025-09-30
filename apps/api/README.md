# @omniagents/api

Node/Express API for leads, webhooks, telephony, and multi-tenant management.

## Dev

```bash
pnpm --filter @omniagents/api dev
```

## Endpoints

- GET `/health` → { ok: true }
- POST `/leads` → create lead (pending) and return confirm link
- GET `/confirm?token=...` → confirm a pending lead
- GET `/admin/leads?status=pending|confirmed` → list leads (Bearer ADMIN_TOKEN)

### Tenancy

- POST `/tenants/sync` → upsert tenant by `X-Tenant-Id` header
- GET `/admin/tenants` (admin) → list tenants

### Agents (basic CRUD)

- GET `/agents` (tenant-scoped via `X-Tenant-Id`)
- POST `/agents` (admin)
- GET `/agents/:id`
- PATCH `/agents/:id` (admin)
- DELETE `/agents/:id` (admin)

### Telephony (Inbound MVP)

- POST `/twilio/voice/inbound` (TwiML webhook) → responds with `<Start><Stream>` to `VOICE_BRIDGE_WSS_URL` if configured, else polite IVR.
- POST `/twilio/voice/status` (Status Callback) → updates call status, recording URL, and duration.
- GET `/calls` → list tenant calls (requires `X-Tenant-Id`)
- GET `/calls/:id` → call details + events + transcript (tenant-scoped)

### Phone Numbers

- GET `/phone-numbers` (tenant-scoped) → list numbers for current tenant
- GET `/admin/phone-numbers` (admin) → list all numbers
- POST `/admin/phone-numbers` (admin) → `{ e164, tenantId?, label? }` (infers tenant from `X-Tenant-Id` if not provided)
- DELETE `/admin/phone-numbers/:id` (admin)

## Quickstart (Dev)

1. Install deps at repo root: `pnpm install`
2. Generate Prisma client: `pnpm --filter @omniagents/db prisma:generate`
3. Apply migrations: `pnpm --filter @omniagents/db prisma:migrate:dev`
4. Start API: `pnpm --filter @omniagents/api dev`
5. Start web console: `pnpm --filter @omniagents/web dev`

Configure Twilio number webhooks to:

- Voice webhook: `POST https://<API_PUBLIC_URL>/twilio/voice/inbound`
- Status callback: `POST https://<API_PUBLIC_URL>/twilio/voice/status`

See `TELEPHONY.md` for details.

## Notes

- TypeScript with @types/node, @types/express
- Prisma Postgres persistence (monorepo package `@omniagents/db`)
