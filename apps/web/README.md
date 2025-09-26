# @omniagents/web

Next.js App Router app for the marketing site and shell UI.

## Dev
```bash
pnpm --filter @omniagents/web dev
```

## Env
- NEXT_PUBLIC_POSTHOG_KEY
- NEXT_PUBLIC_POSTHOG_HOST (optional)

## Notable files
- app/layout.tsx — Root layout
- app/page.tsx — Home page (renders CookieBanner)
- lib/analytics.ts — Consent-aware PostHog init + track
- next.config.js — Aliases to packages/ui, packages/shared, packages/agents-sdk

## Usage
- Consent banner available via `@ui/CookieBanner`
- Schemas via `@shared`
- SDK via `@agents-sdk`
