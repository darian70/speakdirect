# Production Launch Checklist

Complete this checklist before launching SpeakDirect to production.

## ✅ Pre-Launch Tasks

### Infrastructure & Hosting

- [ ] Database provisioned (Neon/Supabase/Render Postgres)
- [ ] Database migrations run successfully
- [ ] API deployed to Render with auto-deploy enabled
- [ ] Web app deployed to Vercel
- [ ] Admin panel deployed to Vercel
- [ ] Marketing website deployed
- [ ] Custom domains configured and SSL active
- [ ] DNS records propagated (use https://dnschecker.org)

### API Configuration

- [ ] `DATABASE_URL` set and tested
- [ ] `ADMIN_TOKEN` is strong random string (32+ chars)
- [ ] `HMAC_SECRET` is strong random string
- [ ] `API_PUBLIC_URL` points to production domain
- [ ] `ALLOWED_ORIGINS` includes all frontend domains
- [ ] `NODE_ENV=production` set
- [ ] Health endpoint working: `curl https://api.speakdirect.xyz/health`

### Authentication (Clerk)

- [ ] Clerk production application created
- [ ] Live API keys copied to environment variables
- [ ] Authorized redirect URLs configured in Clerk dashboard
- [ ] Email/password authentication enabled
- [ ] OAuth providers configured (Google, GitHub)
- [ ] User profile fields configured
- [ ] Sign-up/sign-in flows tested
- [ ] Password reset flow tested

### Billing (Stripe)

- [ ] Stripe live mode enabled
- [ ] Products created for each tier (Starter, Growth, Pro)
- [ ] Prices configured with correct amounts
- [ ] Subscription settings configured
- [ ] `STRIPE_SECRET_KEY` (live) added to API env vars
- [ ] Webhook endpoint created and verified
- [ ] Webhook signing secret added to API
- [ ] Test subscription flow end-to-end
- [ ] Billing portal accessible from dashboard

### Voice Services (Twilio)

- [ ] Twilio account verified and funded
- [ ] Phone number purchased with Voice capabilities
- [ ] `TWILIO_ACCOUNT_SID` added to API env vars
- [ ] `TWILIO_AUTH_TOKEN` added to API env vars
- [ ] `TWILIO_CALLER_ID` set to purchased number
- [ ] Voice webhook URL configured: `https://api.speakdirect.xyz/twilio/voice/inbound`
- [ ] Status callback URL configured: `https://api.speakdirect.xyz/twilio/voice/status`
- [ ] Test inbound call successfully handled
- [ ] Test outbound call successfully initiated
- [ ] Call recordings enabled (if required)
- [ ] Call logs visible in dashboard

### AI Voice (ElevenLabs - Optional)

- [ ] ElevenLabs account created and funded
- [ ] API key added to environment variables
- [ ] Voice IDs configured for agents
- [ ] Test voice synthesis working
- [ ] Latency acceptable for real-time calls

### Email (SMTP)

- [ ] SMTP provider configured (SendGrid/AWS SES/Mailgun)
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` set
- [ ] `SMTP_FROM` email address verified
- [ ] Test email sends successfully
- [ ] Email templates created (welcome, confirmation, notifications)
- [ ] SPF and DKIM records configured
- [ ] DMARC policy configured

## 🔐 Security Checklist

### API Security

- [ ] All sensitive data in environment variables (not code)
- [ ] API rate limiting configured on critical endpoints
- [ ] CORS configured with specific origins (not `*`)
- [ ] Twilio webhook signature verification enabled
- [ ] Stripe webhook signature verification enabled
- [ ] SQL injection prevention (using Prisma)
- [ ] XSS prevention (React escapes by default)
- [ ] CSRF protection for state-changing operations
- [ ] Input validation on all endpoints (using Zod)
- [ ] Error messages don't leak sensitive info

### Database Security

- [ ] Database connection uses SSL
- [ ] Database password is strong (20+ chars)
- [ ] Database backups enabled (Neon auto-backups)
- [ ] Database access restricted by IP if possible
- [ ] Prisma queries use parameterized statements
- [ ] No raw SQL with user input

### Frontend Security

- [ ] All API keys prefixed with `NEXT_PUBLIC_` are truly public
- [ ] No sensitive keys in frontend code
- [ ] Content Security Policy headers configured
- [ ] XSS protection enabled
- [ ] HTTPS enforced on all pages
- [ ] Secure cookies for authentication
- [ ] Logout clears all session data

### Access Control

- [ ] Multi-tenant isolation working (users can't see other orgs' data)
- [ ] Role-based access control (RBAC) implemented
- [ ] Admin panel requires admin privileges
- [ ] API endpoints check tenant ownership
- [ ] Phone numbers scoped to tenants
- [ ] Calls scoped to tenants

## 📊 Monitoring & Observability

### Error Tracking

- [ ] Sentry configured for API
- [ ] Sentry configured for web app
- [ ] Error alerts configured
- [ ] Source maps uploaded for better stack traces
- [ ] Test error reporting working

### Analytics

- [ ] PostHog configured (if using)
- [ ] Key events tracked (sign up, create agent, make call)
- [ ] Funnels configured for critical flows
- [ ] Dashboard created for monitoring

### Logging

- [ ] API logs viewable in Render dashboard
- [ ] Frontend logs viewable in Vercel dashboard
- [ ] Database slow query logs enabled
- [ ] Log retention policy configured
- [ ] Log levels appropriate for production (no DEBUG)

### Uptime Monitoring

- [ ] Uptime monitor configured (UptimeRobot/Better Uptime)
- [ ] Health check endpoint monitored: `/health`
- [ ] Alert recipients configured
- [ ] Status page created (optional)

### Performance

- [ ] API response times < 200ms for most endpoints
- [ ] Frontend page load < 2 seconds
- [ ] Database query performance optimized
- [ ] N+1 queries eliminated
- [ ] API endpoints have appropriate indexes
- [ ] Static assets cached and compressed
- [ ] Images optimized (Next.js Image component)

## 🧪 Testing

### Functionality Testing

- [ ] User sign up flow works
- [ ] User login flow works
- [ ] Password reset flow works
- [ ] Create agent works
- [ ] Configure agent works
- [ ] Delete agent works
- [ ] Create outbound call works (technician flow)
- [ ] Inbound call handling works
- [ ] Call logs appear in dashboard
- [ ] Call details page shows transcripts
- [ ] Phone number provisioning works
- [ ] Billing portal accessible
- [ ] Subscription upgrade/downgrade works
- [ ] Analytics dashboard loads

### Integration Testing

- [ ] Clerk authentication integrates with API
- [ ] API correctly identifies tenant from Clerk org
- [ ] Twilio webhooks reach API
- [ ] Stripe webhooks reach API
- [ ] Database operations succeed
- [ ] Email sending works

### Load Testing

- [ ] API can handle 100+ requests/minute
- [ ] Database can handle concurrent connections
- [ ] No memory leaks in API
- [ ] No memory leaks in frontend

### Browser Testing

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile responsive design works
- [ ] Tablet responsive design works

## 📱 Mobile & Accessibility

- [ ] Mobile layout tested on iOS
- [ ] Mobile layout tested on Android
- [ ] Touch targets are appropriately sized (44x44px minimum)
- [ ] Forms are mobile-friendly
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (ARIA labels)
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible

## 📄 Documentation

- [ ] README.md up to date
- [ ] DEPLOYMENT_GUIDE.md complete
- [ ] API documentation created
- [ ] Environment variables documented
- [ ] Architecture diagrams created
- [ ] Runbook for common issues
- [ ] Customer support documentation
- [ ] Internal admin documentation

## 🎯 Business Readiness

### Legal & Compliance

- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie policy published (if using cookies)
- [ ] GDPR compliance reviewed (if serving EU)
- [ ] CCPA compliance reviewed (if serving California)
- [ ] Call recording consent disclaimer added
- [ ] Data retention policy defined
- [ ] Data deletion process documented

### Support

- [ ] Support email configured (support@speakdirect.xyz)
- [ ] Support team trained on platform
- [ ] Common issues documented
- [ ] Escalation process defined
- [ ] SLA commitments defined per tier

### Marketing

- [ ] Landing page live and optimized
- [ ] Pricing page accurate
- [ ] Features page complete
- [ ] Contact/demo request form working
- [ ] SEO meta tags configured
- [ ] Social media accounts created
- [ ] Logo and branding finalized
- [ ] Analytics tracking configured

## 🚨 Incident Response

- [ ] Incident response plan documented
- [ ] On-call rotation defined
- [ ] Escalation contacts listed
- [ ] Rollback procedure documented
- [ ] Database backup restoration tested
- [ ] Emergency contacts available 24/7

## 💰 Financial

- [ ] Stripe account verified
- [ ] Bank account linked for payouts
- [ ] Tax information submitted
- [ ] Pricing calculations verified
- [ ] Cost projections reviewed
- [ ] Revenue tracking configured

## 📅 Launch Day

### Pre-Launch (T-24 hours)

- [ ] All checklist items above complete
- [ ] Team briefed on launch plan
- [ ] Support team on standby
- [ ] Monitoring dashboards open
- [ ] Backup plan ready if critical issues arise

### Launch (T-0)

- [ ] Announce launch
- [ ] Monitor error rates
- [ ] Monitor sign-up flow
- [ ] Monitor call success rates
- [ ] Watch for spike in support requests
- [ ] Check all integrations working

### Post-Launch (T+24 hours)

- [ ] Review error logs
- [ ] Review performance metrics
- [ ] Analyze user feedback
- [ ] Document any issues encountered
- [ ] Plan fixes for any critical bugs
- [ ] Send thank you to team

## 🎉 Success Metrics

Define what success looks like:

- [ ] Target: X sign-ups in first week
- [ ] Target: Y successful calls in first week
- [ ] Target: <0.1% error rate
- [ ] Target: >95% uptime
- [ ] Target: <2s average page load time
- [ ] Target: >80% user satisfaction score

---

## Sign-Off

By checking all items above, I confirm the platform is ready for production launch.

**Name**: ___________________________  
**Role**: ___________________________  
**Date**: ___________________________  
**Signature**: ___________________________  

---

**Last Updated**: 2025-09-30  
**Version**: 1.0.0
