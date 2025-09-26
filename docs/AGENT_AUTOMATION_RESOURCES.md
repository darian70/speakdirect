# Agent + Automation Resources Catalog

Curated open-source frameworks, platforms, and tools to build production agent systems and automations.

## Orchestration Frameworks
- LangGraph — https://github.com/langchain-ai/langgraph
  - Reliable, stateful agents with graphs, tools, memory, human-in-the-loop.
- CrewAI — https://github.com/crewAIInc/crewAI
  - Multi-agent collaboration with roles/goals/tasks; batteries-included tools.
- Microsoft AutoGen — https://github.com/microsoft/autogen
  - Conversational multi-agent framework; strong examples and tooling ecosystem.
- CAMEL — https://github.com/camel-ai/camel
  - Research-grade multi-agent framework and environments.
- Langroid — https://github.com/langroid/langroid
  - Lightweight Python framework for agents with clear abstractions.

## Visual Builders (Low/No-Code)
- Dify — https://github.com/langgenius/dify
  - Agentic AI platform: apps, agents, datasets, workflows, plugins.
- Flowise — https://github.com/FlowiseAI/Flowise
  - Visual builder for LangChain/agents; easy deployment and templates.
- Open Agent Platform — https://github.com/langchain-ai/open-agent-platform
  - UI for configuring and hosting LangGraph-based agents.

## Data/RAG Frameworks
- LlamaIndex — https://github.com/run-llama/llama_index
  - Data framework for agents/RAG; rich connectors incl. GitHub readers.
- Haystack — https://github.com/deepset-ai/haystack
  - Pipelines/agents for RAG and QA; production-ready components.

## Realtime Voice + Multimodal
- LiveKit Agents — https://github.com/livekit/agents
  - Realtime audio/video agents with test framework and hosted/cloud options.
- Pipecat — https://github.com/pipecat-ai/pipecat
  - Voice-first framework with flows for structured conversations.
- Vocode Core — https://github.com/vocodedev/vocode-core
  - Voice-based LLM agents; phone, Zoom, real-time streaming.

## Durable Workflows
- Temporal — https://github.com/temporalio/temporal
  - Durable execution, retries, state persistence; ideal for business workflows.

## Evals and QA
- promptfoo — https://github.com/promptfoo/promptfoo
  - Local-first evals for prompts, agents, and RAGs; CI-friendly.
- Ragas — https://github.com/explodinggradients/ragas
  - RAG/agent evaluation toolkit; metrics for faithfulness, answer quality.

## Agent Platforms and Starters
- OpenAI Agents SDK (TS/Python) — https://openai.github.io/openai-agents-python/ | https://openai.github.io/openai-agents-js/
  - Production evolution over Swarm; sessions, tools, tracing, guardrails.
- OpenAgents (xlang) — https://github.com/xlang-ai/OpenAgents
  - Open platform to host and use agents with application-level design.
- SuperAGI — https://github.com/TransformerOptimus/SuperAGI
  - Dev-first agent platform with marketplace and toolkits.
- MetaGPT — https://github.com/FoundationAgents/MetaGPT
  - Multi-agent “build a company” style framework; research/edu usage.
- AutoGPT — https://github.com/Significant-Gravitas/AutoGPT
  - Popular agent platform supporting agent protocol and benchmarking.

## Helpful Aggregations and Learning
- Awesome AI Agents — https://github.com/e2b-dev/awesome-ai-agents
- 500 AI Agents Projects — https://github.com/ashishpatel26/500-AI-Agents-Projects
- Hugging Face Agents Course (smolagents) — https://github.com/huggingface/agents-course | Docs: https://huggingface.co/docs/smolagents/en/index

## GitHub/Data Connectors
- LlamaIndex GitHub Reader — https://docs.llamaindex.ai/en/stable/examples/data_connectors/GithubRepositoryReaderDemo/
- Haystack GitHub integrations — https://haystack.deepset.ai/integrations/github
- CrewAI Enterprise GitHub tools — https://docs.crewai.com/en/enterprise/integrations/github

---

# Quick-Start Stacks by Use Case

## Voice Support or Sales Agent
- Realtime: LiveKit Agents or Pipecat
- Orchestration: LangGraph or OpenAI Agents SDK
- STT/TTS: Provider of choice (OpenAI Realtime, Deepgram, ElevenLabs)
- CRM/Helpdesk: Tool functions (Zendesk, Salesforce, HubSpot)
- Evals: promptfoo + Ragas; call summaries to ticket

## RAG Knowledge Bot (Web/Chat/Slack)
- Data layer: LlamaIndex or Haystack
- Orchestration: LangGraph
- UI: Next.js (our website/app), Slack/Teams adapter
- Observability: tracing + cost tracking; weekly evals

## Multi-Agent Workflow Automation
- Orchestration: CrewAI or AutoGen (specialist agents)
- Durable background jobs: Temporal
- Tools: internal APIs/DBs; approvals + notifications
- Governance: guardrails, HIL checkpoints, audit logs

---

# Selection Guidance
- Start simple: one agent + tools + evals before scaling to multi-agent.
- Prefer frameworks with active community, tracing, and testability.
- For voice, prioritize latency and microphone/telephony integrations.
- Bake in evals from day 1; define success metrics and datasets early.

Use alongside the implementation guidance in `docs/AGENT_AUTOMATION_PLAYBOOK.md`.
