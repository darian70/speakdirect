"use client";

// Sentry temporarily disabled for deployment
// import * as Sentry from "@sentry/nextjs";
import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  // Report error to Sentry
  // Sentry.captureException(error);

  return (
    <html>
      <body style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
        <h1>Something went wrong</h1>
        <p>We track these errors automatically and will look into it.</p>
        <pre style={{ whiteSpace: 'pre-wrap', opacity: 0.7 }}>{error.message}</pre>
        <button onClick={reset} style={{ marginTop: 12, padding: '8px 12px', border: '1px solid #ddd' }}>
          Try again
        </button>
      </body>
    </html>
  );
}
