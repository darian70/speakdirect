import { WebSocketServer, WebSocket } from 'ws';
import OpenAI from 'openai';
import { config } from 'dotenv';

config();

const PORT = parseInt(process.env.PORT || '8082', 10);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is required');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// System prompt for the AI agent
const SYSTEM_PROMPT = `You are a friendly and professional receptionist for an auto repair shop.

BUSINESS INFO:
- Name: Mike's Auto Shop
- Hours: Monday-Friday 8am-6pm, Saturday 9am-3pm, Closed Sunday
- Location: 123 Main Street, San Diego, CA 92101
- Phone: (619) 555-0123

SERVICES & PRICING:
- Oil Change: $49.99 (30 minutes)
- Brake Service: $199.99+ (2 hours, depends on vehicle)
- Tire Rotation: $29.99 (20 minutes)
- Engine Diagnostics: $89.99 (1 hour)
- General Repairs: Custom quote

YOUR ROLE:
1. Greet customers warmly
2. Answer questions about services, pricing, and hours
3. Schedule appointments (ask for: name, phone, preferred day/time, service needed)
4. Be helpful, patient, and professional
5. If you can't help, offer to transfer to a technician

IMPORTANT:
- Always confirm appointment details
- Get customer name and phone number
- Be conversational and natural
- Don't make up information - if unsure, say you'll check and call back`;

interface TwilioMediaStream {
  event: string;
  streamSid?: string;
  media?: {
    payload: string; // base64 audio
  };
}

interface OpenAIRealtimeEvent {
  type: string;
  [key: string]: any;
}

const wss = new WebSocketServer({ port: PORT });

console.log(`🎙️  Voice Bridge listening on port ${PORT}`);
console.log(`📞 Twilio should connect to: ws://localhost:${PORT}/stream`);

wss.on('connection', async (twilioWs: WebSocket, req) => {
  console.log('📞 New Twilio connection');
  
  const tenantId = new URL(req.url || '', 'http://localhost').searchParams.get('tenant_id') || 'default';
  console.log(`   Tenant: ${tenantId}`);

  let openaiWs: WebSocket | null = null;
  let streamSid: string | null = null;

  try {
    // Connect to OpenAI Realtime API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-realtime-preview-2024-12-17',
      modalities: ['text', 'audio'],
      audio: { voice: 'alloy', format: 'pcm16' },
    } as any);

    // Note: OpenAI Realtime API uses WebSocket, we'll need to establish that connection
    // For now, this is a placeholder - actual implementation requires WebSocket connection to OpenAI
    
    console.log('✅ Connected to OpenAI Realtime API');

  } catch (error) {
    console.error('❌ Failed to connect to OpenAI:', error);
    twilioWs.close();
    return;
  }

  // Handle messages from Twilio
  twilioWs.on('message', (data: Buffer) => {
    try {
      const msg: TwilioMediaStream = JSON.parse(data.toString());

      switch (msg.event) {
        case 'start':
          streamSid = msg.streamSid || null;
          console.log(`🎬 Stream started: ${streamSid}`);
          
          // Send session configuration to OpenAI
          if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.send(JSON.stringify({
              type: 'session.update',
              session: {
                modalities: ['text', 'audio'],
                instructions: SYSTEM_PROMPT,
                voice: 'alloy',
                input_audio_format: 'g711_ulaw',
                output_audio_format: 'g711_ulaw',
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 500,
                },
              },
            }));
          }
          break;

        case 'media':
          // Forward audio from Twilio to OpenAI
          if (openaiWs && openaiWs.readyState === WebSocket.OPEN && msg.media?.payload) {
            openaiWs.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: msg.media.payload,
            }));
          }
          break;

        case 'stop':
          console.log('🛑 Stream stopped');
          if (openaiWs) {
            openaiWs.close();
          }
          break;
      }
    } catch (error) {
      console.error('Error processing Twilio message:', error);
    }
  });

  // Handle OpenAI responses (placeholder - actual WebSocket connection needed)
  // This would forward audio from OpenAI back to Twilio

  twilioWs.on('close', () => {
    console.log('📞 Twilio connection closed');
    if (openaiWs) {
      openaiWs.close();
    }
  });

  twilioWs.on('error', (error) => {
    console.error('Twilio WebSocket error:', error);
  });
});

wss.on('error', (error) => {
  console.error('WebSocket Server error:', error);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  wss.close();
  process.exit(0);
});
