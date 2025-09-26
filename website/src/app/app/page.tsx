"use client"

import { useEffect } from 'react'

const CONSOLE_URL = process.env.NEXT_PUBLIC_CONSOLE_URL || 'https://app.speakdirect.ai'

export default function AppRedirectPage() {
  useEffect(() => {
    // Client-side redirect preserves static export compatibility
    if (typeof window !== 'undefined') {
      window.location.replace(CONSOLE_URL)
    }
  }, [])
  return null
}
