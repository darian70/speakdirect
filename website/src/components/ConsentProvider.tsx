'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type ConsentPrefs = {
  analytics: boolean
  marketing: boolean
}

type ConsentContextType = {
  consent: ConsentPrefs
  setConsent: (c: ConsentPrefs) => void
}

const defaultConsent: ConsentPrefs = { analytics: false, marketing: false }

const ConsentContext = createContext<ConsentContextType>({
  consent: defaultConsent,
  setConsent: () => {},
})

export function useConsent() {
  return useContext(ConsentContext)
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentPrefs>(defaultConsent)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('consent.preferences')
      if (raw) setConsent(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('consent.preferences', JSON.stringify(consent))
    } catch {}
  }, [consent])

  return (
    <ConsentContext.Provider value={{ consent, setConsent }}>
      {children}
    </ConsentContext.Provider>
  )
}
