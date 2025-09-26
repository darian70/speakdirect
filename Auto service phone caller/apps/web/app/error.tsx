"use client";

import Link from "next/link";
import { Button } from "./components/ui";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl py-24 text-center">
      <div className="text-6xl font-bold tracking-tight">Something went wrong</div>
      <p className="mt-3 text-slate-600">{error?.message || "An unexpected error occurred."}</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button onClick={() => reset()} variant="outline">Try again</Button>
        <Link href="/app/calls"><Button>Go to Dashboard</Button></Link>
      </div>
      {error?.digest && <p className="mt-2 text-xs text-slate-400">Ref: {error.digest}</p>}
    </div>
  );
}
