'use client'

import { useEffect, useMemo, useState } from 'react'

type Agent = { id: string; tenantId: string; name: string; status: 'DRAFT'|'ACTIVE'|'PAUSED'; config?: any }

export default function AdminAgentsPage() {
  const [tenantId, setTenantId] = useState('default')
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [channel, setChannel] = useState<'chat'|'voice'>('voice')
  const [creating, setCreating] = useState(false)

  const qs = useMemo(() => new URLSearchParams({ tenantId }).toString(), [tenantId])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/agents?${qs}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load agents')
      setAgents(Array.isArray(data.agents) ? data.agents : [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [qs])

  async function createAgent() {
    if (!name.trim()) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, name, channel, config: channel === 'voice' ? { channel: 'voice' } : { channel: 'chat' } })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create agent')
      setName('')
      setChannel('voice')
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  async function removeAgent(id: string) {
    setError(null)
    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(id)}?tenantId=${encodeURIComponent(tenantId)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Delete failed')
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agents</h1>
          <p className="text-gray-600 text-sm">Create and manage chat and phone (voice) agents per tenant.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Tenant</label>
          <input value={tenantId} onChange={(e) => setTenantId(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm" placeholder="default" />
        </div>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-4">
        <div className="text-sm font-medium text-gray-800 mb-3">Create agent</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Phone Support"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Channel</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value as any)} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm">
              <option value="voice">Voice (Phone)</option>
              <option value="chat">Chat</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={createAgent} disabled={creating || !name.trim()} className="btn-primary">
              {creating ? 'Creating…' : 'Create'}
            </button>
          </div>
        </div>
        {error && <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">{error}</div>}
      </div>

      <div className="rounded-lg border border-black/10 bg-white">
        {loading ? (
          <div className="p-4 text-sm text-gray-600">Loading…</div>
        ) : agents.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No agents for tenant "{tenantId}" yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Tenant</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Channel</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => {
                  const ch = a.config?.channel || (a.name?.toLowerCase().includes('phone') ? 'voice' : 'chat')
                  return (
                    <tr key={a.id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-3 py-2">{a.name}</td>
                      <td className="px-3 py-2">{a.tenantId}</td>
                      <td className="px-3 py-2">{a.status}</td>
                      <td className="px-3 py-2">{ch}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => removeAgent(a.id)} className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-700 hover:bg-red-100">Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
