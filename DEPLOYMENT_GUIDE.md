# SpeakDirect - Production Deployment Guide

This guide will walk you through deploying the SpeakDirect AI phone agency platform to production.

## Architecture Overview

- **Frontend**: Next.js 14 app (`apps/web`) - Deploy to Vercel or Netlify
- **API**: Node/Express (`apps/api`) - Deploy to Render
- **Database**: PostgreSQL - Use Neon, Supabase, or Render Postgres
- **Admin Panel**: Next.js app (`apps/admin`) - Deploy to Vercel
- **Marketing Site**: Next.js app (`website`) - Deploy to Vercel/Netlify

## Prerequisites

1. **Accounts Needed**:
   - GitHub account (for code repository)
   - Vercel account (for frontend deployment)
   - Render account (for API deployment)
   - Neon/Supabase account (for PostgreSQL database)
   - Clerk account (for authentication)
   - Stripe account (for billing)
   - Twilio account (for voice calls)
   - ElevenLabs account (for AI voice, optional)

2. **Local Tools**:
   - Node.js 20+
   - pnpm 9+
   - Git

## Step 1: Database Setup (Neon PostgreSQL)

1. Create account at https://neon.tech
2. Create a new project called "speakdirect-prod"
3. Copy the connection string (starts with `postgresql://`)
4. Save it as `DATABASE_URL` for later

### Run Database Migrations

```bash
cd packages/db
pnpm install
DATABASE_URL="your_neon_connection_string" pnpm prisma:migrate:dev
```

## Step 2: Environment Variables

### API (apps/api/.env)

```env
# Server
PORT=8081
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host/db

# Security
ADMIN_TOKEN=your_secure_random_token_here
HMAC_SECRET=your_secure_random_secret_here

# Frontend URLs
FRONTEND_PUBLIC_URL=https://app.speakdirect.xyz
API_PUBLIC_URL=https://api.speakdirect.xyz
ALLOWED_ORIGINS=https://app.speakdirect.xyz,https://admin.speakdirect.xyz,https://speakdirect.xyz

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_TEST_CUSTOMER_ID=cus_...

# Twilio (Voice)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_CALLER_ID=+15551234567
DEFAULT_TECH_NUMBER=+15559876543

# Voice Bridge (optional)
VOICE_BRIDGE_WSS_URL=wss://voice-bridge.speakdirect.xyz/stream

# SMTP (for emails - optional)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG....
SMTP_FROM=noreply@speakdirect.xyz
```

### Web App (apps/web/.env.local)

```env
# API Backend
API_BASE_URL=https://api.speakdirect.xyz
API_ADMIN_TOKEN=same_token_as_api

# Public Settings
NEXT_PUBLIC_SITE_URL=https://app.speakdirect.xyz
NEXT_PUBLIC_DEFAULT_PLAN_ID=starter

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_DSN=https://...
```

## Step 3: Deploy API to Render

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `speakdirect-api`
   - **Root Directory**: `apps/api`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install --frozen-lockfile=false && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: Starter ($7/mo minimum)

5. Add Environment Variables (from Step 2)
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy the service URL (e.g., `https://speakdirect-api.onrender.com`)

### Custom Domain (Optional)

1. Go to Settings → Custom Domain
2. Add `api.speakdirect.xyz`
3. Update DNS records as instructed
4. Update `API_PUBLIC_URL` and `ALLOWED_ORIGINS` env vars

## Step 4: Deploy Web App to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install && pnpm --filter @omniagents/web build`
   - **Output Directory**: `apps/web/.next`

5. Add Environment Variables (from Step 2)
6. Click "Deploy"
7. Wait for deployment (2-5 minutes)

### Custom Domain

1. Go to Settings → Domains
2. Add `app.speakdirect.xyz`
3. Update DNS records
4. Update `NEXT_PUBLIC_SITE_URL` and API's `FRONTEND_PUBLIC_URL`

## Step 5: Deploy Admin Panel

Repeat Step 4 for the admin panel:
- **Root Directory**: `apps/admin`
- **Domain**: `admin.speakdirect.xyz`

## Step 6: Deploy Marketing Website

Repeat Step 4 for the website:
- **Root Directory**: `website`
- **Domain**: `speakdirect.xyz` and `www.speakdirect.xyz`

## Step 7: Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://api.speakdirect.xyz/webhooks/stripe`
4. **Events to send**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

5. Copy the signing secret (starts with `whsec_`)
6. Add to Render as `STRIPE_WEBHOOK_SECRET`

## Step 8: Twilio Setup

### Purchase Phone Number

1. Go to Twilio Console → Phone Numbers → Buy a number
2. Choose a number with Voice capabilities
3. Copy the phone number (E.164 format: +15551234567)

### Configure Voice Webhook

1. Go to Phone Numbers → Manage → Active Numbers
2. Click your number
3. Under "Voice & Fax":
   - **A CALL COMES IN**: Webhook
   - **URL**: `https://api.speakdirect.xyz/twilio/voice/inbound`
   - **HTTP**: POST

4. Under "Status Callback URL" (optional):
   - **URL**: `https://api.speakdirect.xyz/twilio/voice/status`
   - **HTTP**: POST

## Step 9: Provision Phone Numbers in Database

Use the admin API to provision phone numbers for tenants:

```bash
curl -X POST https://api.speakdirect.xyz/admin/phone-numbers \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: tenant_id_here" \
  -d '{
    "e164": "+15551234567",
    "label": "Main Support Line",
    "tenantId": "tenant_id_here"
  }'
```

## Step 10: Test End-to-End

### Test Outbound Call (Technician Flow)

1. Log into `https://app.speakdirect.xyz`
2. Go to Technicians page
3. Fill out a work order:
   - Customer Name: Test Customer
   - Customer Phone: YOUR_PHONE_NUMBER
   - Vehicle: 2020 Honda Accord
   - Service: Oil change
   - Cost: $45.00

4. Click "Call Customer Now"
5. You should receive a call from your Twilio number

### Test Inbound Call

1. Call your Twilio number from any phone
2. The call should be handled by the AI agent
3. Check the dashboard for call logs and transcripts

## Step 11: Monitor and Scale

### Monitoring

- **Render**: Check logs and metrics in dashboard
- **Vercel**: Check deployment logs and analytics
- **Sentry** (if configured): Monitor errors in real-time
- **PostHog** (if configured): Track user analytics

### Scaling

- **Render**: Upgrade to Standard or Pro plans for better performance
- **Database**: Scale Neon compute units as needed
- **Vercel**: Pro plan includes better performance and analytics

## Troubleshooting

### API Returns 503 "db_not_configured"

- Check that `DATABASE_URL` is set in Render environment variables
- Verify database connection string is correct
- Ensure database migrations have been run

### Calls Not Initiating

- Verify Twilio credentials are correct
- Check that `API_PUBLIC_URL` is set and publicly accessible
- Ensure `TWILIO_CALLER_ID` is a verified Twilio number
- Check Render logs for error messages

### Authentication Issues

- Verify Clerk keys are correct (live keys, not test keys)
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_live_`
- Check that allowed URLs are configured in Clerk dashboard

### CORS Errors

- Verify `ALLOWED_ORIGINS` in API includes your frontend URLs
- Check that URLs don't have trailing slashes
- Ensure protocol matches (https vs http)

## Cost Estimates

### Minimum Production Setup (~$50-100/month)

- Render API (Starter): $7/mo
- Neon Postgres (Launch): $19/mo
- Vercel (Hobby): Free (or Pro $20/mo for team features)
- Twilio: ~$1/number + $0.0085/min + $0.0075/sms
- Stripe: 2.9% + $0.30 per transaction
- ElevenLabs (optional): $5-$99/mo depending on usage
- Domain: ~$12/year

### Growth Setup (~$200-500/month)

- Render API (Standard): $25/mo
- Neon Postgres (Scale): $69/mo
- Vercel Pro: $20/mo per seat
- Higher Twilio usage
- ElevenLabs Professional: $99/mo

## Security Checklist

- [ ] All API keys are set as environment variables (not hardcoded)
- [ ] `ADMIN_TOKEN` is a strong random string (32+ characters)
- [ ] Database uses SSL connection
- [ ] CORS is configured with specific origins (not `*`)
- [ ] Stripe webhook signature verification is enabled
- [ ] Twilio webhook signature verification is enabled
- [ ] Rate limiting is configured on sensitive endpoints
- [ ] HTTPS is enforced on all domains
- [ ] Clerk is configured with production keys
- [ ] Error messages don't leak sensitive information

## Post-Deployment

1. **Test all critical paths**: Sign up, create agent, make calls, billing
2. **Set up monitoring alerts**: Sentry for errors, uptime monitoring
3. **Configure backup schedule**: Database backups (Neon auto-backups daily)
4. **Document runbooks**: Incident response procedures
5. **Train support team**: On how to use admin panel and troubleshoot

## Support

For deployment issues, check:
- Render logs: https://dashboard.render.com
- Vercel logs: https://vercel.com/dashboard
- GitHub discussions: (your repo)/discussions

---

**Last Updated**: 2025-09-30
**Platform Version**: 1.0.0
