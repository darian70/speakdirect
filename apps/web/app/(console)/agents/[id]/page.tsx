'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Agent = {
  id: string
  name: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED'
  config?: {
    channel?: string
    systemPrompt?: string
    voiceId?: string
    voiceProvider?: string
    temperature?: number
    maxTokens?: number
  }
}

export default function AgentConfigPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Agent['status']>('DRAFT')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [voiceId, setVoiceId] = useState('')
  const [voiceProvider, setVoiceProvider] = useState('elevenlabs')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(500)

  useEffect(() => {
    if (!id) return
    loadAgent()
  }, [id])

  async function loadAgent() {
    try {
      setLoading(true)
      const res = await fetch(`/api/agents/${encodeURIComponent(String(id))}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load agent')
      
      const ag = data.agent as Agent
      setAgent(ag)
      setName(ag.name)
      setStatus(ag.status)
      setSystemPrompt(ag.config?.systemPrompt || '')
      setVoiceId(ag.config?.voiceId || '')
      setVoiceProvider(ag.config?.voiceProvider || 'elevenlabs')
      setTemperature(ag.config?.temperature ?? 0.7)
      setMaxTokens(ag.config?.maxTokens ?? 500)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(String(id))}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          status,
          config: {
            ...(agent?.config || {}),
            systemPrompt,
            voiceId,
            voiceProvider,
            temperature,
            maxTokens,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to update agent')
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await loadAgent()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) return
    
    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(String(id))}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete agent')
      router.push('/agents')
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-white/70">Loading agent...</div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="space-y-6">
        <div className="text-red-200">Agent not found</div>
        <Link href="/agents" className="text-white/80 hover:text-white hover:underline">Back to Agents</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Configure Agent</h1>
          <p className="text-white/60 text-sm">Customize behavior, voice, and prompts</p>
        </div>
        <Link href="/agents" className="text-xs text-white/80 hover:text-white hover:underline">
          Back to Agents
        </Link>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-200 text-sm">
          Agent updated successfully!
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white/90 mb-4">Basic Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">
                Agent Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
                placeholder="Customer Support Agent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">
                Status <span className="text-red-400">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Agent['status'])}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-white/20 focus:outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
              </select>
              <p className="text-xs text-white/50 mt-1">
                Only ACTIVE agents can receive calls
              </p>
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white/90 mb-2">System Prompt</h2>
          <p className="text-sm text-white/60 mb-4">
            Define how the AI agent should behave and respond to customers
          </p>
          <textarea
            rows={8}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none resize-none font-mono text-sm"
            placeholder="You are a professional customer service agent for an auto repair shop. Your goal is to inform customers about their vehicle service status, provide cost details, and obtain approval for repairs. Be friendly, clear, and concise."
          />
        </div>

        {/* Voice Settings */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white/90 mb-4">Voice Settings</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">
                Voice Provider
              </label>
              <select
                value={voiceProvider}
                onChange={(e) => setVoiceProvider(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-white/20 focus:outline-none"
              >
                <option value="elevenlabs">ElevenLabs</option>
                <option value="twilio">Twilio</option>
                <option value="azure">Azure</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">
                Voice ID
              </label>
              <input
                type="text"
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none font-mono text-sm"
                placeholder="voice-id-here"
              />
              <p className="text-xs text-white/50 mt-1">
                Get this from your voice provider dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Model Parameters */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white/90 mb-4">Model Parameters</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">
                Temperature: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-white/50 mt-1">
                Lower = more focused, Higher = more creative
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-white/20 focus:outline-none"
              />
              <p className="text-xs text-white/50 mt-1">
                Maximum response length
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 transition-colors"
          >
            Delete Agent
          </button>

          <div className="flex gap-3">
            <Link
              href="/agents"
              className="px-4 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                saving
                  ? 'bg-white/20 text-white/40 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
