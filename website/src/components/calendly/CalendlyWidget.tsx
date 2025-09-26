'use client'

import { useEffect } from 'react'
import { useConsent } from '@/components/ConsentProvider'

declare global {
  interface Window { Calendly?: any }
}

const DEFAULT_URL = 'https://calendly.com/speakdirect/demo-30min'

export default function CalendlyWidget() {
  const { consent } = useConsent()

  useEffect(() => {
    if (!consent.marketing) return

    // Load Calendly assets
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    const handler = (e: Event) => {
      const el = (e.target as HTMLElement)?.closest('[data-calendly]') as HTMLElement | null
      if (!el) return
      e.preventDefault()
      const url = el.getAttribute('data-calendly-url') || DEFAULT_URL
      // @ts-ignore
      window.Calendly?.initPopupWidget({ url })
      return false
    }

    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler)
      link.remove()
      script.remove()
    }
  }, [consent.marketing])

  return null
}
