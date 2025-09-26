# Contributing Guide

Thank you for contributing! This repo powers an enterprise-grade AI automation platform. Please follow these guidelines.

## Branches

- Create feature branches from `main`: `feat/<scope>`, `fix/<scope>`, `docs/<scope>`
- Keep PRs small and focused.

## Commits

- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`

## Setup

- Node: v20+, PNPM 9
- Python: 3.11+
- Docker Desktop (Agents Lab optional)

## Commands

- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Agents Lab: `make lab-up` / `make lab-down`

## Code Style

- Prettier and ESLint for TS/JS
- Markdownlint for docs
- Python starters: follow PEP8, black/isort if you use them locally

## Tests & Evals

- Add tests where applicable
- Add/update promptfoo evals for agents and RAG where relevant

## Security

- Do not commit secrets. Use `.env` files locally and GitHub Actions secrets in CI.
- Report vulnerabilities via `SECURITY.md`.

## PR Checklist

- Code builds and lints cleanly
- CI passes
- Docs updated when needed
