SHELL := /bin/bash

.PHONY: dev build lint test fmt lab-up lab-down evals docs-lint setup

setup:
	pnpm install

 dev:
	pnpm dev

 build:
	pnpm build

 lint:
	pnpm lint || true
	docker --version >/dev/null 2>&1 || true

 fmt:
	npx prettier . --check || true

 docs-lint:
	npx markdownlint-cli "**/*.md" --ignore node_modules || true

 evals:
	npx promptfoo eval -c evals/promptfoo.yaml || true

 lab-up:
	cd ops/agents-lab && docker compose up -d

 lab-down:
	cd ops/agents-lab && docker compose down
