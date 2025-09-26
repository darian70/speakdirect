'use client'

import { useEffect, useMemo, useState } from 'react'
import { listLeads, type AdminLead } from '@/lib/omni/api'
import { ArrowPathIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function AdminLeadsPage() {
  const [token, setToken] = useState<string>('')
  const [status, setStatus] = useState<'pending' | 'confirmed'>('pending')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leads, setLeads] = useState<AdminLead[]>([])

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('omni_admin_token') : null
    if (saved) setToken(saved)
  }, [])

  async function load() {
    if (!token) {
      setError('Missing admin token')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await listLeads({ status, token })
      if (res.ok && res.leads) {
        setLeads(res.leads)
      } else {
        setError(res.error || 'Failed to load leads')
      }
    } catch (e: any) {
      setError(e?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  function saveToken(t: string) {
    setToken(t)
    if (t) localStorage.setItem('omni_admin_token', t)
    else localStorage.removeItem('omni_admin_token')
  }

  useEffect(() => {
    // Auto-load when token or status changes
    if (token) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, status])

  return (
    <div className="max-width container-padding py-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin • Leads</h1>
          <p className="text-gray-600 text-sm">View {status} leads</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-lg px-3 py-2"
            value={status}
            onChange={(e) => setStatus((e.target.value as 'pending' | 'confirmed') || 'pending')}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
          </select>
          <button onClick={load} className="btn-secondary inline-flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {!token ? (
        <div className="card p-6 flex items-center gap-4">
          <LockClosedIcon className="w-6 h-6 text-gray-500" />
          <input
            type="password"
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="Enter admin bearer token"
            onChange={(e) => setToken(e.target.value)}
            onBlur={(e) => saveToken(e.target.value)}
          />
          <button className="btn-primary" onClick={load}>Load</button>
        </div>
      ) : null}

      {error && (
        <div className="my-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-900 text-sm">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">Topic</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">Loading…</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">No leads found</td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id} className="border-b">
                  <td className="py-2 pr-4">{l.name}</td>
                  <td className="py-2 pr-4">{l.email}</td>
                  <td className="py-2 pr-4">{l.company || '-'}</td>
                  <td className="py-2 pr-4">{l.topic || '-'}</td>
                  <td className="py-2 pr-4">{l.source || '-'}</td>
                  <td className="py-2 pr-4">{l.status}</td>
                  <td className="py-2 pr-4">{new Date(l.ts).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
