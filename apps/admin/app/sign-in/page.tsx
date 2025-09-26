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
        <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 text-gray-800">
          <div className="text-lg font-semibold mb-2">Sign in</div>
          <p className="text-sm text-gray-600">Authentication is not configured. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in apps/admin/.env.local and restart the server.</p>
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
