"use client"

import { useEffect, useState } from 'react'

type Flags = { maintenanceMode: boolean; allowSignups: boolean; telephonyEnabled?: boolean }

export default function FlagsPage() {
  const [flags, setFlags] = useState<Flags | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadFlags() {
    setError(null)
    try {
      const res = await fetch('/api/flags', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load flags')
      setFlags(data.flags)
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function patchFlags(patch: Partial<Flags>) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/flags', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Update failed')
      setFlags(data.flags)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => { loadFlags() }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Flags</h1>
        <p className="text-gray-600 text-sm">Feature flags and operational toggles</p>
      </div>
      <div className="rounded-lg border border-black/10 bg-white p-4 text-sm text-gray-800">
        {!flags ? (
          <div className="text-gray-600">Loading…</div>
        ) : (
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={!!flags.maintenanceMode}
                onChange={(e) => patchFlags({ maintenanceMode: e.target.checked })}
                disabled={saving}
              />
              <div>
                <div className="font-medium">Maintenance mode</div>
                <div className="text-xs text-gray-600">When enabled, user-facing operations may be limited.</div>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={!!flags.allowSignups}
                onChange={(e) => patchFlags({ allowSignups: e.target.checked })}
                disabled={saving}
              />
              <div>
                <div className="font-medium">Allow signups</div>
                <div className="text-xs text-gray-600">Toggle public registration across tenants.</div>
              </div>
            </label>

            <div className="flex items-center gap-3 opacity-70">
              <input type="checkbox" className="h-4 w-4" checked={!!flags.telephonyEnabled} readOnly />
              <div>
                <div className="font-medium">Telephony enabled</div>
                <div className="text-xs text-gray-600">Controlled by environment (Twilio credentials). Read-only.</div>
              </div>
            </div>

            {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-xs">{error}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
