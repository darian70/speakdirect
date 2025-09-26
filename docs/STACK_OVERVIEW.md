# Top-Tier Agent Engineering Stack

This repository includes website, SDKs, and now an Agents Lab with production-grade starters. Use this as a platform to build modern AI automations and agents across web, chat, SMS, voice, and back-office workflows.

## Core Pillars

- Orchestration: LangGraph, CrewAI, AutoGen, OpenAI Agents SDK
- Data & RAG: LlamaIndex, Haystack; connectors for GitHub/Notion/Google/etc.
- Voice & Realtime: LiveKit Agents, Pipecat, Vocode
- Durable Workflows: Temporal
- Evaluations: promptfoo, Ragas
- Observability: tracing, logging, cost meters; dashboards (Grafana/Tempo/Prom)

## What We Added

- `starters/` with production-grade templates:
  - `langgraph-agent/`
  - `crewai-agent/`
  - `voice-agent-livekit/`
  - `rag-bot-llamaindex/`
  - `temporal-workflows/`
- `ops/agents-lab/` docker-compose bringing up Flowise, Qdrant, Temporal, and Temporal UI.
- `evals/promptfoo.yaml` baseline eval config for agents/prompts.
- Playbook and resources docs in `docs/`.

## Usage

- Bring your keys as environment variables per starter README.
- Run Agents Lab (optional): see `ops/agents-lab/README.md`.
- Start with one starter, instrument evals, then scale up to multi-agent workflows and voice.

## Security & Compliance

- Prefer SSO/SAML and least-privilege keys.
- Data residency with your vector/DB selection; ensure encryption in transit/at rest.
  - Evaluate prompts and agent behavior regularly; track drift and apply guardrails.
