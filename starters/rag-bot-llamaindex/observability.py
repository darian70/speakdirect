import os
from typing import Optional

# Optional imports
try:
    import sentry_sdk  # type: ignore
except Exception:  # pragma: no cover
    sentry_sdk = None  # type: ignore

try:
    from opentelemetry import trace  # type: ignore
    from opentelemetry.sdk.resources import Resource  # type: ignore
    from opentelemetry.sdk.trace import TracerProvider  # type: ignore
    from opentelemetry.sdk.trace.export import BatchSpanProcessor  # type: ignore
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter  # type: ignore
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor  # type: ignore
except Exception:  # pragma: no cover
    trace = None  # type: ignore
    Resource = None  # type: ignore
    TracerProvider = None  # type: ignore
    BatchSpanProcessor = None  # type: ignore
    OTLPSpanExporter = None  # type: ignore
    FastAPIInstrumentor = None  # type: ignore


def init_observability(service_name: str, fastapi_app: Optional[object] = None) -> None:
    dsn = os.getenv("SENTRY_DSN")
    if dsn and sentry_sdk:
        try:
            traces_rate = float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1"))
        except ValueError:
            traces_rate = 0.1
        env = os.getenv("SENTRY_ENV") or os.getenv("NODE_ENV") or "production"
        try:
            sentry_sdk.init(dsn=dsn, traces_sample_rate=traces_rate, environment=env)
        except Exception:
            pass

    otlp = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
    if otlp and trace and TracerProvider and Resource and BatchSpanProcessor and OTLPSpanExporter:
        try:
            resource = Resource.create({"service.name": os.getenv("OTEL_SERVICE_NAME", service_name)})
            provider = TracerProvider(resource=resource)
            headers = os.getenv("OTEL_EXPORTER_OTLP_HEADERS")
            exporter = OTLPSpanExporter(endpoint=otlp, headers=dict([h.split("=", 1) for h in headers.split(",")]) if headers else None)
            processor = BatchSpanProcessor(exporter)
            provider.add_span_processor(processor)
            trace.set_tracer_provider(provider)
        except Exception:
            pass

    if fastapi_app is not None and FastAPIInstrumentor:
        try:
            FastAPIInstrumentor.instrument_app(fastapi_app)  # type: ignore[arg-type]
        except Exception:
            pass
