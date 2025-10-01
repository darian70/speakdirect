# 🚨 URGENT: Deploy by Tomorrow - Complete Checklist

**Goal**: Have a working AI phone system with users by tomorrow  
**Time**: ~3-4 hours total  
**Status**: Everything is ready - just need to configure services

---

## ✅ PRE-DEPLOYMENT CHECKLIST (DO THIS FIRST)

### **Verify Latest Build** (2 minutes)
```bash
1. Go to: https://github.com/darian70/speakdirect/actions
2. Find the LATEST run (commit c05cc21 or newer)
3. Wait for it to turn GREEN ✅
4. If it's still running, wait ~3 minutes
5. Ignore old failed builds - they're from before the fix
```

---

## 🎯 PHASE 1: Get All API Keys & Credentials (30 minutes)

Do these IN ORDER. Write down each credential as you get it.

### **1. Database - Neon PostgreSQL** (5 min)
```bash
☐ Go to: https://neon.tech
☐ Sign up (free)
☐ Click "Create Project"
☐ Name: speakdirect-prod
☐ Region: Choose closest to you
☐ Click "Create"
☐ Copy connection string (starts with postgresql://)
☐ Save as: DATABASE_URL

Example: postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb
```

### **2. Authentication - Clerk** (10 min)
```bash
☐ Go to: https://dashboard.clerk.com
☐ Login (you already have account)
☐ Create new application or select existing
☐ Name: SpeakDirect Production
☐ Go to API Keys section
☐ Copy "Publishable key" (starts with pk_)
☐ Save as: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
☐ Copy "Secret key" (starts with sk_)
☐ Save as: CLERK_SECRET_KEY

Add domains:
☐ Go to "Domains" in Clerk
☐ Add: app.speakdirect.xyz
☐ Add: admin.speakdirect.xyz
```

### **3. Phone Calling - Twilio** (10 min)
```bash
☐ Go to: https://www.twilio.com/console
☐ Sign up ($15 free credit!)
☐ Verify your phone number
☐ Copy "Account SID" (starts with AC)
☐ Save as: TWILIO_ACCOUNT_SID
☐ Copy "Auth Token" (click to reveal)
☐ Save as: TWILIO_AUTH_TOKEN

Buy a phone number:
☐ Go to: Phone Numbers → Buy a Number
☐ Choose country (US)
☐ Filter: Voice capability required
☐ Buy a number ($1/month)
☐ Copy the number (format: +15551234567)
☐ Save as: TWILIO_CALLER_ID

Your tech number:
☐ Save YOUR phone number as: DEFAULT_TECH_NUMBER
☐ Format: +15551234567 (E.164 format)
```

### **4. AI Voice - ElevenLabs** (5 min) - OPTIONAL but recommended
```bash
☐ Go to: https://elevenlabs.io
☐ Sign up (Starter $5/mo)
☐ Go to Profile → API Keys
☐ Click "Create API Key"
☐ Copy the key (starts with sk_)
☐ Save as: ELEVENLABS_API_KEY

Choose a voice:
☐ Go to Voice Library
☐ Try voices (click play)
☐ Choose one you like
☐ Copy Voice ID
☐ Save as: ELEVENLABS_VOICE_ID

Skip this if you want to start without natural AI voice
```

### **5. Generate Security Tokens** (2 min)
```bash
Generate two random 32-character strings:

Option A (Mac/Linux):
openssl rand -hex 32

Option B (Online):
Go to: https://www.random.org/strings/

☐ Generate first string
☐ Save as: ADMIN_TOKEN
☐ Generate second string
☐ Save as: HMAC_SECRET
```

---

## 🚀 PHASE 2: Deploy Backend API (30 minutes)

### **Deploy to Render**

#### **Step 1: Connect GitHub** (5 min)
```bash
☐ Go to: https://dashboard.render.com
☐ Sign up with GitHub
☐ Click "New +"
☐ Select "Web Service"
☐ Click "Connect Account" → Connect GitHub
☐ Select repository: speakdirect
```

#### **Step 2: Configure Service** (5 min)
```bash
Name: speakdirect-api
Region: Choose closest (US West recommended)
Branch: main
Root Directory: apps/api
Runtime: Node
Build Command: pnpm install --frozen-lockfile=false && pnpm build
Start Command: pnpm start
Instance Type: Starter ($7/month)
```

#### **Step 3: Add Environment Variables** (15 min)
```bash
☐ Click "Advanced" → "Add Environment Variable"
☐ Add each variable below:

PORT=8081
NODE_ENV=production
DATABASE_URL=<paste your Neon connection string>
ADMIN_TOKEN=<your generated 32-char token>
HMAC_SECRET=<your generated 32-char token>
API_PUBLIC_URL=https://speakdirect-api.onrender.com
TWILIO_ACCOUNT_SID=<from Twilio>
TWILIO_AUTH_TOKEN=<from Twilio>
TWILIO_CALLER_ID=<your Twilio number +15551234567>
DEFAULT_TECH_NUMBER=<your phone number +15551234567>
ALLOWED_ORIGINS=https://speakdirect.xyz,https://app.speakdirect.xyz

Optional (if using ElevenLabs):
ELEVENLABS_API_KEY=<from ElevenLabs>
ELEVENLABS_VOICE_ID=<from ElevenLabs>
```

#### **Step 4: Deploy** (5 min)
```bash
☐ Click "Create Web Service"
☐ Wait 5-10 minutes for deploy
☐ Watch logs for errors
☐ When done, copy URL: https://speakdirect-api.onrender.com
```

#### **Step 5: Run Database Migrations** (3 min)
```bash
☐ Open Terminal on your computer
☐ cd to project folder
☐ Run:

cd packages/db
DATABASE_URL="<your_neon_url>" pnpm prisma:migrate:deploy

☐ Should see "All migrations have been applied"
```

#### **Step 6: Verify API Works** (2 min)
```bash
☐ Visit: https://speakdirect-api.onrender.com/health
☐ Should see: {"ok":true,"timestamp":"..."}
☐ If error, check Render logs
```

---

## 🌐 PHASE 3: Deploy Frontend (30 minutes)

### **Deploy Web App to Vercel**

#### **Step 1: Import Project** (5 min)
```bash
☐ Go to: https://vercel.com/dashboard
☐ Click "Add New..." → "Project"
☐ Import from GitHub: speakdirect
☐ Click "Import"
```

#### **Step 2: Configure** (5 min)
```bash
Framework Preset: Next.js
Root Directory: apps/web
Build Command: cd ../.. && pnpm install && pnpm --filter @omniagents/web build
Output Directory: .next
Install Command: pnpm install
```

#### **Step 3: Add Environment Variables** (10 min)
```bash
☐ Click "Environment Variables"
☐ Add each variable:

API_BASE_URL=https://speakdirect-api.onrender.com
API_ADMIN_TOKEN=<same as Render ADMIN_TOKEN>
NEXT_PUBLIC_SITE_URL=https://app.speakdirect.xyz
NEXT_PUBLIC_DEFAULT_PLAN_ID=starter
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<from Clerk>
CLERK_SECRET_KEY=<from Clerk>

Optional analytics:
NEXT_PUBLIC_POSTHOG_KEY=<skip for now>
SENTRY_DSN=<skip for now>
```

#### **Step 4: Deploy** (5 min)
```bash
☐ Click "Deploy"
☐ Wait 2-3 minutes
☐ Watch build logs
☐ Should see "Build Completed"
```

#### **Step 5: Add Custom Domain** (5 min)
```bash
☐ Go to Project Settings → Domains
☐ Add domain: app.speakdirect.xyz
☐ Vercel will show DNS records
☐ Go to your domain registrar
☐ Add the DNS records (CNAME or A record)
☐ Wait 5-10 minutes for DNS propagation
☐ Verify at: https://app.speakdirect.xyz
```

### **Deploy Admin Panel to Vercel** (15 min)

Repeat same process but:
```bash
Root Directory: apps/admin
Domain: admin.speakdirect.xyz
Environment Variables: (same Clerk keys)
```

---

## 📞 PHASE 4: Configure Twilio Webhooks (15 minutes)

### **Connect Twilio to Your API**

#### **Step 1: Configure Phone Number** (10 min)
```bash
☐ Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
☐ Click on your phone number
☐ Scroll to "Voice Configuration"

A CALL COMES IN:
☐ Select: "Webhook"
☐ URL: https://speakdirect-api.onrender.com/twilio/voice/inbound
☐ HTTP: POST

PRIMARY HANDLER FAILS:
☐ Leave empty

CALL STATUS CHANGES:
☐ URL: https://speakdirect-api.onrender.com/twilio/voice/status
☐ HTTP: POST
☐ Events: Select all (Initiated, Ringing, Answered, Completed)

☐ Click "Save Configuration"
```

#### **Step 2: Test Webhook** (5 min)
```bash
☐ Call your Twilio number from your phone
☐ You should hear: "Hello from SpeakDirect" or similar
☐ If error, check Render logs
☐ If silent, check webhook URL is correct
```

---

## 🧪 PHASE 5: Test Everything (30 minutes)

### **Test 1: Sign Up Flow** (5 min)
```bash
☐ Go to: https://app.speakdirect.xyz
☐ Click "Sign Up"
☐ Enter your email
☐ Verify email
☐ Should see dashboard
☐ If error, check Clerk configuration
```

### **Test 2: Create Agent** (5 min)
```bash
☐ Go to: Agents page
☐ Click "Create Agent"
☐ Fill in:
   Name: Test Agent
   Channel: Voice
   Prompt: You are a friendly assistant
☐ Click "Save"
☐ Should see agent in list
```

### **Test 3: Make Outbound Call** (10 min)
```bash
☐ Go to: Technicians page
☐ Fill in form:
   Customer Name: Your Name
   Customer Phone: YOUR PHONE NUMBER (+15551234567)
   Vehicle: 2020 Honda Accord
   Service: Oil Change
   Total Cost: $50
   Notes: Test call
☐ Click "Call Customer Now"
☐ Wait 10-20 seconds
☐ YOUR PHONE SHOULD RING!
☐ Answer it
☐ Listen to AI message
☐ Hang up
```

### **Test 4: View Call Log** (5 min)
```bash
☐ Go to: Calls page
☐ Should see your test call
☐ Click on it
☐ Should see:
   - Work order details
   - Call duration
   - Transcript (may take a minute)
   - Recording link
```

### **Test 5: Inbound Call** (5 min)
```bash
☐ From a different phone, call your Twilio number
☐ Should hear greeting
☐ Test voice interaction
☐ Check call appears in dashboard
```

---

## 👥 PHASE 6: Invite First Users (Tomorrow Morning)

### **Prepare User Accounts** (15 min)
```bash
☐ Go to: https://admin.speakdirect.xyz
☐ Create organization/tenant for first customer
☐ Set up their plan (Growth for voice)
☐ Add phone number for them
☐ Create initial agent for them
```

### **Onboard User** (30 min per user)
```bash
☐ Send invitation email
☐ Schedule 15-min call
☐ Walk them through:
   1. Signing up
   2. Creating an agent
   3. Making a test call
   4. Viewing results
☐ Get feedback
☐ Fix any issues immediately
```

---

## 🚨 TROUBLESHOOTING - Common Issues

### **Issue: API returns 503**
```bash
✓ Check DATABASE_URL is correct
✓ Run migrations: DATABASE_URL="..." pnpm prisma:migrate:deploy
✓ Check Render logs for errors
✓ Restart Render service
```

### **Issue: Can't sign up**
```bash
✓ Check Clerk keys in Vercel
✓ Verify domains added in Clerk dashboard
✓ Check browser console for errors
✓ Try incognito mode
```

### **Issue: Calls don't work**
```bash
✓ Verify Twilio webhook URL is exact
✓ Check TWILIO_CALLER_ID format (+15551234567)
✓ Check DEFAULT_TECH_NUMBER format
✓ Test webhook: curl https://your-api/twilio/voice/inbound
✓ Check Render logs during call
✓ Verify Twilio number has voice capability
```

### **Issue: No voice/silent call**
```bash
✓ Check ElevenLabs API key (if using)
✓ Fall back to Twilio TTS (remove ElevenLabs vars)
✓ Check Render logs for voice errors
✓ Test with simple text-to-speech first
```

### **Issue: Build fails on Vercel**
```bash
✓ Check all env vars are set
✓ Verify CLERK keys are correct
✓ Check build logs for specific error
✓ Try deploying from Vercel dashboard manually
```

---

## 📋 FINAL PRE-LAUNCH CHECKLIST

### **Before Going Live**
```bash
☐ All services deployed and green
☐ Database connected and migrations run
☐ Made successful test call to yourself
☐ Viewed call in dashboard
☐ Inbound calls working
☐ Sign up flow works
☐ Clerk authentication working
☐ All environment variables set
☐ Twilio webhooks configured
☐ Custom domains working
☐ No errors in logs
```

### **Documentation Ready**
```bash
☐ User guide created (how to use platform)
☐ Pricing confirmed ($499, $1499, $3999/mo)
☐ Support email set up
☐ Terms of service available
☐ Privacy policy available
```

### **First 3 Users Ready**
```bash
☐ User 1: Name, Email, Phone
☐ User 2: Name, Email, Phone
☐ User 3: Name, Email, Phone
☐ Onboarding calls scheduled
☐ Test accounts created
```

---

## ⏱️ TIMELINE FOR TOMORROW

### **Today (Evening)**
```bash
6:00 PM - 6:30 PM: Get all API keys (Phase 1)
6:30 PM - 7:00 PM: Deploy API (Phase 2)
7:00 PM - 7:30 PM: Deploy Frontend (Phase 3)
7:30 PM - 7:45 PM: Configure Twilio (Phase 4)
7:45 PM - 8:15 PM: Test everything (Phase 5)
8:15 PM - 8:30 PM: Fix any issues
8:30 PM - 9:00 PM: Buffer time

Total: ~3 hours
```

### **Tomorrow Morning**
```bash
9:00 AM: Final testing
9:30 AM: Create first user accounts
10:00 AM: Send invitations
10:30 AM - 12:00 PM: Onboard 3 users (30 min each)
12:00 PM: Get feedback
1:00 PM: Fix issues if any
2:00 PM: Platform live with users! 🎉
```

---

## 💰 COSTS (Today)

```bash
Render API:        $7/mo   (Starter - pay when billed)
Neon Database:     $0      (Free tier)
Vercel:            $0      (Hobby plan)
Twilio Number:     $1/mo   (charged immediately)
Twilio Credit:     $15     (FREE - they give you this)
ElevenLabs:        $5/mo   (if you add it)
-----------------------------------
Total Today:       $1-6    (depending on ElevenLabs)
Total Monthly:     $8-13   to start
```

---

## 🎯 SUCCESS CRITERIA

### **By Tomorrow Evening**
```bash
✓ Platform deployed and accessible
✓ You made a successful test call
✓ 3 users signed up
✓ 3 users made test calls
✓ All calls logged with transcripts
✓ No major errors
✓ Users gave positive feedback
```

---

## 🆘 EMERGENCY CONTACTS

### **If Things Break**
```bash
Render Docs: https://render.com/docs
Vercel Docs: https://vercel.com/docs
Twilio Support: https://support.twilio.com
Clerk Support: https://clerk.com/support

Check logs:
- Render: Dashboard → Your Service → Logs
- Vercel: Dashboard → Your Project → Logs
- Twilio: Console → Monitor → Logs
```

---

## ✅ CURRENT STATUS

```bash
✓ Code: 100% complete
✓ Docs: 100% complete
✓ Build: Fixed and pushed
✓ APIs needed: Listed above
✓ Deployment steps: Detailed above
✓ Testing plan: Complete
✓ Timeline: Defined

🚀 YOU ARE READY TO DEPLOY!
```

---

## 🎯 START NOW

**Step 1**: Open https://neon.tech and create database  
**Step 2**: Follow Phase 1 above to get all credentials  
**Step 3**: Deploy API (Phase 2)  
**Step 4**: Deploy Frontend (Phase 3)  
**Step 5**: Configure Twilio (Phase 4)  
**Step 6**: Test (Phase 5)  
**Step 7**: Sleep well!  
**Tomorrow**: Onboard users!  

**Time to complete**: ~3 hours tonight  
**Users by tomorrow**: ✅ POSSIBLE!  

---

**LET'S GO! START WITH PHASE 1 RIGHT NOW!** 🚀💪
