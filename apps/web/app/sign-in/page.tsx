"use client"

import { useMemo } from 'react'

let SignIn: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SignIn = require('@clerk/nextjs').SignIn
} catch (_) {
  SignIn = null
}

export default function SignInPage() {
  const configured = useMemo(() => !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, [])
  if (!configured || !SignIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6 text-white/80">
          <div className="text-lg font-semibold mb-2">Sign in</div>
          <p className="text-sm text-white/60">Authentication is not configured. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in apps/web/.env.local and restart the server.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl p-6 text-black">
        <SignIn routing="hash" />
      </div>
    </div>
  )
}
