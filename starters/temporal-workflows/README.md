# Temporal Workflows Starter (Python)

Durable execution for back-office automations with retries, state persistence, and audit.

## Quickstart

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python workflows.py  # local demo
```

For full setup, run Temporal via docker-compose in `ops/agents-lab`.

## Observability (Sentry + OpenTelemetry)

This starter can initialize Sentry error tracking and export OpenTelemetry traces if configured via environment variables:

```bash
# Sentry (optional)
export SENTRY_DSN=your_sentry_dsn
export SENTRY_ENV=production
export SENTRY_TRACES_SAMPLE_RATE=0.05

# OpenTelemetry (optional)
export OTEL_EXPORTER_OTLP_ENDPOINT=https://otel-collector:4318
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer <token>"
export OTEL_SERVICE_NAME=temporal-workflows
```
