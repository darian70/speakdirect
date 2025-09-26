'use client'

import { useState, useEffect } from 'react'
import { useConsent } from './ConsentProvider'

export default function ConsentBanner() {
  const { consent, setConsent } = useConsent()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasPrefs = typeof window !== 'undefined' && localStorage.getItem('consent.preferences')
    setVisible(!hasPrefs)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] bg-gray-900 text-white p-4 shadow-lg">
      <div className="max-width container-padding flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-200">
          We use cookies to analyze traffic (analytics) and show booking widgets (marketing). You can change your choices anytime.
        </p>
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => {
              setConsent({ analytics: false, marketing: false })
              setVisible(false)
            }}
          >
            Decline All
          </button>
          <button
            className="btn-outline border-white text-white hover:bg-white hover:text-gray-900"
            onClick={() => {
              setConsent({ analytics: true, marketing: true })
              setVisible(false)
            }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
