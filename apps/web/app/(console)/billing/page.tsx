"use client"

import { usePlan } from '../../../lib/plan'
import { useState } from 'react'

export default function BillingPage() {
  const { plan } = usePlan()
  const portalUrl = process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function openPortal() {
    try {
      setError(null)
      setLoading(true)
      const res = await fetch('/api/billing/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.url) throw new Error(data?.error || 'Failed to create portal session')
      window.open(String(data.url), '_blank', 'noopener,noreferrer')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white/90">Billing</h1>
        <p className="text-white/60 text-sm">Manage your subscription and usage.</p>
      </div>

      <div className="card">
        <div className="text-sm font-medium text-white/85">Current plan</div>
        <div className="mt-2 text-white/80">{plan.name}</div>
        {portalUrl ? (
          <div className="mt-4 flex gap-2">
            <a href={portalUrl} target="_blank" rel="noreferrer" className="btn-primary">Manage subscription</a>
            <a href={portalUrl} target="_blank" rel="noreferrer" className="btn-secondary">View invoices</a>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2">
            <button onClick={openPortal} disabled={loading} className="btn-primary">{loading ? 'Contacting Stripe…' : 'Manage subscription'}</button>
            <button onClick={openPortal} disabled={loading} className="btn-secondary">View invoices</button>
          </div>
        )}
        {error && <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-xs">{error}</div>}
      </div>

      <div className="card">
        <div className="text-sm font-medium text-white/85">Usage</div>
        <ul className="mt-3 text-sm text-white/70 list-disc list-inside">
          <li>Messages: {plan.quota?.messages ?? '—'}</li>
          <li>Minutes: {plan.quota?.minutes ?? '—'}</li>
        </ul>
      </div>
    </div>
  )
}
