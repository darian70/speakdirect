# SpeakDirect Quick Start Guide

Get up and running with SpeakDirect in under 30 minutes.

## 🚀 5-Minute Local Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd speakdirect

# Run automated setup
chmod +x scripts/setup-local.sh
./scripts/setup-local.sh
```

The setup script will:
- Check Node.js and pnpm versions
- Install all dependencies
- Create environment files
- Optionally set up database

### Step 2: Configure Environment Variables

Edit `apps/api/.env`:

```env
# Minimum required for local development
DATABASE_URL=postgresql://user:password@localhost:5432/speakdirect
ADMIN_TOKEN=your_secure_token_here
```

Edit `apps/web/.env.local`:

```env
API_BASE_URL=http://localhost:8081
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

### Step 3: Start Development Servers

```bash
pnpm dev
```

Access the platform:
- **Web App**: http://localhost:2001
- **Admin Panel**: http://localhost:2100
- **API**: http://localhost:8081
- **Marketing Site**: http://localhost:3001

## 📱 First Steps in the Platform

### 1. Create Your Account

1. Go to http://localhost:2001
2. Click "Sign Up"
3. Enter your email and password
4. Verify your email (check inbox)
5. Complete onboarding

### 2. Create Your First AI Agent

1. Navigate to **Agents** page
2. Click **"Create Agent"**
3. Fill in details:
   - **Name**: "Customer Support Agent"
   - **Channel**: Chat (Voice requires Growth plan)
   - **Initial Prompt**: "You are a friendly customer support agent"
4. Click **"Create"**

### 3. Configure Your Agent

1. Click on your agent
2. Go to **"Configure"**
3. Add a detailed system prompt:

```
You are a professional customer service agent for an auto repair shop.
Your goal is to:
- Inform customers about their vehicle service status
- Provide clear cost breakdowns
- Answer questions about the work performed
- Schedule pickup times
- Be friendly, clear, and professional

Always ask if the customer has any questions before ending the conversation.
```

4. Adjust settings:
   - **Temperature**: 0.7 (balanced)
   - **Max Tokens**: 300
5. Click **"Save Changes"**

## 🔧 Setting Up Voice Calls (Growth Plan)

### Prerequisites

- Twilio account with phone number
- Growth plan or higher (upgrade in Billing)

### Step 1: Configure Twilio

1. Get credentials from [Twilio Console](https://console.twilio.com)
2. Add to `apps/api/.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_CALLER_ID=+15551234567
DEFAULT_TECH_NUMBER=+15559876543
```

3. Restart API server: `pnpm dev`

### Step 2: Configure Webhook

1. Go to Twilio Console → Phone Numbers
2. Click your number
3. Under "Voice & Fax" → "A Call Comes In":
   - **Webhook**: `http://your-ngrok-url/twilio/voice/inbound`
   - **HTTP Method**: POST

**Local Development**: Use ngrok to expose your local API:
```bash
ngrok http 8081
# Copy the https URL and use it in Twilio webhook
```

### Step 3: Provision Phone Number

1. In dashboard, go to **Settings** → **Phone Numbers**
2. Click **"Add Number"**
3. Enter your Twilio number: `+15551234567`
4. Add label: "Main Line"
5. Click **"Add Number"**

### Step 4: Test Outbound Call

1. Navigate to **Technicians** page
2. Fill out work order:
   - **Customer Name**: Your name
   - **Customer Phone**: Your phone number (with country code)
   - **Vehicle**: "2020 Honda Accord"
   - **Service**: "Oil change completed"
   - **Cost**: "$45.00"
3. Click **"Call Customer Now"**
4. Answer your phone!

## 💳 Setting Up Billing (Optional)

### Step 1: Create Stripe Account

1. Sign up at [Stripe](https://stripe.com)
2. Use **Test Mode** for development
3. Copy API keys

### Step 2: Configure Stripe

Add to `apps/api/.env`:

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
```

### Step 3: Create Products

In Stripe Dashboard, create products:

1. **Starter Plan**
   - Name: "Starter"
   - Price: $499/month
   - ID: `starter`

2. **Growth Plan**
   - Name: "Growth"
   - Price: $1,499/month
   - ID: `growth`

3. **Pro Plan**
   - Name: "Pro"
   - Price: $3,999/month
   - ID: `pro`

### Step 4: Test Subscription

1. In dashboard, go to **Billing**
2. Click **"Upgrade Plan"**
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify plan updates

## 🎯 Common Use Cases

### Use Case 1: Auto Repair Shop

**Scenario**: Technician finishes repair, wants to notify customer

1. Technician logs into dashboard
2. Goes to **Technicians** page
3. Fills out work order with service details
4. Clicks **"Call Customer Now"**
5. AI calls customer with update
6. Customer approves charges over phone
7. Technician sees confirmation in dashboard

### Use Case 2: Appointment Booking

**Scenario**: Customer calls to book appointment

1. Customer dials your Twilio number
2. AI agent answers with greeting
3. Agent asks for service type, preferred date/time
4. Agent books appointment in system
5. Agent confirms details with customer
6. Appointment appears in dashboard

### Use Case 3: Service Status Inquiry

**Scenario**: Customer calls to check on repair status

1. Customer calls support number
2. AI agent answers
3. Agent asks for customer name or phone
4. Agent looks up service order
5. Agent provides status update
6. Agent offers additional help

## 🐛 Troubleshooting

### API Won't Start

**Problem**: Port 8081 already in use

**Solution**:
```bash
# Find process using port
lsof -i :8081

# Kill the process
kill -9 <PID>

# Or change port in apps/api/.env
PORT=8082
```

### Database Connection Error

**Problem**: "db_not_configured"

**Solution**:
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `apps/api/.env`
3. Run migrations: `cd packages/db && pnpm prisma:migrate:dev`

### Calls Not Working

**Problem**: Twilio webhook returns error

**Solutions**:
1. Check ngrok is running (for local dev)
2. Verify webhook URL in Twilio Console
3. Check API logs for errors
4. Verify `TWILIO_CALLER_ID` is correct

### Clerk Authentication Issues

**Problem**: Can't sign in

**Solutions**:
1. Check Clerk keys in `.env.local`
2. Verify using test/live keys consistently
3. Check Clerk Dashboard for errors
4. Clear browser cookies and try again

## 📚 Next Steps

### For Development

1. **Read the Docs**:
   - [PLATFORM_README.md](./PLATFORM_README.md) - Full platform overview
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
   - [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing procedures

2. **Customize**:
   - Modify agent prompts for your industry
   - Add custom fields to work orders
   - Create industry-specific templates

3. **Extend**:
   - Add CRM integration
   - Build custom analytics
   - Create mobile app

### For Production

1. **Complete Checklist**:
   - Review [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
   - Set up monitoring (Sentry, PostHog)
   - Configure backups

2. **Deploy**:
   - Use deployment script: `./scripts/deploy.sh all`
   - Configure custom domains
   - Set up SSL certificates

3. **Monitor**:
   - Check error logs daily
   - Monitor call success rates
   - Review customer feedback

## 🆘 Getting Help

- **Documentation**: Check `/docs` folder
- **GitHub Issues**: Report bugs or request features
- **Discord/Slack**: Join our community (if available)
- **Email**: support@speakdirect.xyz

## 🎉 Success!

You're now ready to build AI phone agents! 

Start with simple use cases and gradually add complexity. Test thoroughly before going to production.

Happy building! 🚀

---

**Last Updated**: 2025-09-30  
**Version**: 1.0.0
