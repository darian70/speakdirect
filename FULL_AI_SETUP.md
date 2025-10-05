# 🚀 Full AI Phone System Setup - Production Ready

Complete setup for GPT-4 voice AI with calendar booking and CRM integration using **ElevenLabs Conversational AI**.

---

## Architecture

```
Customer Call → Twilio → ElevenLabs Conversational AI (GPT-4) → n8n → Calendar/CRM
                                ↓
                         Appointment Booked
                         Email Sent
                         CRM Updated
```

**Why ElevenLabs**: All-in-one voice + GPT-4, built for phone calls, simpler than OpenAI Realtime API.

---

## Part 1: ElevenLabs Conversational AI Setup (15 min)

### 1.1 Create ElevenLabs Account
1. Go to https://elevenlabs.io
2. Sign up for **Conversational AI** plan ($99/mo for unlimited)
3. Or start with free tier to test

### 1.2 Create Your AI Agent
1. Dashboard → **Conversational AI** → **Create Agent**
2. Configure:
   - **Name**: Auto Shop Receptionist
   - **Voice**: Choose a professional voice (e.g., "Rachel" or "Drew")
   - **Language Model**: GPT-4
   - **System Prompt**: (see below)

### 1.3 System Prompt for Auto Shop
```
You are a friendly and professional receptionist for Mike's Auto Shop.

BUSINESS INFO:
- Hours: Monday-Friday 8am-6pm, Saturday 9am-3pm, Closed Sunday
- Location: 123 Main Street, San Diego, CA 92101
- Phone: (619) 555-0123

SERVICES & PRICING:
- Oil Change: $49.99 (30 minutes)
- Brake Service: $199.99+ (2 hours)
- Tire Rotation: $29.99 (20 minutes)
- Engine Diagnostics: $89.99 (1 hour)

YOUR ROLE:
1. Greet customers warmly
2. Answer questions about services, pricing, hours
3. Schedule appointments - collect: name, phone, date, time, service
4. When appointment is confirmed, call the webhook to book it

APPOINTMENT BOOKING:
When you have all details (name, phone, date, time, service), say:
"Perfect! Let me book that for you right now..."
Then call the webhook with the appointment data.

WEBHOOK URL: https://your-n8n.com/webhook/appointment
```

### 1.4 Get Agent ID
- Copy your Agent ID from ElevenLabs dashboard
- Format: `agent_...`
- Save for next step

---

## Part 2: n8n Setup (20 min)

### 2.1 Deploy n8n
**Option A: Render (Easiest)**
```bash
# Use the ops/n8n/docker-compose.yml
```

Or use n8n Cloud: https://n8n.io/cloud

### 2.2 Import Workflow
1. Open n8n dashboard
2. Click "Import from File"
3. Upload: `ops/n8n/workflows/appointment-booking.json`
4. Activate workflow

### 2.3 Get Webhook URL
- Copy the webhook URL from n8n
- Format: `https://your-n8n.com/webhook/appointment`
- Add to API environment: `N8N_WEBHOOK_URL=...`

---

## Part 3: Calendar Integration (15 min)

### Option A: Google Calendar (Recommended)

1. **Enable Google Calendar API**:
   - Go to https://console.cloud.google.com
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Add authorized redirect: `https://your-n8n.com/rest/oauth2-credential/callback`

2. **Connect in n8n**:
   - Credentials → Add → Google Calendar OAuth2
   - Enter Client ID and Secret
   - Authorize

### Option B: Cal.com (Open Source Alternative)

1. Sign up at https://cal.com
2. Get API key from Settings → Developer
3. Add to n8n: Credentials → Cal.com API

---

## Part 4: CRM Integration (15 min)

### Option A: HubSpot (Free Tier Available)

1. Sign up at https://hubspot.com
2. Get API key: Settings → Integrations → API Key
3. Add to n8n: Credentials → HubSpot API

### Option B: Pipedrive / Salesforce / Custom

n8n supports 400+ integrations. Choose what you use.

---

## Part 5: Update AI to Book Appointments

The AI will now:
1. **Collect info** during call
2. **Call n8n webhook** with appointment data
3. **n8n automatically**:
   - Creates calendar event
   - Adds to CRM
   - Sends confirmation email

### Example Flow:
```
Customer: "I need an oil change"
AI: "I can help! What day works for you?"
Customer: "Tomorrow at 2pm"
AI: "Perfect! Can I get your name and phone number?"
Customer: "John Smith, 555-1234"
AI: "Great! I'm booking that now..."
   → Calls n8n webhook
   → Calendar updated
   → CRM updated
   → Email sent
AI: "All set! You'll receive a confirmation email shortly."
```

---

## Part 6: Testing

### Test the Full Flow:
1. Call your Twilio number
2. Say: "I need an appointment"
3. Provide: Day, time, name, phone
4. Check:
   - ✅ Calendar event created
   - ✅ CRM contact added
   - ✅ Confirmation email sent

---

## Environment Variables Summary

### API (Render)
```bash
OPENAI_API_KEY=sk-proj-...
VOICE_BRIDGE_WSS_URL=wss://speakdirect-voice-bridge.onrender.com/stream
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/appointment
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_CALLER_ID=+1877...
DATABASE_URL=postgresql://...
```

### Voice Bridge (Render)
```bash
OPENAI_API_KEY=sk-proj-...
PORT=8082
```

### n8n
- Google Calendar OAuth credentials
- HubSpot API key
- SMTP credentials (for emails)

---

## Cost Estimate

### Monthly Costs (Moderate Usage):
- **OpenAI Realtime API**: ~$50-200 (depends on call volume)
- **Twilio**: ~$1/phone number + $0.01/min
- **n8n Cloud**: $20/month (or self-host free)
- **HubSpot**: Free tier available
- **Google Calendar**: Free
- **Render**: $7/month per service

**Total**: ~$100-300/month for full production system

---

## Next Steps

1. ✅ Get OpenAI API key
2. ✅ Deploy voice bridge
3. ✅ Set up n8n
4. ✅ Connect calendar
5. ✅ Connect CRM
6. ✅ Test full flow
7. ✅ Customize AI prompts for your business

---

## Support & Customization

The AI can be customized to:
- Handle multiple service types
- Check real-time availability
- Send SMS reminders
- Integrate with payment systems
- Transfer to human if needed
- Handle multiple languages

**Your AI phone system is now enterprise-grade!** 🎉
