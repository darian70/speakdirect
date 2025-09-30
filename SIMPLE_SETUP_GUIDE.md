# SpeakDirect - Simple Setup Guide for Solo Developer

**Goal**: Get a production-ready AI phone system running with minimal cost and complexity.

## 🎯 Your Current Setup (What You Have)

✅ **Git Repo**: https://github.com/darian70/speakdirect.git  
✅ **Website Live**: speakdirect.xyz (deployed on Vercel)  
✅ **Vercel Account**: Connected and ready  
✅ **Clerk Account**: For authentication  
✅ **Code Complete**: All core features built and tested  

## 💰 Cost-Effective Tech Stack (Total: ~$50-100/month)

### Core Services (Pick One Path)

#### **Option A: Maximum Simplicity** (Recommended for Solo Dev)
```
Frontend (FREE):     Vercel Hobby Plan
API ($7-25/mo):      Render Starter
Database ($0-19/mo): Neon Free tier → Scale tier when needed
Voice (~$20/mo):     Twilio Pay-as-you-go
AI Voice ($5-22/mo): ElevenLabs Starter → Creator
Automation (FREE):   n8n Cloud Free tier or Self-hosted
Total: ~$50-70/month to start
```

#### **Option B: Full Control** (If you want more flexibility)
```
Frontend (FREE):     Vercel Hobby
API ($7/mo):         Render Starter
Database (FREE):     Supabase Free tier
Voice (~$20/mo):     Twilio
AI Voice ($22/mo):   ElevenLabs Creator
Automation (FREE):   n8n Self-hosted on Render
Total: ~$50/month
```

## 🚀 Step-by-Step Setup (30 Minutes)

### Step 1: Push Your Code (2 minutes)

```bash
cd /Users/darian/Desktop/Ai\ Agent\ Sales\ voice\ agent\ only

# Add all new files
git add .

# Commit changes
git commit -m "feat: Complete platform with technician workflow, call logging, and agent config"

# Push to GitHub
git push origin main
```

### Step 2: Database Setup (5 minutes)

**Choose Neon (Recommended)**:

1. Go to https://neon.tech
2. Sign up (free)
3. Create project: "speakdirect-prod"
4. Copy connection string
5. Save for later as `DATABASE_URL`

**OR Supabase**:
1. Go to https://supabase.com
2. Create project
3. Get PostgreSQL connection string
4. Save as `DATABASE_URL`

### Step 3: Deploy API to Render (10 minutes)

1. **Go to Render**: https://dashboard.render.com
2. **Connect GitHub**: Link your speakdirect repo
3. **Create Web Service**:
   - Name: `speakdirect-api`
   - Root Directory: `apps/api`
   - Environment: `Node`
   - Build Command: `pnpm install --frozen-lockfile=false && pnpm build`
   - Start Command: `pnpm start`
   - Plan: **Starter ($7/mo)** (Free tier sleeps after 15min inactivity)

4. **Add Environment Variables**:
```
PORT=8081
NODE_ENV=production
DATABASE_URL=<your_neon_connection_string>
ADMIN_TOKEN=<generate_random_32_char_string>
HMAC_SECRET=<generate_random_32_char_string>
API_PUBLIC_URL=https://speakdirect-api.onrender.com
ALLOWED_ORIGINS=https://speakdirect.xyz,https://app.speakdirect.xyz
```

5. **Deploy** and wait 5-10 minutes
6. **Verify**: Visit `https://your-api-url/health`

### Step 4: Run Database Migrations (2 minutes)

```bash
cd packages/db
DATABASE_URL="your_neon_url" pnpm prisma:migrate:deploy
```

### Step 5: Deploy Frontend to Vercel (5 minutes)

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Import Project**: Select your speakdirect repo
3. **Configure**:
   - Framework: Next.js
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter @omniagents/web build`

4. **Environment Variables**:
```
API_BASE_URL=https://speakdirect-api.onrender.com
API_ADMIN_TOKEN=<same_as_render>
NEXT_PUBLIC_SITE_URL=https://app.speakdirect.xyz
NEXT_PUBLIC_DEFAULT_PLAN_ID=starter
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<from_clerk_dashboard>
CLERK_SECRET_KEY=<from_clerk_dashboard>
```

5. **Deploy** (takes 2-3 minutes)
6. **Add Custom Domain**: `app.speakdirect.xyz`

### Step 6: Twilio Setup (5 minutes)

1. **Sign up**: https://twilio.com/console
2. **Buy a Phone Number** ($1/month):
   - Voice capabilities required
   - Choose local number

3. **Configure Webhooks**:
   - Go to Phone Numbers → Your Number
   - **Voice & Fax** → **A Call Comes In**:
     - URL: `https://speakdirect-api.onrender.com/twilio/voice/inbound`
     - Method: POST
   - **Status Callback**:
     - URL: `https://speakdirect-api.onrender.com/twilio/voice/status`
     - Method: POST

4. **Add to Render Environment**:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_CALLER_ID=+15551234567
DEFAULT_TECH_NUMBER=+15559876543
```

### Step 7: ElevenLabs Setup (Optional but Recommended - 3 minutes)

1. **Sign up**: https://elevenlabs.io
2. **Get API Key**: Settings → API Keys
3. **Choose a Voice**: Voice Library → Copy Voice ID
4. **Add to Render**:
```
ELEVENLABS_API_KEY=your_api_key
ELEVENLABS_VOICE_ID=your_voice_id
```

## 🤖 Simple AI Call Flow (No n8n Required to Start)

Your current setup already works! Here's how:

### Current Flow (Built-in):
```
1. Technician submits work order → 
2. API receives request → 
3. Twilio initiates call → 
4. Customer answers → 
5. AI reads work order details → 
6. Call logs saved to database → 
7. View transcript in dashboard
```

### Adding n8n Later (Optional Enhancement):
```
When you want more complex workflows:
1. Deploy n8n to Render (free tier works)
2. Create workflows for:
   - Follow-up calls if no answer
   - SMS fallback
   - Email notifications
   - CRM integration
```

## 📊 Cost Breakdown

### Starting Out (First Month)
- **Render API**: $7/mo (Starter plan)
- **Neon Database**: $0 (Free tier, 0.5GB)
- **Vercel**: $0 (Hobby plan, plenty for starting)
- **Twilio Phone**: $1/mo + usage
- **Twilio Calls**: ~$0.013/min per call
- **ElevenLabs**: $5/mo (Starter, 30k characters)
- **Domain**: ~$1/mo (if new)
**Total: ~$15-20/month + usage**

### Growing (10 calls/day, 5min average)
- Render: $7
- Neon: $0-19 (upgrade if DB >0.5GB)
- Vercel: $0
- Twilio: $1 + (300 calls × 5min × $0.013) = ~$20
- ElevenLabs: $22/mo (Creator, 100k chars)
**Total: ~$50-70/month**

### Scaling (100 calls/day)
- Render: $25 (Standard plan for better performance)
- Neon: $69 (Scale plan)
- Vercel: $20 (Pro, optional)
- Twilio: ~$200/mo
- ElevenLabs: $99 (Professional)
**Total: ~$400/month**

## 🎯 Testing Your Setup (10 minutes)

### 1. Test Sign Up
```
1. Go to https://app.speakdirect.xyz
2. Sign up with your email
3. Verify email
4. Should see dashboard
```

### 2. Create Test Agent
```
1. Navigate to Agents
2. Create new agent
3. Configure with simple prompt
```

### 3. Test Outbound Call
```
1. Go to Technicians page
2. Fill out work order with YOUR phone number
3. Click "Call Customer Now"
4. Answer your phone!
```

### 4. Check Call Logs
```
1. Go to Calls page
2. Find your test call
3. Click to see details
4. Verify work order info and transcript
```

## 🔧 Maintenance (Weekly Tasks)

### Every Week:
- [ ] Check Render logs for errors
- [ ] Review call success rates
- [ ] Monitor Twilio usage/costs
- [ ] Test critical flows

### Every Month:
- [ ] Review and optimize costs
- [ ] Check database size (upgrade Neon if needed)
- [ ] Update dependencies if needed
- [ ] Back up database (Neon does this automatically)

## 🚨 Common Issues & Solutions

### Issue: API Returns 503
**Solution**: Database not connected. Check `DATABASE_URL` in Render.

### Issue: Calls Not Working
**Solution**: 
1. Check Twilio webhook URL is correct
2. Verify `TWILIO_CALLER_ID` matches your number
3. Check Render logs for errors

### Issue: Can't Sign In
**Solution**:
1. Verify Clerk keys in Vercel
2. Check Clerk dashboard for issues
3. Clear browser cookies

### Issue: Slow Performance
**Solution**:
1. Upgrade Render from Starter to Standard
2. Check database query performance
3. Monitor response times in Render dashboard

## 📈 Growing Your Platform

### Month 1: Launch & Validate
- [x] Deploy all services
- [ ] Invite 5 beta users
- [ ] Collect feedback
- [ ] Monitor errors closely

### Month 2: Optimize
- [ ] Add n8n for complex workflows
- [ ] Implement SMS fallback
- [ ] Add analytics dashboard
- [ ] Optimize costs

### Month 3: Scale
- [ ] Upgrade Render if needed
- [ ] Add more phone numbers
- [ ] Integrate CRM (if needed)
- [ ] Add team features

## 💡 Pro Tips for Solo Developer

1. **Start Small**: Don't add n8n until you need complex workflows
2. **Monitor Costs**: Set up billing alerts in Twilio/Render
3. **Use Free Tiers**: Neon/Vercel/n8n all have generous free tiers
4. **Automate**: Let Render/Vercel auto-deploy from GitHub
5. **Keep It Simple**: Add complexity only when needed

## 🎓 Learning Resources

### Twilio
- Docs: https://www.twilio.com/docs/voice
- Pricing: https://www.twilio.com/voice/pricing

### ElevenLabs
- Docs: https://elevenlabs.io/docs
- Voice Lab: https://elevenlabs.io/voice-lab

### n8n (When Ready)
- Docs: https://docs.n8n.io
- Templates: https://n8n.io/workflows

## 🆘 Quick Help

### Logs
- **API Logs**: Render Dashboard → Your Service → Logs
- **Frontend Logs**: Vercel Dashboard → Your Project → Logs
- **Database**: Neon Dashboard → Monitoring

### Support
- **Twilio**: https://support.twilio.com
- **Render**: https://render.com/docs
- **Your Docs**: Check TESTING_GUIDE.md, DEPLOYMENT_GUIDE.md

## ✅ You're Done!

You now have a production-ready AI phone system that:
- ✅ Costs ~$50-70/month to run
- ✅ Scales automatically with usage
- ✅ Easy to maintain as one person
- ✅ Professional and reliable

**Next**: Test thoroughly, invite beta users, and start getting feedback!

---

**Setup Time**: ~30 minutes  
**Monthly Cost**: ~$50-70  
**Maintenance**: ~1 hour/week  
**Complexity**: LOW ⭐⭐☆☆☆
