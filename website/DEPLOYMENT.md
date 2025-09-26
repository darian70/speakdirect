# OmniAgents Website Deployment Guide

## Production Deployment Checklist

### Pre-Deployment Requirements

1. **Environment Configuration**
   - Copy `.env.example` to `.env.local`
   - Fill in all required environment variables
   - Verify API endpoints and keys

2. **Dependencies**
   - Run `npm install` to ensure all dependencies are installed
   - Verify Node.js version compatibility (18.x or higher)

3. **Build Verification**
   - Run `npm run build` to test production build
   - Check for any build errors or warnings
   - Verify static export generation

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Configure environment variables in Vercel dashboard
# - NEXT_PUBLIC_SITE_URL
# - NEXT_PUBLIC_GA_MEASUREMENT_ID
# - SMTP_HOST, SMTP_USER, SMTP_PASS
# - Contact form API keys
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=out
```

#### AWS S3 + CloudFront
```bash
# Build static files
npm run build

# Upload to S3 bucket
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Post-Deployment Verification

1. **Functionality Tests**
   - [ ] Homepage loads correctly
   - [ ] All navigation links work
   - [ ] Contact forms submit successfully
   - [ ] AI chat widget functions
   - [ ] ROI calculator operates
   - [ ] Mobile responsiveness

2. **Performance Tests**
   - [ ] Page load speeds < 3 seconds
   - [ ] Core Web Vitals pass
   - [ ] Images load with lazy loading
   - [ ] Service worker registers

3. **SEO Verification**
   - [ ] Meta tags present on all pages
   - [ ] Sitemap accessible at /sitemap.xml
   - [ ] Robots.txt accessible
   - [ ] Structured data validates
   - [ ] Open Graph images display

4. **Security Checks**
   - [ ] HTTPS enabled
   - [ ] Security headers present
   - [ ] No sensitive data exposed
   - [ ] CSP policies active

### Monitoring Setup

1. **Analytics**
   - Google Analytics 4 configured
   - Conversion tracking enabled
   - Custom events for lead capture

2. **Error Tracking**
   - Sentry integration (optional)
   - Console error monitoring
   - Performance monitoring

3. **Uptime Monitoring**
   - Set up monitoring service
   - Configure alerts for downtime
   - Monitor key user journeys

### Maintenance

1. **Regular Updates**
   - Update dependencies monthly
   - Security patches as needed
   - Content updates via CMS

2. **Performance Monitoring**
   - Weekly Core Web Vitals checks
   - Monthly performance audits
   - Quarterly security reviews

3. **Backup Strategy**
   - Code repository backups
   - Environment variable backups
   - Database backups (if applicable)

### Troubleshooting

#### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Review TypeScript errors

2. **Runtime Errors**
   - Check environment variables
   - Verify API endpoints
   - Review browser console logs

3. **Performance Issues**
   - Optimize images
   - Enable compression
   - Review bundle size

#### Support Contacts

- **Email**: SpeakDirectSales@gmail.com
- **Emergency**: +1-800-666-4241

### Domain Configuration

1. **DNS Settings**
   ```
   Type: A
   Name: @
   Value: [Your hosting provider IP]
   
   Type: CNAME
   Name: www
   Value: omniagents.ai
   ```

2. **SSL Certificate**
   - Enable automatic SSL renewal
   - Verify HTTPS redirect
   - Check certificate validity

### CDN Configuration

1. **Static Assets**
   - Configure CDN for images, CSS, JS
   - Set appropriate cache headers
   - Enable compression

2. **Geographic Distribution**
   - Configure edge locations
   - Optimize for target markets
   - Monitor global performance

### Observability (Sentry + OpenTelemetry)

The platform supports optional observability via Sentry (website errors and performance) and OpenTelemetry (tracing for Python starters). Configuration is entirely environment-driven.

#### Sentry for Website (Client)

- Component: `website/src/components/ObservabilityInit.tsx` (rendered in `website/src/app/layout.tsx`)
- Enable by setting the following environment variables (see `/.env.example` or `website/.env.example`):

```bash
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ENV=production
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE=0
NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE=1
```

- CSP: `website/next.config.js` dynamically allowlists the Sentry DSN origin in `connect-src` if `NEXT_PUBLIC_SENTRY_DSN` is set. After changing `next.config.js`, restart the dev server.
- Verification: Open DevTools Network tab and confirm Sentry requests are not blocked by CSP. Trigger a test exception to verify Sentry ingestion.

#### OpenTelemetry for Python Starters

- Starters instrumented: `starters/langgraph-agent/`, `starters/rag-bot-llamaindex/`, `starters/voice-agent-livekit/`, `starters/temporal-workflows/`.
- Each starter initializes tracing automatically if these variables are present:

```bash
# OpenTelemetry (optional)
OTEL_EXPORTER_OTLP_ENDPOINT=https://otel-collector:4318
# Comma-separated headers, e.g. Authorization=Bearer <token>,Another=val
OTEL_EXPORTER_OTLP_HEADERS=
# Defaults per starter if not provided
OTEL_SERVICE_NAME=
  
# Sentry (optional, for Python)
SENTRY_DSN=
SENTRY_ENV=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

- FastAPI apps (LangGraph + LlamaIndex) use `opentelemetry-instrumentation-fastapi` for auto-instrumentation.
- Verification: Start a local OTLP collector or point to your vendor, make a request to the starter, and confirm spans appear. For Sentry, trigger an exception and verify it arrives.

This deployment guide ensures enterprise-grade reliability and performance for the OmniAgents website.

## Click-to-Call (Twilio) Setup

This platform includes a one-click call service that bridges a technician and a client via your Twilio number.

### Components

- API: `apps/api` exposes `POST /calls/initiate` and `GET /twiml/bridge`.
- Web: `apps/web` exposes `POST /api/calls/initiate` (server route) and a simple UI at `/technicians`.

### Configure Environment

1. `apps/api/.env` (or `.env.example`):
   - `API_PUBLIC_URL=https://<public-api-host>` (Twilio must reach this URL)
   - `TWILIO_ACCOUNT_SID=AC...`
   - `TWILIO_AUTH_TOKEN=...`
   - `TWILIO_CALLER_ID=+15551234567` (Your Twilio number, E.164)
   - `DEFAULT_TECH_NUMBER=+15557654321` (Optional default tech line)
   - `ADMIN_TOKEN=change_me` (Shared secret for admin-protected routes)

2. `apps/web/.env.local`:
   - `API_BASE_URL=http://localhost:8080` (or your API URL)
   - `API_ADMIN_TOKEN=change_me` (Must match `ADMIN_TOKEN` in API)

### Local Development (with tunneling)

Twilio requires a public HTTPS URL to fetch TwiML and callbacks.

1. Start API locally (port 8080):

   ```bash
   pnpm install
   pnpm --filter @omniagents/api dev
   ```

2. Expose the API using a tunnel (example with ngrok):

   ```bash
   ngrok http 8080
   ```

   Set `API_PUBLIC_URL` to the HTTPS URL printed by ngrok (e.g., `https://<subdomain>.ngrok.io`).
3. Start the web app (port 2000):

   ```bash
   pnpm --filter @omniagents/web dev
   ```

### How It Works

1. Technician triggers `POST /api/calls/initiate` from the web app.
2. The web server route forwards the request to API `POST /calls/initiate` with a bearer `ADMIN_TOKEN`.
3. The API uses Twilio to call the technician first; when answered, Twilio requests `GET {API_PUBLIC_URL}/twiml/bridge?client=+1...`.
4. The TwiML bridges the call to the client; optional recording/status callbacks supported.

### Notes

- All phone numbers must be in E.164 format, e.g. `+15551234567`.
- For multi-tenant setups, use Twilio Subaccounts or per-tenant caller IDs and scope `ADMIN_TOKEN`/routing by tenant.
- Production: host `apps/api` on a public domain with TLS; set `API_PUBLIC_URL` accordingly.
