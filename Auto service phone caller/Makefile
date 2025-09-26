include .env

.PHONY: up down logs api worker migrate makemigration shell n8n rqdash fmt lint

up:
	docker compose up -d db redis api rqworker rqdash n8n web voice-bridge scheduler
	docker compose ps

down:
	docker compose down

logs:
	docker compose logs -f --tail=200

api:
	docker compose up --build api

worker:
	docker compose up --build rqworker

rqdash:
	docker compose up rqdash

n8n:
	docker compose up n8n

web:
	docker compose up --build web

migrate:
	docker compose exec api alembic upgrade head || true

makemigration:
	docker compose exec api alembic revision --autogenerate -m "update" || true

shell:
	docker compose exec api bash

fmt:
	docker compose exec api ruff check --fix . || true
	docker compose exec api black . || true

lint:
	docker compose exec api ruff check . || true
