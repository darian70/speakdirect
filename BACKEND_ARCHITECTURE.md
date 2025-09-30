# 🏗️ SpeakDirect Backend Architecture - What Powers Everything

**Question**: "What is the backend powering all these tools? Are we using ElevenLabs to power the phone agent?"

**Answer**: Your system uses **multiple services working together**. Here's exactly what does what:

---

## 🎯 The Complete Stack - What Powers Your AI Phone System

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR COMPLETE SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Frontend (User Interface)                                       │
│  ├─ Next.js 14 (React)                                          │
│  ├─ Hosted on: Vercel                                           │
│  └─ URL: app.speakdirect.xyz                                    │
│                                                                  │
│  Backend API (Brain)                                             │
│  ├─ Node.js + Express                                           │
│  ├─ Hosted on: Render                                           │
│  └─ URL: speakdirect-api.onrender.com                          │
│                                                                  │
│  Database (Memory)                                               │
│  ├─ PostgreSQL                                                  │
│  ├─ Hosted on: Neon (or Supabase)                              │
│  └─ Stores: calls, agents, customers, transcripts               │
│                                                                  │
│  Voice Calling (Phone System)                                    │
│  ├─ Twilio Programmable Voice                                   │
│  ├─ Makes/receives actual phone calls                           │
│  └─ Cost: ~$0.013/minute                                        │
│                                                                  │
│  AI Voice (The Voice You Hear)                                   │
│  ├─ ElevenLabs (text-to-speech + conversation)                 │
│  ├─ Creates natural AI voice                                    │
│  └─ Cost: $5-22/month                                           │
│                                                                  │
│  Authentication (User Login)                                     │
│  ├─ Clerk                                                       │
│  ├─ Handles sign up, login, organizations                       │
│  └─ Cost: Free tier available                                   │
│                                                                  │
│  Billing (Payments)                                              │
│  ├─ Stripe                                                      │
│  ├─ Subscription management                                     │
│  └─ Cost: 2.9% + $0.30 per transaction                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📞 How a Phone Call Actually Works (Step-by-Step)

### **When You Click "Call Customer Now"**

```
1. USER ACTION
   └─ Technician fills form on app.speakdirect.xyz/technicians
   └─ Clicks "Call Customer Now"

2. FRONTEND (Next.js)
   └─ Sends request to your API with customer info
   └─ POST to: speakdirect-api.onrender.com/calls/initiate

3. YOUR API (Node/Express)
   └─ Receives request
   └─ Stores call record in PostgreSQL database
   └─ Tells Twilio to make the call

4. TWILIO (Phone System)
   └─ Actually dials the customer's phone number
   └─ Connects the call
   └─ When customer answers, requests instructions from your API
   └─ GET: speakdirect-api.onrender.com/twilio/voice/inbound

5. YOUR API (Orchestration)
   └─ Generates TwiML (Twilio's instruction language)
   └─ Tells Twilio to connect to ElevenLabs for AI voice
   └─ OR uses Twilio's built-in TTS for simpler calls

6. ELEVENLABS (AI Voice - Optional)
   └─ Powers the conversational AI voice
   └─ Listens to customer speech
   └─ Responds naturally with AI-generated voice
   └─ Handles conversation flow

7. CONVERSATION
   └─ Customer hears natural AI voice
   └─ AI reads work order details
   └─ Customer can ask questions
   └─ AI responds intelligently

8. CALL ENDS
   └─ Twilio sends webhook to your API
   └─ POST: speakdirect-api.onrender.com/twilio/voice/status
   └─ API saves transcript to database
   └─ Updates call status

9. VIEW RESULTS
   └─ User goes to app.speakdirect.xyz/calls
   └─ Sees call details and transcript
   └─ Frontend fetches from your API
```

---

## 🎤 Voice Options - What Actually Speaks

You have **two options** for the voice customers hear:

### **Option A: Twilio's Built-in TTS** (Simpler, Cheaper)

```
How it works:
├─ Twilio has basic text-to-speech
├─ You send text, Twilio speaks it
├─ Pros: Simple, cheap, no extra service
├─ Cons: Robotic voice, no conversation
└─ Cost: Included with Twilio

Use case: Simple notifications
"Your car is ready. Please call us back."
```

### **Option B: ElevenLabs AI** (Natural, Conversational) ⭐ **RECOMMENDED**

```
How it works:
├─ ElevenLabs provides ultra-realistic AI voices
├─ Can have full conversations
├─ Understands context and responds naturally
├─ Pros: Sounds human, conversational
├─ Cons: Extra cost, more setup
└─ Cost: $5-22/month + per-character

Use case: Full conversations
Customer: "How much is the total?"
AI: "The total comes to $145. This includes the 
     oil change at $35 and tire rotation at $75, 
     plus tax. Would you like to approve this charge?"
```

---

## 🧩 How the Services Work Together

### **Current Setup (What You Have Built)**

```
┌─────────────────────────────────────────────────────────────┐
│  TECHNICIAN WORKFLOW                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Technician] → [Next.js Web App] → [Your API] → [Twilio]  │
│                                           ↓                  │
│                                      [PostgreSQL]            │
│                                           ↓                  │
│  [Customer Phone] ← [Twilio] ← [Your API with TwiML]       │
│                                           ↓                  │
│                                    [ElevenLabs] (optional)   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### **Who Does What**

| Service | Role | What It Powers |
|---------|------|----------------|
| **Your API** | Orchestrator | Connects everything, business logic |
| **Twilio** | Phone Network | Makes actual phone calls |
| **ElevenLabs** | AI Voice | Natural voice + conversation (optional) |
| **PostgreSQL** | Database | Stores everything |
| **Next.js** | Interface | What you see/interact with |
| **Clerk** | Security | Login/signup |
| **Stripe** | Money | Billing customers |

---

## 💰 What Each Service Costs

### **Required Services** (Must Have)

```
Twilio (Phone Network)
├─ Phone Number: $1/month
├─ Outbound Calls: ~$0.013/minute
├─ Inbound Calls: ~$0.0085/minute
└─ Example: 100 calls × 5min = $6.50/month

Your API (Render)
├─ Starter Plan: $7/month
└─ Runs 24/7, handles all logic

Database (Neon)
├─ Free: 0.5GB storage
├─ Scale: $19/month for 10GB
└─ Grow as you need

Frontend (Vercel)
├─ Free: Hobby plan
└─ Unlimited bandwidth
```

### **Optional Services** (Nice to Have)

```
ElevenLabs (AI Voice)
├─ Starter: $5/month (30k characters)
├─ Creator: $22/month (100k characters)
└─ ~150 characters per 1min of speech
└─ Example: 100 calls × 5min × 150 = 75k chars = $22/month

Clerk (Auth - if you exceed free tier)
├─ Free: 10k monthly active users
└─ Pro: $25/month for more

Stripe (Billing)
├─ Free to use
└─ 2.9% + $0.30 per payment
```

---

## 🎯 Your Current Architecture

### **What's Running Right Now**

```
✅ Frontend: Next.js app (ready to deploy)
✅ Backend API: Node/Express (ready to deploy)
✅ Database: Prisma schema ready
✅ Twilio Integration: Code complete
✅ ElevenLabs Integration: Code complete
✅ Call Logging: Working
✅ Work Orders: Working
✅ Transcripts: Working
```

### **What Needs Setup** (Just Configuration)

```
⏳ Deploy API to Render (10 min)
⏳ Deploy Frontend to Vercel (10 min)
⏳ Create Neon Database (5 min)
⏳ Add Twilio Keys (5 min)
⏳ Add ElevenLabs Key (5 min - optional)
⏳ Configure Clerk (already have account)
```

---

## 🤖 AI Voice Deep Dive - How It Actually Works

### **Without ElevenLabs** (Basic Mode)

```python
# Your API generates simple TwiML
<Response>
  <Say voice="Polly.Amy">
    Hello, this is calling from Main Street Auto.
    Your 2020 Honda Accord is ready for pickup.
    The total cost is $145.
  </Say>
</Response>

Result: Robotic text-to-speech, no conversation
```

### **With ElevenLabs** (Advanced Mode) ⭐

```python
# Your API tells Twilio to connect to ElevenLabs
<Response>
  <Connect>
    <Stream url="wss://api.elevenlabs.io/v1/convai/conversation">
      <Parameter name="agent_id" value="your_agent_id"/>
    </Stream>
  </Connect>
</Response>

Result: 
- Natural conversation
- AI understands context
- Can answer questions
- Feels human
```

**ElevenLabs provides**:
- Speech-to-Text (hears customer)
- AI Logic (understands context)
- Text-to-Speech (responds naturally)
- All in real-time

---

## 🔄 Data Flow - What Happens to Information

### **When a Call is Made**

```
1. Technician Input
   ├─ Customer: "John Smith"
   ├─ Phone: "+15551234567"
   ├─ Vehicle: "2020 Honda Accord"
   └─ Cost: "$145"
   
2. Stored in PostgreSQL
   └─ Table: calls
   └─ Fields: from, to, status, meta (work order)
   
3. Sent to Twilio
   └─ Twilio makes the call
   
4. Sent to ElevenLabs (if using)
   └─ ElevenLabs uses info for conversation
   
5. Transcript Saved
   └─ Back to PostgreSQL
   └─ Table: transcripts
   
6. Displayed to User
   └─ Frontend fetches from API
   └─ Shows in app.speakdirect.xyz/calls
```

---

## 🎮 Control Flow - What You Control vs What Services Handle

### **You Control (Your Code)**

```
✅ What agents say (system prompts)
✅ When calls are triggered
✅ What customer data is collected
✅ How calls are logged
✅ UI/UX of dashboard
✅ Business logic
✅ Work order workflow
```

### **Services Handle (External)**

```
🔧 Twilio: Physical phone network, routing
🔧 ElevenLabs: Voice AI, speech processing
🔧 Neon: Database hosting, backups
🔧 Vercel: Frontend hosting, CDN
🔧 Render: API hosting, auto-scaling
🔧 Clerk: User authentication, security
```

---

## 🚀 Deployment Flow - How It All Gets Online

### **Step 1: Database (Neon)**
```bash
Create database → Get connection string
└─ This stores all your data
```

### **Step 2: API (Render)**
```bash
Connect GitHub → Deploy API → Add env vars
├─ DATABASE_URL (from Neon)
├─ TWILIO_ACCOUNT_SID (from Twilio)
├─ ELEVENLABS_API_KEY (from ElevenLabs)
└─ Now API can orchestrate everything
```

### **Step 3: Frontend (Vercel)**
```bash
Import project → Deploy → Add env vars
├─ API_BASE_URL (your Render API)
├─ CLERK keys (from Clerk)
└─ Now users can access dashboard
```

### **Step 4: Twilio**
```bash
Buy number → Configure webhooks → Point to your API
└─ Now calls route to your system
```

### **Step 5: ElevenLabs** (Optional)
```bash
Get API key → Add to Render env vars
└─ Now you have natural AI voice
```

---

## 💡 Key Takeaways

### **The Backend is NOT one thing** - it's a combination:

1. **Your Code** (API + Frontend)
   - The "brain" that orchestrates everything
   - Your business logic
   - Hosted on Render + Vercel

2. **Twilio**
   - The "phone network"
   - Makes/receives actual calls
   - You pay per minute

3. **ElevenLabs** (Optional)
   - The "AI voice"
   - Makes it sound human
   - Enables conversations
   - You pay per character

4. **PostgreSQL**
   - The "memory"
   - Stores everything
   - Hosted on Neon

### **They Work Together**:
```
Your API = Conductor
Twilio = Phone
ElevenLabs = Voice
PostgreSQL = Memory
Next.js = Interface
```

---

## 🎯 What You Should Use (Recommendations)

### **Start Simple** (Week 1)
```
✅ Twilio (phone calls)
✅ Twilio TTS (basic voice)
⏸️ Skip ElevenLabs for now
Cost: ~$15/month
```

### **Go Advanced** (Week 2-3)
```
✅ Twilio (phone calls)
✅ ElevenLabs (natural AI voice)
✅ Conversational AI
Cost: ~$50/month
```

### **Scale Up** (Month 2+)
```
✅ Everything above
✅ Upgrade Render for performance
✅ More Twilio numbers
✅ Higher ElevenLabs tier
Cost: ~$100-400/month
```

---

## 🔍 Testing Each Component

### **Test Your API**
```bash
curl https://speakdirect-api.onrender.com/health
# Should return: {"ok": true}
```

### **Test Twilio**
```bash
# Make a test call from Twilio Console
# Should receive call on your phone
```

### **Test ElevenLabs**
```bash
# Go to ElevenLabs dashboard
# Test voice synthesis
# Should hear AI voice
```

### **Test Complete System**
```bash
# Go to app.speakdirect.xyz/technicians
# Fill in YOUR phone number
# Click "Call Customer Now"
# Answer your phone!
```

---

## ✅ Summary

**Backend Architecture**:
- **Your API**: Orchestrates everything (Render)
- **Twilio**: Physical phone calls (~$0.013/min)
- **ElevenLabs**: Natural AI voice ($5-22/mo, optional)
- **PostgreSQL**: Stores data (Neon, free-$19/mo)
- **Next.js**: User interface (Vercel, free)

**Total Cost**: $20-70/month depending on usage

**ElevenLabs is optional but recommended** for natural conversations. Without it, you get basic text-to-speech from Twilio (robotic but functional).

**Everything is modular** - you can add/remove services as needed!

---

**Next**: Follow ACTION_PLAN.md to deploy all these services and connect them! 🚀
