# 🎮 SpeakDirect Control Center - Where to Manage Everything

**The "Brain of Operations"** - Your complete guide to managing phone agents and customers.

---

## 🏠 Main Dashboard (The Control Center)

**URL**: `https://app.speakdirect.xyz/dashboard`

This is your home base. From here you can:
- See stats: active agents, messages, minutes used
- Access all management sections
- Quick actions for common tasks

---

## 🤖 Where to Create & Manage AI Phone Agents

### **Agents Page** - The Agent Factory
**URL**: `https://app.speakdirect.xyz/agents`

This is where you **create different phone agents** for different purposes.

#### What You Can Do Here:

1. **Create New Agents**:
   ```
   Click "Create Agent" button
   → Name: "Auto Shop Support Agent"
   → Channel: Voice (requires Growth plan)
   → Initial Prompt: Basic instructions
   → Save
   ```

2. **Configure Each Agent**:
   ```
   Click on any agent → "Configure"
   
   You can customize:
   - System Prompt: How the AI should behave
   - Voice Settings: Which voice to use (ElevenLabs)
   - Temperature: How creative vs consistent (0.0-1.0)
   - Max Tokens: Response length
   - Status: Draft / Active / Paused
   ```

3. **Example Agents You Might Create**:
   - **"Job Update Agent"**: Calls customers when repairs are done
   - **"Appointment Booking Agent"**: Handles incoming calls for scheduling
   - **"Payment Reminder Agent"**: Follows up on unpaid invoices
   - **"Service Quote Agent"**: Gives estimates over the phone

**Each agent can have different personalities, voices, and purposes!**

---

## 👥 Where to Manage Customer Information & Trigger Calls

### **Technicians Page** - Customer Call Trigger
**URL**: `https://app.speakdirect.xyz/technicians`

This is where **technicians fill in customer details** and **trigger AI calls**.

#### How It Works:

```
1. Technician finishes work on a car
2. Goes to Technicians page
3. Fills out form:
   ├─ Customer Name: "John Smith"
   ├─ Customer Phone: "+15551234567"
   ├─ Vehicle: "2020 Honda Accord"
   ├─ Service Performed: "Oil change, tire rotation, brake inspection"
   ├─ Total Cost: "$145.00"
   ├─ Notes: "Recommended new air filter"
   └─ Requires Approval: ☑ (if you need customer to approve charges)

4. Click "Call Customer Now"
5. AI agent immediately calls the customer
6. Customer hears professional update about their vehicle
7. Call is logged with transcript
```

#### This Page is Perfect For:
- **Auto shops**: Calling customers when cars are ready
- **HVAC**: Updating homeowners on repair status
- **Plumbing**: Providing job estimates
- **Any service business**: Keeping customers informed

---

## 📞 Where to View All Calls & Transcripts

### **Calls Page** - Call History
**URL**: `https://app.speakdirect.xyz/calls`

See every call that's been made:
- Time and date
- Direction (inbound/outbound)
- From/to numbers
- Duration
- Status (completed, failed, no-answer)

**Click any call** to see:
- Full transcript of conversation
- Work order details (if it was from technician)
- Recording (if enabled)
- Call events timeline

---

## ☎️ Where to Manage Phone Numbers

### **Settings → Phone Numbers**
**URL**: `https://app.speakdirect.xyz/settings`

This is where you:
1. **Add Twilio phone numbers** to your account
2. **Assign numbers** to your organization
3. **Label numbers** (e.g., "Main Line", "Support Line")

#### Setup Process:
```
1. Buy number from Twilio ($1/month)
2. Configure webhook in Twilio Console
3. Add number in SpeakDirect Settings
4. Now inbound calls to that number route to your AI
```

---

## 🎯 The Complete Workflow - How Everything Connects

### **Scenario: Auto Shop Calling Customer**

```
┌─────────────────────────────────────────────────────────────┐
│  1. SETUP PHASE (One-time)                                   │
├─────────────────────────────────────────────────────────────┤
│  Dashboard → Agents → Create "Auto Shop Agent"               │
│    └─ Configure: System prompt, voice, behavior             │
│                                                              │
│  Dashboard → Settings → Add phone number                     │
│    └─ Connect Twilio number for inbound calls               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  2. DAILY OPERATIONS                                         │
├─────────────────────────────────────────────────────────────┤
│  Technician finishes job                                     │
│    ↓                                                         │
│  Dashboard → Technicians → Fill customer info                │
│    ↓                                                         │
│  Click "Call Customer Now"                                   │
│    ↓                                                         │
│  API receives request                                        │
│    ↓                                                         │
│  Twilio initiates call to customer                          │
│    ↓                                                         │
│  Customer answers phone                                      │
│    ↓                                                         │
│  AI Agent speaks (using ElevenLabs voice)                   │
│    ├─ "Hi John, this is calling from Main Street Auto"      │
│    ├─ "Your 2020 Honda Accord is ready for pickup"          │
│    ├─ "We completed oil change and tire rotation"           │
│    └─ "Total cost is $145. Can we charge your card?"        │
│    ↓                                                         │
│  Customer responds naturally                                 │
│    ↓                                                         │
│  AI continues conversation                                   │
│    ↓                                                         │
│  Call ends, logs saved                                       │
│    ↓                                                         │
│  Dashboard → Calls → View transcript                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 The "Brain" - Where Decisions are Made

### **API Server** (Backend)
**URL**: `https://speakdirect-api.onrender.com`

This is the actual "brain" that:
- Receives call requests from dashboard
- Talks to Twilio to make calls
- Stores customer data in database
- Manages AI agent logic
- Logs everything
- Handles webhooks

**You don't interact with this directly** - it runs in the background.

### **Database** (Memory)
**Service**: Neon PostgreSQL

Stores:
- All customer information
- Call records and transcripts
- Agent configurations
- Phone numbers
- User accounts

**You don't touch this directly** - the API manages it.

---

## 📋 Quick Reference - Where to Do What

| Task | Go To |
|------|-------|
| Create new AI agent | `app.speakdirect.xyz/agents` → "Create Agent" |
| Configure agent behavior | `agents` → Click agent → "Configure" |
| Call a customer about job | `app.speakdirect.xyz/technicians` → Fill form → "Call Customer Now" |
| View all calls | `app.speakdirect.xyz/calls` |
| See call transcript | `calls` → Click any call |
| Add phone number | `app.speakdirect.xyz/settings` → Phone Numbers |
| Check usage/billing | `app.speakdirect.xyz/billing` |
| Manage team members | `app.speakdirect.xyz/settings` → Team |
| See analytics | `app.speakdirect.xyz/analytics` |

---

## 🎨 Creating Agents for Different Customers

You can create **multiple specialized agents** for different purposes:

### Example Agent Setup:

#### **Agent 1: "Job Completion Caller"**
```
Purpose: Call customers when work is done
System Prompt:
"You are a professional auto shop representative calling to inform customers 
their vehicle is ready. Be friendly, clear, and provide cost breakdown. 
Ask if they approve charges and when they can pick up."

Voice: Professional male voice
Temperature: 0.6 (balanced)
Status: Active
```

#### **Agent 2: "Appointment Scheduler"**
```
Purpose: Handle incoming calls for bookings
System Prompt:
"You are a booking assistant for an auto shop. Help customers schedule 
appointments. Ask about vehicle make/model, service needed, and preferred 
dates. Check availability and confirm appointments."

Voice: Friendly female voice
Temperature: 0.7 (more conversational)
Status: Active
```

#### **Agent 3: "Estimate Provider"**
```
Purpose: Give quotes over the phone
System Prompt:
"You provide service estimates. Ask diagnostic questions about the vehicle 
issue, suggest services, and give price ranges. Be consultative and helpful."

Voice: Professional voice
Temperature: 0.5 (more factual)
Status: Active
```

**Each agent is independent** - they can have different voices, behaviors, and purposes!

---

## 🔄 Multi-Customer Management

### **For Multiple Auto Shops** (Multi-Tenant)

If you're serving multiple auto shop customers:

```
Tenant A: "Main Street Auto"
  ├─ Their own dashboard login
  ├─ Their own agents
  ├─ Their own phone numbers
  └─ Their own call history
  
Tenant B: "Quick Fix Garage"
  ├─ Separate dashboard login
  ├─ Different agents
  ├─ Different phone numbers
  └─ Separate call history
```

**Data is completely isolated** - each shop only sees their own stuff.

You manage all tenants from: `admin.speakdirect.xyz` (Admin Panel)

---

## 💡 Pro Tips for Managing Operations

### 1. **Start Simple**
- Create ONE agent first
- Test it thoroughly
- Then create specialized agents

### 2. **Use Descriptive Names**
- ✅ "Auto Shop Job Completion Agent"
- ❌ "Agent 1"

### 3. **Test Before Production**
- Use YOUR phone number first
- Make test calls to yourself
- Refine the prompts

### 4. **Monitor Daily**
- Check `Calls` page for success rates
- Read transcripts to improve prompts
- Adjust agent behavior based on feedback

### 5. **Keep Prompts Clear**
- Tell agent exactly what to say
- Include example phrases
- Specify when to ask questions

---

## 🆘 Common Questions

### Q: Can one agent handle multiple types of calls?
**A**: Yes, but it's better to create specialized agents. One for job updates, one for bookings, etc. More focused = better results.

### Q: How do I change what the AI says?
**A**: Go to `Agents` → Click agent → `Configure` → Edit "System Prompt"

### Q: Where do I see what customers said?
**A**: `Calls` page → Click any call → See full transcript

### Q: Can I have different voices for different agents?
**A**: Yes! Each agent can have its own voice from ElevenLabs.

### Q: What if a call fails?
**A**: Check `Calls` page for status. Common issues:
- Wrong phone number format
- Customer didn't answer
- Twilio not configured

---

## 🎯 Your Action Steps Right Now

1. **Deploy your platform** (follow ACTION_PLAN.md)
2. **Go to**: `app.speakdirect.xyz/agents`
3. **Create your first agent**:
   - Name: "Test Agent"
   - Simple prompt: "You are a friendly assistant"
4. **Go to**: `app.speakdirect.xyz/technicians`
5. **Fill in YOUR info** (use your own phone)
6. **Click** "Call Customer Now"
7. **Answer your phone** - hear your AI!
8. **Go to**: `app.speakdirect.xyz/calls`
9. **View the transcript** of your test call

**That's it! You now understand the entire system.** 🎉

---

## 📞 The Bottom Line

**The "brain" is split into two parts**:

1. **Frontend Dashboard** (`app.speakdirect.xyz`)
   - Where YOU control everything
   - Create agents, manage customers, view calls
   - This is your daily interface

2. **Backend API** (runs automatically)
   - Handles all the technical stuff
   - You don't interact with it directly
   - Just works in the background

**Everything you need is in the dashboard!** 🎮

---

**Quick Start**: Follow `ACTION_PLAN.md` to deploy, then come back here to understand how to use your new AI phone system!
