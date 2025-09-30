"use client"

import { hasFeature } from '@shared/plans'
import { usePlan } from '../../../lib/plan'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const { planId } = usePlan()
  const sso = hasFeature(planId, 'security.sso')
  const audit = hasFeature(planId, 'security.audit_logs')
  const [numbers, setNumbers] = useState<Array<{ id: string; e164: string; label?: string }>>([])
  const [loadingNums, setLoadingNums] = useState(false)
  const [errNums, setErrNums] = useState<string | null>(null)
  const [newE164, setNewE164] = useState('')
  const [newLabel, setNewLabel] = useState('')

  useEffect(() => {
    let active = true
    setLoadingNums(true)
    fetch('/api/phone-numbers', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!active) return
        if (d?.ok) setNumbers(d.numbers || [])
        else setErrNums(d?.error || 'failed_to_load')
      })
      .catch(() => active && setErrNums('network_error'))
      .finally(() => active && setLoadingNums(false))
    return () => { active = false }
  }, [])

  async function addNumber(e: React.FormEvent) {
    e.preventDefault()
    const e164 = newE164.trim()
    if (!/^\+\d{7,15}$/.test(e164)) { alert('Enter a valid E.164 number like +15551234567'); return }
    const res = await fetch('/api/admin/phone-numbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ e164, label: newLabel || undefined })
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.ok) {
      alert(`Failed to add: ${data?.error || res.status}`)
      return
    }
    // refresh list
    setNewE164(''); setNewLabel('')
    const r = await fetch('/api/phone-numbers', { cache: 'no-store' })
    const j = await r.json().catch(() => ({}))
    if (r.ok && j?.ok) setNumbers(j.numbers || [])
  }

  async function deleteNumber(id: string) {
    if (!confirm('Remove this phone number?')) return
    const res = await fetch(`/api/admin/phone-numbers/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) { alert('Failed to delete'); return }
    setNumbers((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white/90">Organization settings</h1>
        <p className="text-white/60 text-sm">Manage branding, authentication, and security.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="text-sm font-medium text-white/85">Branding</div>
          <div className="mt-3 space-y-3">
            <label className="block text-sm">Organization name</label>
            <input className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40" placeholder="Acme Inc." />
            <label className="block text-sm">Primary color</label>
            <input type="color" className="h-10 w-16 rounded border border-white/10 bg-white/5" defaultValue="#10b981" />
          </div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-white/85">Authentication</div>
          {!sso && (
            <div className="mt-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-200 text-sm">SSO is available on Pro plans and above.</div>
          )}
          <div className="mt-3 space-y-3">
            <label className="block text-sm">SSO Provider</label>
            <select className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white">
              <option>None</option>
              <option disabled={!sso}>Okta</option>
              <option disabled={!sso}>Azure AD</option>
              <option disabled={!sso}>Google Workspace</option>
            </select>
          </div>
        </div>
        <div className="card md:col-span-2">
          <div className="text-sm font-medium text-white/85">Security</div>
          {!audit && (
            <div className="mt-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-200 text-sm">Audit logs are available on Pro plans and above.</div>
          )}
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-white/20 bg-white/10" defaultChecked />
              Enforce 2FA
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-white/20 bg-white/10" defaultChecked={audit} disabled={!audit} />
              Capture audit logs
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-white/20 bg-white/10" />
              Limit PII in transcripts
            </label>
          </div>
        </div>
        <div className="card md:col-span-2">
          <div className="text-sm font-medium text-white/85">Phone Numbers (Inbound)</div>
          <p className="mt-1 text-xs text-white/60">Provision numbers for inbound calls. Route by matching the called number to this organization.</p>
          <div className="mt-3">
            {loadingNums && <div className="text-white/70 text-sm">Loading…</div>}
            {errNums && <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">{errNums}</div>}
            {!loadingNums && !errNums && (
              <div className="space-y-3">
                <div className="overflow-x-auto rounded-lg border border-white/10">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 text-white/70">
                        <th className="px-3 py-2 text-left font-medium">Number</th>
                        <th className="px-3 py-2 text-left font-medium">Label</th>
                        <th className="px-3 py-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {numbers.length === 0 && (
                        <tr><td colSpan={3} className="px-3 py-4 text-center text-white/60">No numbers yet.</td></tr>
                      )}
                      {numbers.map((n) => (
                        <tr key={n.id} className="border-t border-white/10">
                          <td className="px-3 py-2 text-white/85">{n.e164}</td>
                          <td className="px-3 py-2 text-white/80">{n.label || '—'}</td>
                          <td className="px-3 py-2">
                            <button onClick={() => deleteNumber(n.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <form onSubmit={addNumber} className="grid gap-2 md:grid-cols-3">
                  <input value={newE164} onChange={(e) => setNewE164(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40" placeholder="E.164 e.g. +15551234567" />
                  <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40" placeholder="Label (optional)" />
                  <button type="submit" className="btn-primary">Add number</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
