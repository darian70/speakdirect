# Telephony (Inbound-Only MVP)

This document describes how to configure inbound calls using Twilio and how multi-tenant routing works.

## Overview

- Inbound calls hit the API at `/twilio/voice/inbound` (TwiML webhook).
- If `VOICE_BRIDGE_WSS_URL` is configured, the API responds with `<Start><Stream>` to stream audio to your voice-bridge over WebSocket. Otherwise, a short IVR plays and the call hangs up.
- Twilio Status Callbacks post to `/twilio/voice/status` to finalize call records (status, recording URL, duration).
- Calls are stored in the `Call` table and can be viewed from the Console at `Calls`.
- Tenants are resolved by matching the `To` phone number with `PhoneNumber.e164`.

## Required Environment
Configure `apps/api/.env` (or `.env.local`) with:

```env
PORT=8081
ADMIN_TOKEN=change_me
HMAC_SECRET=change_me
FRONTEND_PUBLIC_URL=http://localhost:2001

# Public base URL of the API (Twilio must reach this)
API_PUBLIC_URL=https://<your-api>.example.com

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_CALLER_ID=+15551234567
DEFAULT_TECH_NUMBER=+15557654321

# Optional: voice bridge WebSocket endpoint
VOICE_BRIDGE_WSS_URL=wss://voice-bridge.example.com/stream
```

Notes:
- `API_PUBLIC_URL` must be publicly reachable over HTTPS. Use a tunnel such as ngrok/Cloudflare Tunnel for local development.
- If `VOICE_BRIDGE_WSS_URL` is not set, callers will hear a polite message and the call will end.

## Twilio Console Configuration
For your Twilio phone number:

- Voice & Fax → A CALL COMES IN:
  - Webhook: `POST` to `https://<API_PUBLIC_URL>/twilio/voice/inbound`
- Voice & Fax → STATUS CALLBACK URL:
  - Webhook: `POST` to `https://<API_PUBLIC_URL>/twilio/voice/status`

Optional: Recording settings as desired (the API will store `RecordingUrl` and `CallDuration` when provided).

## Multi-tenant Routing
Provision phone numbers per tenant:

- Admin API (requires `Authorization: Bearer ADMIN_TOKEN`):
  - `POST /admin/phone-numbers` body: `{ e164: "+15551234567", tenantId?: "<id>", label?: "Sales" }`
    - If `tenantId` is omitted, the backend will infer it from `X-Tenant-Id` header.
  - `GET /admin/phone-numbers`
  - `DELETE /admin/phone-numbers/:id`
- Tenant-scoped list: `GET /phone-numbers` (uses `X-Tenant-Id` header)

When a call arrives to Twilio with `To=+15551234567`, the API looks up `PhoneNumber.e164` to resolve `tenantId`. Calls are stored with that tenant.

## Console (Next.js) UI

- Calls list: `/calls`
- Call details: `/calls/[id]`
- Settings → Phone Numbers panel to add/delete numbers (uses admin proxy routes under `/api/admin/phone-numbers`).

## Voice Bridge Notes

- Provide a secure `wss://` endpoint in `VOICE_BRIDGE_WSS_URL`.
- The API appends `tenant_id=<TENANT>` as a query parameter; your bridge can read it for observability.
- The included sample bridge at `Auto service phone caller/apps/voice-bridge/server.js` runs a WS server on `/stream`. For production, deploy behind TLS and update `VOICE_BRIDGE_WSS_URL` accordingly.

## Local Testing (no Twilio)
You can simulate Twilio by posting urlencoded data:

```bash
curl -X POST "http://localhost:8081/twilio/voice/inbound" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "From=+15550001111" \
  --data-urlencode "To=+15551234567" \
  --data-urlencode "CallSid=CA_test123"
```

Signature validation is only enforced in production mode.

## Data Model

- `PhoneNumber(id, tenantId, e164 UNIQUE, label, provider, createdAt)`
- `Call(id, tenantId, provider, providerCallId, direction, from, to, status, startedAt, endedAt, durationSec, recordingUrl, phoneNumberId?, meta)`
- `CallEvent(id, callId, type, ts, payload)`
- `Transcript(id, callId, channel, text, ts)`

Indexes:
- `Call`: `(tenantId, startedAt)`, `(provider, providerCallId)`
- `CallEvent`: `(callId, ts)`
- `Transcript`: `(callId, ts)`
