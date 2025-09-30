# Production Dockerfile for Next.js app in a monorepo
# Builds the Next.js app and runs it with next start

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

# Copy workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
# Copy source (apps & packages)
COPY apps ./apps
COPY packages ./packages

ENV NODE_ENV=production

# Install deps (workspace)
RUN pnpm install --frozen-lockfile

# Build web app
WORKDIR /app/apps/web
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
