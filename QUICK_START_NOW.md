# ⚡ QUICK START - Deploy Right Now (3 Hours)

**You have**: Neon database URL ✅  
**You need**: Clerk keys, Twilio keys, then deploy!

---

## 🎯 Your Neon Database is Ready!

✅ **Database URL**: Already saved in `.env.deployment`  
✅ **Next Step**: Get remaining API keys

---

## 📋 Step-by-Step (Do in Order)

### **STEP 1: Generate Security Tokens** (2 min)

Open terminal and run:
```bash
# Generate ADMIN_TOKEN
openssl rand -hex 32

# Copy output, paste into .env.deployment as ADMIN_TOKEN

# Generate HMAC_SECRET  
openssl rand -hex 32

# Copy output, paste into .env.deployment as HMAC_SECRET
```

### **STEP 2: Get Clerk Keys** (5 min)

1. Go to: https://dashboard.clerk.com/last-active?path=api-keys
2. Copy **Publishable key** (starts with `pk_`)
3. Paste into `.env.deployment` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
4. Copy **Secret key** (starts with `sk_`)
5. Paste into `.env.deployment` as `CLERK_SECRET_KEY`

**Important**: Add domains in Clerk:
- Go to: https://dashboard.clerk.com → Domains
- Add: `app.speakdirect.xyz`
- Add: `admin.speakdirect.xyz`

### **STEP 3: Get Twilio Keys** (10 min)

1. Go to: https://www.twilio.com/console
2. Sign up (get $15 free credit!)
3. Verify your phone number
4. Copy **Account SID** (starts with `AC`)
5. Paste into `.env.deployment` as `TWILIO_ACCOUNT_SID`
6. Copy **Auth Token** (click eye icon to reveal)
7. Paste into `.env.deployment` as `TWILIO_AUTH_TOKEN`

**Buy Phone Number**:
1. Go to: Phone Numbers → Buy a Number
2. Choose country (US)
3. Check "Voice" capability
4. Buy number ($1/month)
5. Copy number (format: `+15551234567`)
6. Paste into `.env.deployment` as `TWILIO_CALLER_ID`

**Add Your Phone**:
1. Enter YOUR phone number in `.env.deployment` as `DEFAULT_TECH_NUMBER`
2. Format: `+15551234567` (must start with +)

### **STEP 4: (Optional) Get ElevenLabs Keys** (5 min)

**Skip this if you want basic voice first - you can add later!**

1. Go to: https://elevenlabs.io
2. Sign up (Starter $5/mo)
3. Go to: Profile → API Keys
4. Create API key
5. Copy and paste into `.env.deployment` as `ELEVENLABS_API_KEY`
6. Go to: Voice Library
7. Choose a voice (click play to hear)
8. Copy Voice ID
9. Paste into `.env.deployment` as `ELEVENLABS_VOICE_ID`

---

## 🚀 Deploy API to Render (30 min)

### **Step 1: Create Service** (10 min)

1. Go to: https://dashboard.render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect GitHub account
5. Select repository: `speakdirect`
6. Configure:
   - **Name**: `speakdirect-api`
   - **Region**: US West (or closest)
   - **Branch**: `main`
   - **Root Directory**: `apps/api`
   - **Runtime**: Node
   - **Build Command**: `pnpm install --frozen-lockfile=false && pnpm build`
   - **Start Command**: `pnpm start`
   - **Instance Type**: Starter ($7/mo)

### **Step 2: Add Environment Variables** (15 min)

Click "Advanced" → "Add Environment Variable"

**Copy from your `.env.deployment` file**:

```bash
PORT=8081
NODE_ENV=production
DATABASE_URL=<your Neon URL>
ADMIN_TOKEN=<your generated token>
HMAC_SECRET=<your generated token>
API_PUBLIC_URL=https://speakdirect-api.onrender.com
TWILIO_ACCOUNT_SID=<from Twilio>
TWILIO_AUTH_TOKEN=<from Twilio>
TWILIO_CALLER_ID=<your Twilio number>
DEFAULT_TECH_NUMBER=<your phone number>
ALLOWED_ORIGINS=https://speakdirect.xyz,https://app.speakdirect.xyz
```

**If using ElevenLabs**:
```bash
ELEVENLABS_API_KEY=<from ElevenLabs>
ELEVENLABS_VOICE_ID=<from ElevenLabs>
```

### **Step 3: Deploy** (5 min)

1. Click "Create Web Service"
2. Wait 5-10 minutes
3. Watch logs (should see no errors)
4. When done, copy URL: `https://speakdirect-api.onrender.com`

---

## 🗄️ Run Database Migrations (3 min)

**In your terminal**:

```bash
cd /Users/darian/Desktop/Ai\ Agent\ Sales\ voice\ agent\ only/packages/db

DATABASE_URL="postgresql://neondb_owner:npg_GVDz0yH4oNgv@ep-purple-feather-adiz60yi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" pnpm prisma:migrate:deploy
```

You should see: `✔ All migrations have been applied`

---

## 🌐 Deploy Frontend to Vercel (30 min)

### **Step 1: Import Project** (5 min)

1. Go to: https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import from GitHub: `speakdirect`
4. Click repository

### **Step 2: Configure** (5 min)

```
Framework: Next.js
Root Directory: apps/web
Build Command: cd ../.. && pnpm install && pnpm --filter @omniagents/web build
Output Directory: .next
Install Command: pnpm install
```

### **Step 3: Add Environment Variables** (10 min)

Click "Environment Variables"

**Copy from your `.env.deployment`**:

```bash
API_BASE_URL=https://speakdirect-api.onrender.com
API_ADMIN_TOKEN=<same as your ADMIN_TOKEN>
NEXT_PUBLIC_SITE_URL=https://app.speakdirect.xyz
NEXT_PUBLIC_DEFAULT_PLAN_ID=starter
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<from Clerk>
CLERK_SECRET_KEY=<from Clerk>
```

### **Step 4: Deploy** (5 min)

1. Click "Deploy"
2. Wait 2-3 minutes
3. Should see "Build Completed"

### **Step 5: Add Domain** (5 min)

1. Go to: Project Settings → Domains
2. Add: `app.speakdirect.xyz`
3. Vercel shows DNS records
4. Go to your domain registrar (where you bought speakdirect.xyz)
5. Add DNS records (CNAME or A)
6. Wait 5-10 minutes
7. Visit: https://app.speakdirect.xyz

---

## 📞 Configure Twilio Webhooks (10 min)

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Click your phone number
3. Scroll to "Voice Configuration"

**A CALL COMES IN**:
- Webhook: `https://speakdirect-api.onrender.com/twilio/voice/inbound`
- HTTP: POST

**CALL STATUS CHANGES**:
- Webhook: `https://speakdirect-api.onrender.com/twilio/voice/status`
- HTTP: POST
- Events: Check all (Initiated, Ringing, Answered, Completed)

4. Click "Save Configuration"

---

## ✅ Test Everything (20 min)

### **Test 1: API Health** (1 min)
```bash
# Visit this URL in browser:
https://speakdirect-api.onrender.com/health

# Should see: {"ok":true,"timestamp":"..."}
```

### **Test 2: Sign Up** (3 min)
1. Go to: https://app.speakdirect.xyz
2. Click "Sign Up"
3. Enter email, password
4. Verify email
5. Should see dashboard ✅

### **Test 3: Create Agent** (3 min)
1. Go to: Agents
2. Click "Create Agent"
3. Name: Test Agent
4. Channel: Voice
5. Save
6. Should appear in list ✅

### **Test 4: Make Test Call** (10 min) 🎯
1. Go to: Technicians page
2. Fill form with YOUR info:
   - Name: Your Name
   - Phone: YOUR PHONE (+15551234567)
   - Vehicle: 2020 Honda Accord
   - Service: Oil Change Test
   - Cost: $50
   - Notes: This is a test
3. Click "Call Customer Now"
4. **YOUR PHONE RINGS!** 📱
5. Answer it
6. Listen to AI message
7. Hang up

### **Test 5: View Call Log** (3 min)
1. Go to: Calls page
2. See your test call
3. Click it
4. See work order details
5. See transcript ✅

---

## 🎉 SUCCESS CHECKLIST

By end of tonight:
- [ ] All API keys collected
- [ ] API deployed to Render
- [ ] Migrations run
- [ ] Frontend deployed to Vercel
- [ ] Domain configured
- [ ] Twilio webhooks set
- [ ] You called yourself successfully
- [ ] Saw call in dashboard with transcript

**If all checked ✅ = READY FOR USERS TOMORROW!**

---

## 🚨 If Something Breaks

### **API won't start**:
- Check Render logs
- Verify DATABASE_URL is correct
- Check all env vars are set

### **Can't sign up**:
- Verify Clerk keys in Vercel
- Check domains added in Clerk dashboard
- Try incognito mode

### **Calls don't work**:
- Check Twilio webhook URLs
- Verify phone number formats (+15551234567)
- Check Render logs during call
- Test webhook: `curl https://your-api-url/twilio/voice/inbound`

### **No voice on call**:
- Remove ElevenLabs vars to use basic Twilio TTS
- Check Render logs for voice errors
- Verify ElevenLabs API key is correct

---

## ⏱️ TIME TRACKING

- [x] Database setup: 0 min (done!)
- [ ] Get API keys: 20 min
- [ ] Deploy API: 30 min
- [ ] Deploy Frontend: 30 min
- [ ] Configure Twilio: 10 min
- [ ] Test everything: 20 min
- [ ] Buffer for issues: 30 min

**Total: ~2.5 hours**

---

## 🎯 START NOW!

1. **Open**: `.env.deployment` file
2. **Generate**: Security tokens (Step 1)
3. **Get**: Clerk keys (Step 2)
4. **Get**: Twilio keys (Step 3)
5. **Deploy**: Follow steps above
6. **Test**: Call yourself!

**You got this! Everything is ready!** 🚀

---

## 📞 TOMORROW MORNING

Once everything works tonight:

1. **9:00 AM**: Final test
2. **9:30 AM**: Create user accounts
3. **10:00 AM**: Invite 3 users
4. **10:30 AM - 12:00 PM**: Onboard them (30 min each)
5. **12:00 PM**: Celebrate! 🎉

**Platform will be live with users by tomorrow afternoon!**
