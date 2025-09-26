"use client"

import { useEffect } from "react"

// Lightweight client-only Sentry init using @sentry/browser
// This avoids Next server config coupling and works with static export
let initialized = false

export default function ObservabilityInit() {
  useEffect(() => {
    if (initialized) return
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
    if (dsn) {
      // Dynamically import to avoid bundling if unused
      import("@sentry/browser").then((Sentry) => {
        if (initialized) return
        try {
          Sentry.init({
            dsn,
            // Sample performance traces conservatively by default
            tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || 0.1),
            replaysSessionSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE || 0.0),
            replaysOnErrorSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE || 1.0),
            environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,
            integrations: (integrations) => integrations,
          })
          initialized = true
        } catch {
          // no-op
        }
      })
    }
  }, [])

  return null
}
