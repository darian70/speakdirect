# LangGraph Agent Starter

Production-ready skeleton for a stateful, tool-using agent built with LangGraph. Includes a minimal FastAPI wrapper and promptfoo eval scaffolding.

## Features

- Graph-based control with retries and human-in-the-loop hooks
- Typed tool functions (Pydantic) with validation
- FastAPI server stub and local runner
- Promptfoo eval template

## Quickstart

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=...
uvicorn server:app --reload
```

## Files

- `graph.py`: graph + agent logic
- `server.py`: FastAPI wrapper
- `requirements.txt`: deps
- `evals/promptfoo.yaml`: eval plan (copy `../../evals/promptfoo.yaml` or customize)

## Observability (Sentry + OpenTelemetry)

This starter will automatically initialize Sentry error tracking and OpenTelemetry tracing if environment variables are provided.

Set any of the following in your environment (see root `.env.example`):

```bash
# Sentry (optional)
export SENTRY_DSN=your_sentry_dsn
export SENTRY_ENV=production
export SENTRY_TRACES_SAMPLE_RATE=0.1

# OpenTelemetry (optional)
export OTEL_EXPORTER_OTLP_ENDPOINT=https://otel-collector:4318
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <token>"
export OTEL_SERVICE_NAME=langgraph-agent

Notes:

- Sentry is initialized with `traces_sample_rate` from `SENTRY_TRACES_SAMPLE_RATE` (default 0.1).
- OpenTelemetry auto-instruments FastAPI via `opentelemetry-instrumentation-fastapi` and exports spans to the OTLP endpoint if set.
