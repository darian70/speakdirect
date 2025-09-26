"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    // Use replace to avoid back button loop
    router.replace('/company/about')
  }, [router])
  return null
}
