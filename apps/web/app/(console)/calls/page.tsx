"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Call = {
  id: string
  tenantId: string
  provider?: string | null
  providerCallId?: string | null
  direction: string
  from: string
  to: string
  status: string
  startedAt?: string
  endedAt?: string | null
  durationSec?: number | null
  recordingUrl?: string | null
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch('/api/calls?limit=100', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return
        if (data?.ok) setCalls(data.calls || [])
        else setError(data?.error || 'failed_to_load')
      })
      .catch(() => active && setError('network_error'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white/90">Calls</h1>
        <p className="text-white/60 text-sm">Inbound and outbound calls for your organization.</p>
      </div>

      {loading && <div className="text-white/70 text-sm">Loading calls…</div>}
      {error && <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-white/70">
                <th className="px-3 py-2 text-left font-medium">Time</th>
                <th className="px-3 py-2 text-left font-medium">Direction</th>
                <th className="px-3 py-2 text-left font-medium">From</th>
                <th className="px-3 py-2 text-left font-medium">To</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Duration</th>
                <th className="px-3 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {calls.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-white/60">No calls yet.</td>
                </tr>
              )}
              {calls.map((c) => {
                const started = c.startedAt ? new Date(c.startedAt) : undefined
                const duration = typeof c.durationSec === 'number' ? `${c.durationSec}s` : '—'
                return (
                  <tr key={c.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-3 py-2 text-white/85">{started ? started.toLocaleString() : '—'}</td>
                    <td className="px-3 py-2 text-white/80">{c.direction}</td>
                    <td className="px-3 py-2 text-white/80">{c.from}</td>
                    <td className="px-3 py-2 text-white/80">{c.to}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80">{c.status}</span>
                    </td>
                    <td className="px-3 py-2 text-white/70">{duration}</td>
                    <td className="px-3 py-2">
                      <Link href={`/calls/${c.id}`} className="text-xs text-white hover:underline">View</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
