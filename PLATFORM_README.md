# SpeakDirect - AI Phone Agency Platform

> Production-ready AI phone system for businesses. Enable AI-powered voice agents to handle customer calls, book appointments, and manage service workflows.

## 🎯 Overview

SpeakDirect is an enterprise-grade platform that allows businesses (mechanics, offices, service centers) to deploy AI phone agents that:

- **Answer inbound calls** 24/7 with natural conversation
- **Make outbound calls** triggered by technicians (e.g., "car is ready for pickup")
- **Book appointments** and handle scheduling
- **Provide service updates** with work order details
- **Request approvals** for repairs and charges
- **Log conversations** with full transcripts

## 🏗️ Architecture

### Monorepo Structure

```
├── apps/
│   ├── web/                 # Main dashboard (Next.js 14)
│   ├── admin/              # Admin panel (Next.js 14)
│   ├── api/                # Backend API (Node/Express)
│   └── agents-hub/         # Python AI agents (FastAPI - optional)
├── packages/
│   ├── db/                 # Prisma ORM & schema
│   ├── shared/             # Shared types & utilities
│   ├── ui/                 # Reusable React components
│   └── agents-sdk/         # Client SDK
├── website/                # Marketing site (Next.js)
└── Auto service phone caller/  # Specialized auto shop features
```

### Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Clerk (multi-tenant SSO support)
- **Voice**: Twilio Programmable Voice, ElevenLabs AI Voice
- **Billing**: Stripe with subscription management
- **Deployment**: Vercel (frontend), Render (API), Neon (database)

## 🚀 Features

### Core Features

✅ **Multi-Tenant Architecture** - Each organization has isolated data  
✅ **AI Voice Agents** - Configure agents with custom prompts and voices  
✅ **Work Order Integration** - Technicians trigger calls with job details  
✅ **Call Management** - View all calls with transcripts and recordings  
✅ **Real-Time Transcription** - Live conversation logging  
✅ **Billing Integration** - Stripe-powered subscription tiers  
✅ **Analytics Dashboard** - Usage metrics and insights  
✅ **Phone Number Provisioning** - Assign Twilio numbers to tenants  
✅ **Admin Panel** - Super admin for managing all tenants  

### Subscription Tiers

| Feature | Starter ($499/mo) | Growth ($1,499/mo) | Pro ($3,999/mo) | Enterprise (Custom) |
|---------|------------------|-------------------|-----------------|---------------------|
| **Chat Agents** | ✅ | ✅ | ✅ | ✅ |
| **Voice Agents** | ❌ | ✅ | ✅ | ✅ |
| **SMS Agents** | ❌ | ❌ | ✅ | ✅ |
| **Messages/mo** | 2,000 | 10,000 | 25,000 | Unlimited |
| **Minutes/mo** | 500 | 2,000 | 5,000 | Unlimited |
| **CRM Integration** | ❌ | ✅ | ✅ | ✅ |
| **Helpdesk Integration** | ❌ | ❌ | ✅ | ✅ |
| **SSO** | ❌ | ❌ | ✅ | ✅ |
| **Audit Logs** | ❌ | ❌ | ✅ | ✅ |
| **Advanced Analytics** | ❌ | ❌ | ✅ | ✅ |

## 📦 Installation

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (or Neon account)
- Twilio account
- Clerk account (for auth)
- Stripe account (for billing)

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd speakdirect

# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Edit the .env files with your API keys

# Set up database
cd packages/db
pnpm prisma:migrate:dev
cd ../..

# Start development servers
pnpm dev
```

This starts:
- Web app: http://localhost:2001
- Admin panel: http://localhost:2100
- API: http://localhost:8081
- Website: http://localhost:3001

## 🔧 Configuration

### Database Setup

1. Create a PostgreSQL database (or use Neon)
2. Set `DATABASE_URL` in `apps/api/.env`:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/speakdirect
   ```
3. Run migrations:
   ```bash
   cd packages/db
   pnpm prisma:migrate:dev
   ```

### Twilio Setup

1. Create account at https://twilio.com
2. Purchase a phone number with Voice capabilities
3. Add credentials to `apps/api/.env`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_CALLER_ID=+15551234567
   ```
4. Configure webhook in Twilio Console:
   - URL: `https://your-api-url/twilio/voice/inbound`
   - Method: POST

### Clerk Authentication

1. Create account at https://clerk.com
2. Create an application
3. Add keys to `apps/web/.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx
   ```

### Stripe Billing

1. Create account at https://stripe.com
2. Create products and prices
3. Add keys to `apps/api/.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   ```
4. Set up webhook endpoint:
   - URL: `https://your-api-url/webhooks/stripe`
   - Events: subscription.*, invoice.*

## 📱 Usage

### For Technicians (Service Centers)

1. Log into the dashboard
2. Navigate to "Technicians" page
3. Fill out work order:
   - Customer name
   - Phone number
   - Vehicle details
   - Service performed
   - Total cost
4. Click "Call Customer Now"
5. AI agent calls customer with update

### For Administrators

1. Log into admin panel
2. Manage tenants (organizations)
3. Provision phone numbers
4. Monitor usage and billing
5. View all calls across tenants

### For Customers

1. Receive AI-powered call with service update
2. Approve or decline charges
3. Ask questions naturally
4. Book pickup time
5. Receive confirmation

## 🎨 Customization

### Agent Configuration

Agents can be customized with:

- **System Prompts** - Define personality and behavior
- **Voice Settings** - Choose voice provider and voice ID
- **Temperature** - Control response creativity (0-1)
- **Max Tokens** - Limit response length
- **Status** - Draft, Active, or Paused

Access via Dashboard → Agents → [Agent Name] → Configure

### Adding Custom Features

The platform is built modularly. To add features:

1. **Backend**: Add routes in `apps/api/src/server.ts`
2. **Frontend**: Add pages in `apps/web/app/(console)/`
3. **Database**: Update schema in `packages/db/prisma/schema.prisma`
4. **Types**: Add shared types in `packages/shared/src/`

## 🧪 Testing

### Manual Testing

1. **Test Outbound Call**:
   - Go to Technicians page
   - Submit a work order with your phone number
   - Verify you receive the call

2. **Test Inbound Call**:
   - Call your Twilio number
   - Verify AI agent answers
   - Check dashboard for call log

3. **Test Authentication**:
   - Sign up as new user
   - Verify email confirmation
   - Test login/logout

### Automated Testing (Coming Soon)

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

## 📊 Monitoring

### Logs

- **API Logs**: Check Render dashboard or local terminal
- **Frontend Logs**: Check Vercel dashboard or browser console
- **Database Logs**: Check Neon dashboard

### Analytics

- **PostHog** (optional): User behavior tracking
- **Sentry** (optional): Error monitoring
- **Stripe Dashboard**: Billing and subscription metrics

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete production deployment instructions.

Quick deploy:

```bash
# Deploy API to Render
git push origin main
# (Configure auto-deploy in Render dashboard)

# Deploy Web to Vercel
vercel --prod

# Deploy Admin to Vercel
cd apps/admin && vercel --prod
```

## 🔐 Security

- All API endpoints require authentication via Clerk
- Admin endpoints require `ADMIN_TOKEN`
- Twilio webhooks verify request signatures
- Stripe webhooks verify signatures
- Database connections use SSL
- Sensitive data is encrypted at rest
- CORS is configured for specific origins
- Rate limiting on API endpoints

## 📈 Scaling

### Performance Optimization

- **Caching**: Implement Redis for frequently accessed data
- **CDN**: Use Vercel Edge Network for frontend
- **Database**: Use connection pooling and read replicas
- **API**: Horizontal scaling with multiple Render instances

### Cost Optimization

- **Twilio**: Optimize call duration
- **Database**: Use appropriate Neon compute tier
- **Vercel**: Optimize bundle size and reduce function invocations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

Proprietary - All rights reserved

## 🆘 Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Email**: support@speakdirect.xyz

## 🗺️ Roadmap

### Q4 2025
- ✅ Core platform MVP
- ✅ Technician work order flow
- ✅ Multi-tenant architecture
- 🚧 ElevenLabs integration
- 🚧 Advanced analytics

### Q1 2026
- 📅 SMS agent support
- 📅 CRM integrations (Salesforce, HubSpot)
- 📅 Helpdesk integrations (Zendesk, Intercom)
- 📅 Mobile app (React Native)

### Q2 2026
- 📅 WhatsApp Business integration
- 📅 Multi-language support
- 📅 Voice cloning
- 📅 Custom AI training

## 💡 Tips & Best Practices

### Agent Configuration

- Keep system prompts concise (200-300 words)
- Test agents in DRAFT mode before making ACTIVE
- Use temperature 0.5-0.7 for consistent responses
- Set max tokens to 200-500 for phone calls

### Phone Number Management

- Use dedicated numbers per tenant for tracking
- Configure status callbacks for all webhooks
- Enable call recording for quality assurance
- Monitor call costs in Twilio dashboard

### Development Workflow

- Use feature branches for new features
- Test locally before pushing to production
- Review call logs after making prompt changes
- Monitor error rates in Sentry

---

**Built with ❤️ by the SpeakDirect Team**
