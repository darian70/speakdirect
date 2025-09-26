# LlamaIndex RAG Bot Starter

A production-oriented RAG skeleton with LlamaIndex. Add loaders, build the index, and serve via FastAPI.

## Quickstart

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=...
uvicorn app:app --reload
```

## Observability (Sentry + OpenTelemetry)

This starter optionally initializes Sentry error tracking and OpenTelemetry tracing for FastAPI when environment variables are set.

```bash
# Sentry (optional)
export SENTRY_DSN=your_sentry_dsn
export SENTRY_ENV=production
export SENTRY_TRACES_SAMPLE_RATE=0.1

# OpenTelemetry (optional)
export OTEL_EXPORTER_OTLP_ENDPOINT=https://otel-collector:4318
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <token>"
export OTEL_SERVICE_NAME=rag-bot-llamaindex
```

OpenTelemetry auto-instruments FastAPI and exports spans to the configured OTLP endpoint.
