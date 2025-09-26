# Agents Lab (docker-compose)

Bring up optional dependencies to accelerate local development: vector DB, visual agent builder, and durable workflows.

## Services

- Qdrant (vector DB): [http://localhost:6333](http://localhost:6333)
- Flowise (visual builder): [http://localhost:3001](http://localhost:3001)
- Temporal: grpc :7233
- Temporal UI: [http://localhost:8233](http://localhost:8233)

## Usage

```bash
docker compose up -d
```

Use these alongside the starters in `../../starters/`.
