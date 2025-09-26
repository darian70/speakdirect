# LiveKit Voice Agent Starter

Realtime voice agent built on LiveKit Agents. Connects to a room/session, streams audio, and processes intents.

## Quickstart

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export LIVEKIT_API_KEY=...
export LIVEKIT_API_SECRET=...
python app.py
```

See: [LiveKit Agents](https://github.com/livekit/agents)

## Observability (Sentry + OpenTelemetry)

Optional Sentry error tracking and OpenTelemetry tracing are initialized when environment variables are provided.

```bash
# Sentry (optional)
export SENTRY_DSN=your_sentry_dsn
export SENTRY_ENV=production
export SENTRY_TRACES_SAMPLE_RATE=0.05

# OpenTelemetry (optional)
export OTEL_EXPORTER_OTLP_ENDPOINT=https://otel-collector:4318
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <token>"
export OTEL_SERVICE_NAME=voice-agent-livekit
```
