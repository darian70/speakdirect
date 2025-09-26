# @omniagents/agents-hub

FastAPI service (Python) for agent workflows (LangGraph/CrewAI-ready).

## Dev
```bash
uvicorn app.main:app --reload --port 8000 --app-dir apps/agents-hub
```

## Endpoints
- GET /health → { ok: True }
- POST /leads → echoes back payload (placeholder)

## Next
- Add LangGraph orchestration and tool runtimes
- Add persistence and event streaming
