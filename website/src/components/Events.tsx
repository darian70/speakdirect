'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'
import { useConsent } from './ConsentProvider'

export default function Events() {
  const { consent } = useConsent()

  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement
      const el = target?.closest('[data-analytics]') as HTMLElement | null
      if (!el) return
      const name = el.getAttribute('data-analytics') || 'click'
      const label = el.getAttribute('data-label') || undefined
      if (consent.analytics) track({ name, params: { label } })
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [consent.analytics])

  return null
}
