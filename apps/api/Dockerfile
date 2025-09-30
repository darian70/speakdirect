# Build and run the API service in a container
# Monorepo-aware: copies apps/ and packages/ to build Prisma client and API

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

# Copy workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
# Copy source (apps & packages)
COPY apps ./apps
COPY packages ./packages

ENV NODE_ENV=production

# Install workspace deps
RUN pnpm install --frozen-lockfile

# Build API
WORKDIR /app/apps/api
RUN pnpm build

EXPOSE 8081
CMD ["pnpm", "start"]
