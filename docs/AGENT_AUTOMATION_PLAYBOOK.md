# Agent Automation Playbook

A practical, repeatable playbook for scoping, designing, implementing, and operating AI agents and automations for clients.

## 1) Discovery Checklist
- Business objective and constraints
- Primary users and channels (web, SMS, phone, email, Slack/Teams)
- Data sources and access (docs, DBs, APIs, CRMs, helpdesks)
- Compliance and security (PII/PHI, data residency, SSO, audit)
- Success metrics and SLOs (CSAT, FRT, deflection, lead conversion, AHT)
- Guardrails and human-in-the-loop requirements
- Existing tooling and vendor preferences (LLM, vector DB, telephony)
- Budget and scale (traffic, concurrent sessions, retention policy)

## 2) Success Metrics & SLOs
- Quality: task success rate, factual accuracy, groundedness
- Support: FRT/ART, deflection rate, escalation rate, CSAT
- Sales: lead qualification rate, pipeline generated, conversion rate
- Reliability: uptime, error budget, latency P95
- Cost: $/interaction, $/qualified lead, $/ticket

## 3) Solution Patterns (reference architectures)
- RAG Knowledge Bot
  - LLM + retrieval pipeline over client docs, with citations and feedback loop
  - Best for support deflection, onboarding, policy Q&A
- Voice/Telephony Agent
  - Real-time ASR/TTS + LLM + telephony integration; IVR, inbound support, outbound
  - Best for scheduling, payments, status checks, call summaries
- Multi-Agent Workflow
  - Coordinated specialists (researcher, planner, executor) with tools and memory
  - Best for complex automations and cross-system orchestration
- Case Management & Ticketing
  - Triage + summarization + suggestion macros + auto-resolution workflows
  - Best for L1 deflection, routing, and agent copilot productivity
- Batch/Async Automation
  - Scheduled or event-driven jobs, robust retries, audit logs, notifications
  - Best for back-office ops, enrichment, synchronization

## 4) Tool Selection Matrix (quick picks)
- Orchestration: LangGraph, CrewAI, AutoGen
- Visual Builders: Dify, Flowise
- RAG Data Layer: LlamaIndex, Haystack
- Realtime Voice: LiveKit Agents, Pipecat, Vocode
- Durable Workflows: Temporal
- Evals & QA: promptfoo, Ragas
- GitHub/Data Connectors: LlamaIndex GitHub reader, Haystack GitHub, CrewAI GitHub tools

## 5) Architecture Blueprint Template
- Frontend/UI: Next.js app (web), plus SMS/voice endpoints as needed
- Orchestration: LangGraph or CrewAI; capture state, retries, and HIL hooks
- Memory/State: Vector store + short-term conversation memory + long-term profile
- Tools/Integrations: HTTP APIs, DBs, calendars, CRMs, helpdesks, webhooks
- Data Pipelines: ETL for docs; embeddings ingestion; scheduled refresh
- Observability: structured logs, traces, cost meters, eval dashboards
- Security: SSO/SAML, least privilege, encryption, PII redaction, audit logs
- Deployment: containerized services, env separation, IaC, secrets management

## 6) Implementation Process
- Discovery & scoping (playback doc, acceptance criteria, timeline)
- Prototype (thin slice with the riskiest assumptions)
- Evals (promptfoo/Ragas scenarios, regression suite, success gates)
- Pilot (limited users, shadow mode or staged rollout)
- Hardening (SLOs, retries, timeouts, rate limits, red teams)
- Launch (runbooks, on-call rotation, dashboards, feedback loop)

## 7) Cost Modeling (template)
- LLM: per token or per minute cost + caching strategies
- Vector DB: storage + queries; chunking and retrieval optimizations
- Telephony: per minute, per call, STT/TTS costs
- Infra: compute, storage, network, observability
- Platform fees: hosted tools (e.g., Dify) or managed services

## 8) Ops Runbook
- Incident handling (severity levels, comms channels)
- Rollback strategy and feature flags
- Data lifecycle (retention, deletion, exports)
- Playbooks for common failures (API outage, timeouts, drift)
- Weekly evals and periodic prompt/knowledge refresh

## 9) Checklists
- Security: SSO, key vault, encryption in transit/at rest, access reviews
- QA: cross-browser, mobile, a11y, latency budgets
- Data: provenance, versioning, lineage, PII scanning
- Legal: DPA, AUP, privacy, consent, data residency

---

Use this playbook as the default template for new client automations; duplicate and fill it in per engagement. Add your selected tools from the resources catalog and tailor the architecture blueprint to the client’s stack and constraints.
