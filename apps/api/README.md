# @omniagents/api

Node/Express API for leads, webhooks, and integrations.

## Dev
```bash
pnpm --filter @omniagents/api dev
```

## Endpoints
- GET /health → { ok: true }
- POST /leads → create lead (pending) and return confirm link
- GET /confirm?token=... → confirm a pending lead
- GET /admin/leads?status=pending|confirmed → list leads (Bearer ADMIN_TOKEN)

## Notes
- TypeScript with @types/node, @types/express
- Add persistence (Postgres) and CRM/Email integrations later
