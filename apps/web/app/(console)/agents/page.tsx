"use client"

import { useEffect, useState, FormEvent } from 'react'
import { usePlan } from '../../../lib/plan'
import { hasFeature } from '@shared/plans'

type Agent = { id: string; name: string; status: string; config?: any }

export default function AgentsPage() {
  const { planId } = usePlan()
  const canVoice = hasFeature(planId, 'channels.voice')
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [channel, setChannel] = useState<'chat' | 'voice'>('chat')
  const [submitting, setSubmitting] = useState(false)

  async function loadAgents() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/agents', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load agents')
      setAgents(Array.isArray(data.agents) ? data.agents : [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteAgent(id: string) {
    setError(null)
    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to delete agent')
      await loadAgents()
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => { loadAgents() }, [])

  async function createAgent(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, channel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create agent')
      setName('')
      setChannel('chat')
      setShowForm(false)
      await loadAgents()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Agents</h1>
          <p className="text-white/60 text-sm">Create and manage your AI agents across channels.</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary">{showForm ? 'Close' : 'New agent'}</button>
      </div>

      {!canVoice && (
        <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-200 text-sm">
          Voice channels are available on Growth plans and above. Upgrade in Billing.
        </div>
      )}

      {showForm && (
        <form onSubmit={createAgent} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/85 mb-1">Agent name</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="Support Bot"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">Channel</label>
              <select value={channel} onChange={e => setChannel(e.target.value as any)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white">
                <option value="chat">Chat</option>
                <option value="voice" disabled={!canVoice}>Voice</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button disabled={submitting} className="btn-primary">{submitting ? 'Creating…' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-white/60 text-sm">Loading agents…</div>
      ) : error ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">{error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {agents.length === 0 ? (
            <div className="text-white/60 text-sm">No agents yet. Create your first agent.</div>
          ) : agents.map((a) => (
            <div key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-medium text-white/85">{a.name}</div>
              <div className="text-xs text-white/60">Status: {a.status ?? 'Draft'}</div>
              <div className="mt-3 flex gap-2">
                <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">Configure</button>
                <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">Test</button>
                <button onClick={() => deleteAgent(a.id)} className="rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-xs text-red-200">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
