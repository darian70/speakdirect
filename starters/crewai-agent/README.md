# CrewAI Agent Starter

A pragmatic starter for role-based multi-agent systems with CrewAI.

## Features
- Define Agents (roles/goals), Tasks, and a Crew
- Attach enterprise tools (e.g., GitHub) when available
- FastAPI server wrapper for triggering crew runs

## Quickstart
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=...
uvicorn main:app --reload
```
