// Minimal voice-bridge: accepts Twilio Media Streams over WebSocket and relays to ElevenLabs Realtime (stubbed)
// NOTE: For production, replace stubs with full-duplex streaming to ElevenLabs and backchannel events.

import WebSocket, { WebSocketServer } from 'ws'

const PORT = process.env.PORT || 8080

// ElevenLabs configuration (set in environment)
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || ''
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID || ''
// Realtime endpoint placeholder; check vendor docs for the correct URL
const ELEVENLABS_REALTIME_URL = process.env.ELEVENLABS_REALTIME_URL || 'wss://api.elevenlabs.io/v1/stream'

const wss = new WebSocketServer({ port: PORT, path: '/stream' })

console.log(`[voice-bridge] WebSocket server listening on :${PORT}/stream`)

// ---- Audio utils: μ-law decode (8kHz) → PCM16 and naive upsample to 16kHz ----

function mulawByteToLinearSample(u8) {
  // Decode a single G.711 μ-law byte to 16-bit PCM sample
  // Ref: ITU-T G.711 μ-law decoding (typical implementation)
  u8 = ~u8 & 0xFF
  const sign = (u8 & 0x80) ? -1 : 1
  const exponent = (u8 >> 4) & 0x07
  const mantissa = u8 & 0x0F
  let sample = ((mantissa << 3) + 0x84) << (exponent + 3)
  sample = sign * (sample - 0x84)
  // Clamp to int16
  if (sample > 32767) sample = 32767
  if (sample < -32768) sample = -32768
  return sample
}

function decodeMuLawBase64ToPCM16(base64Str) {
  const buf = Buffer.from(base64Str, 'base64')
  const out = new Int16Array(buf.length)
  for (let i = 0; i < buf.length; i++) {
    out[i] = mulawByteToLinearSample(buf[i])
  }
  return out
}

function upsample8kTo16k(pcm8k) {
  // Naive 2x upsampling by sample duplication (fast, acceptable for prototype)
  const out = new Int16Array(pcm8k.length * 2)
  let j = 0
  for (let i = 0; i < pcm8k.length; i++) {
    const s = pcm8k[i]
    out[j++] = s
    out[j++] = s
  }
  return out
}

function pcm16ToBase64(pcm16) {
  const buf = Buffer.allocUnsafe(pcm16.length * 2)
  for (let i = 0; i < pcm16.length; i++) {
    buf.writeInt16LE(pcm16[i], i * 2)
  }
  return buf.toString('base64')
}

// --- μ-law encode helpers (for outbound to Twilio) ---
function linearSampleToMuLaw(sample) {
  // Clamp to int16
  if (sample > 32767) sample = 32767
  if (sample < -32768) sample = -32768
  const sign = (sample < 0) ? 0x80 : 0x00
  if (sample < 0) sample = -sample
  // μ-law bias
  sample = sample + 0x84
  if (sample > 0x7FFF) sample = 0x7FFF
  let exponent = 7
  for (let expMask = 0x4000; (sample & expMask) === 0 && exponent > 0; expMask >>= 1) {
    exponent--
  }
  const mantissa = (sample >> ((exponent === 0) ? 4 : (exponent + 3))) & 0x0F
  const mu = ~(sign | (exponent << 4) | mantissa) & 0xFF
  return mu
}

function encodePCM16ToMuLawBase64(pcm16) {
  const out = Buffer.allocUnsafe(pcm16.length)
  for (let i = 0; i < pcm16.length; i++) {
    out[i] = linearSampleToMuLaw(pcm16[i])
  }
  return out.toString('base64')
}

function generateBeepPCM16(durationMs = 400, freqHz = 440, sampleRate = 8000, amplitude = 8000) {
  const totalSamples = Math.floor(sampleRate * (durationMs / 1000))
  const out = new Int16Array(totalSamples)
  const twoPiF = 2 * Math.PI * freqHz
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate
    out[i] = Math.floor(amplitude * Math.sin(twoPiF * t))
  }
  return out
}

function chunkBase64MuLawFromPCM16(pcm16, frameMs = 20, sampleRate = 8000) {
  const samplesPerFrame = Math.floor(sampleRate * (frameMs / 1000)) // 160 samples @ 8k for 20ms
  const frames = []
  for (let i = 0; i < pcm16.length; i += samplesPerFrame) {
    const slice = pcm16.subarray(i, Math.min(i + samplesPerFrame, pcm16.length))
    const b64 = encodePCM16ToMuLawBase64(slice)
    frames.push(b64)
  }
  return frames
}

// Prepare vendor-specific frame. Adjust to match ElevenLabs realtime protocol if needed.
function makeElevenLabsAudioFrame(pcm16_16k) {
  // Many realtime APIs expect JSON frames with base64-encoded PCM16 and metadata
  return JSON.stringify({
    type: 'audio',
    encoding: 'pcm16',
    sample_rate_hz: 16000,
    audio_base64: pcm16ToBase64(pcm16_16k),
    voice_id: ELEVENLABS_VOICE_ID || undefined,
    agent_id: ELEVENLABS_AGENT_ID || undefined,
  })
}

function connectElevenLabs() {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_REALTIME_URL) {
    console.warn('[voice-bridge] ELEVENLABS_API_KEY or ELEVENLABS_REALTIME_URL not set; running in logging-only mode')
    return { ws: null, ready: false }
  }
  try {
    const ws = new WebSocket(ELEVENLABS_REALTIME_URL, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'User-Agent': 'voice-bridge/0.1',
      },
    })
    return { ws, ready: false }
  } catch (e) {
    console.error('[voice-bridge] failed to create ElevenLabs websocket', e)
    return { ws: null, ready: false }
  }
}

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const shopId = url.searchParams.get('shop_id')
  console.log(`[voice-bridge] connection from shop_id=${shopId}`)

  // Per-connection ElevenLabs session
  let el = { ws: null, ready: false }
  let streamSid = null
  let outboundTimer = null

  // Twilio sends JSON messages with event types: start, media, mark, stop
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString())
      if (data.event === 'start') {
        console.log('[voice-bridge] start stream', data.start?.streamSid)
        streamSid = data.start?.streamSid || null
        // Open ElevenLabs realtime connection on start
        el = connectElevenLabs()
        if (el.ws) {
          el.ws.on('open', () => {
            el.ready = true
            console.log('[voice-bridge] connected to ElevenLabs realtime')
            // Send a minimal session/init message (adjust to vendor spec as needed)
            try {
              const init = {
                type: 'session_init',
                encoding: 'pcm16',
                sample_rate_hz: 16000,
                voice_id: ELEVENLABS_VOICE_ID || undefined,
                agent_id: ELEVENLABS_AGENT_ID || undefined,
              }
              el.ws.send(JSON.stringify(init))
            } catch (_) {}
          })
          el.ws.on('message', (m) => {
            // Vendor responses (e.g., transcript, agent state). Log for now.
            try {
              const txt = m.toString()
              console.log('[voice-bridge] ElevenLabs message:', txt.slice(0, 200))
            } catch (_) {
              // binary/unknown
            }
          })
          el.ws.on('error', (err) => {
            console.warn('[voice-bridge] ElevenLabs error', err?.message || err)
          })
          el.ws.on('close', () => {
            console.log('[voice-bridge] ElevenLabs connection closed')
            el.ready = false
            el.ws = null
          })
        }
        // Send a short beep back to Twilio to prove outbound path works (no external keys required)
        try {
          if (streamSid && !outboundTimer) {
            const pcmBeep = generateBeepPCM16(600, 660, 8000, 7000)
            const frames = chunkBase64MuLawFromPCM16(pcmBeep, 20, 8000)
            let idx = 0
            outboundTimer = setInterval(() => {
              if (idx >= frames.length) {
                clearInterval(outboundTimer)
                outboundTimer = null
                return
              }
              const frameB64 = frames[idx++]
              // Basic backpressure guard
              if (ws.readyState === WebSocket.OPEN && ws.bufferedAmount < 1_000_000) {
                const outbound = {
                  event: 'media',
                  streamSid: streamSid,
                  track: 'outbound',
                  media: { payload: frameB64 },
                }
                try { ws.send(JSON.stringify(outbound)) } catch (_) {}
              }
            }, 20)
          }
        } catch (_) {}
      } else if (data.event === 'media') {
        // data.media.payload is base64-encoded mulaw or opus depending on config (mulaw by default)
        // Here we would forward audio to ElevenLabs Realtime via its WS API
        try {
          const pcm8k = decodeMuLawBase64ToPCM16(data.media?.payload || '')
          const pcm16k = upsample8kTo16k(pcm8k)
          if (el.ws && el.ready) {
            const frame = makeElevenLabsAudioFrame(pcm16k)
            el.ws.send(frame)
          }
        } catch (e) {
          // ignore frame errors
        }
      } else if (data.event === 'mark') {
        // marker from Twilio, ignore
      } else if (data.event === 'stop') {
        console.log('[voice-bridge] stop stream', data.stop?.streamSid)
        streamSid = null
        if (outboundTimer) { try { clearInterval(outboundTimer) } catch (_) {} outboundTimer = null }
        if (el.ws) {
          try { el.ws.close(1000) } catch (_) {}
          el.ws = null
        }
      }
    } catch (e) {
      // Some Twilio control frames may be plain text; ignore
    }
  })

  ws.on('close', () => {
    console.log('[voice-bridge] client disconnected')
    streamSid = null
    if (outboundTimer) { try { clearInterval(outboundTimer) } catch (_) {} outboundTimer = null }
    if (el.ws) {
      try { el.ws.close(1000) } catch (_) {}
      el.ws = null
    }
  })
})
