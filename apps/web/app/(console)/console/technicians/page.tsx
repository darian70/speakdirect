'use client'

import { useState } from 'react'
import { usePlan } from '../../../../lib/plan'
import { hasFeature } from '@shared/plans'

export default function TechniciansConsolePage() {
  const { planId } = usePlan()
  const canVoice = hasFeature(planId, 'channels.voice')
  const [clientNumber, setClientNumber] = useState('')
  const [technicianNumber, setTechnicianNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const startCall = async () => {
    if (!canVoice) {
      setMessage('Upgrade required: Voice channel is available on Growth plans and above.')
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientNumber, technicianNumber: technicianNumber || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to initiate call')
      setMessage(`Call started. SID: ${data.sid}`)
    } catch (e: any) {
      setMessage(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold mb-4">Technician Click-to-Call</h1>
        <p className="text-gray-400 mb-6">Enter the client's phone number and optionally override the technician number, then click Call.</p>
        {!canVoice && (
          <div className="mb-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-200 text-sm">
            Voice channel is locked on your current plan. Upgrade in Billing to enable.
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Client Number (E.164)</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40"
              placeholder="+15551234567"
              value={clientNumber}
              onChange={(e) => setClientNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Technician Number (optional, E.164)</label>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40"
              placeholder="+15557654321"
              value={technicianNumber}
              onChange={(e) => setTechnicianNumber(e.target.value)}
            />
          </div>
          <button
            onClick={startCall}
            disabled={loading || !canVoice}
            className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-black bg-white ${loading || !canVoice ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            {loading ? 'Initiating…' : 'Call Now'}
          </button>
          {message && (
            <div className="text-sm text-white/80 bg-white/10 rounded p-3">{message}</div>
          )}
        </div>
        <div className="text-xs text-white/50 mt-4">
          Calls are initiated server-side and bridged via secure telephony provider. Numbers must be in E.164 format (e.g., +15551234567).
        </div>
      </div>
    </div>
  )
}
