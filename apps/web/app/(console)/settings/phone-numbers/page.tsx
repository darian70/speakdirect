'use client'

import { useEffect, useState, FormEvent } from 'react'

type PhoneNumber = {
  id: string
  tenantId: string
  e164: string
  label?: string | null
  provider?: string | null
  createdAt: string
}

export default function PhoneNumbersPage() {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form fields
  const [e164, setE164] = useState('')
  const [label, setLabel] = useState('')

  useEffect(() => {
    loadNumbers()
  }, [])

  async function loadNumbers() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/phone-numbers', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load phone numbers')
      setNumbers(Array.isArray(data.numbers) ? data.numbers : [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Format phone number to E.164
      let phone = e164.trim()
      if (!phone.startsWith('+')) {
        phone = '+1' + phone.replace(/\D/g, '')
      }

      const res = await fetch('/api/admin/phone-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ e164: phone, label: label.trim() || undefined }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to provision phone number')

      setE164('')
      setLabel('')
      setShowForm(false)
      await loadNumbers()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to remove this phone number? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/admin/phone-numbers/${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete phone number')
      await loadNumbers()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Phone Numbers</h1>
          <p className="text-white/60 text-sm">Manage Twilio phone numbers for inbound routing</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Number'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Add Number Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white/90 mb-4">Provision Phone Number</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">
                Phone Number (E.164 format) <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={e164}
                onChange={(e) => setE164(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none font-mono"
                placeholder="+15551234567"
              />
              <p className="text-xs text-white/50 mt-1">
                Must be a Twilio number you've purchased. Include country code.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/85 mb-1">
                Label (Optional)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
                placeholder="Main Support Line"
              />
              <p className="text-xs text-white/50 mt-1">
                Friendly name to identify this number (e.g., "Main Line", "Support")
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  submitting
                    ? 'bg-white/20 text-white/40 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {submitting ? 'Adding...' : 'Add Number'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setE164('')
                  setLabel('')
                  setError(null)
                }}
                className="px-4 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Numbers List */}
      {loading ? (
        <div className="text-white/70 text-sm">Loading phone numbers...</div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {numbers.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-white/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p className="text-white/70 text-sm">No phone numbers provisioned yet</p>
              <p className="text-white/50 text-xs mt-1">Add a Twilio number to start receiving inbound calls</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-white/5 text-white/70">
                  <th className="px-4 py-3 text-left text-xs font-medium">Phone Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium">Label</th>
                  <th className="px-4 py-3 text-left text-xs font-medium">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-medium">Added</th>
                  <th className="px-4 py-3 text-right text-xs font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((num) => (
                  <tr key={num.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <span className="text-white/90 font-mono text-sm">{num.e164}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/80 text-sm">{num.label || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-200">
                        {num.provider || 'twilio'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/70 text-xs">
                        {new Date(num.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(num.id)}
                        className="text-xs text-red-400 hover:text-red-300 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Info Panel */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-medium text-white/85 mb-3">Configuring Twilio Numbers</h3>
        <ol className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/80 text-xs font-medium flex-shrink-0">1</span>
            <span>Purchase a phone number from Twilio Console</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/80 text-xs font-medium flex-shrink-0">2</span>
            <span>Configure Voice webhook to point to your API: <code className="text-xs bg-white/10 px-1 py-0.5 rounded">https://api.speakdirect.xyz/twilio/voice/inbound</code></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/80 text-xs font-medium flex-shrink-0">3</span>
            <span>Add the number here using E.164 format (e.g., +15551234567)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/80 text-xs font-medium flex-shrink-0">4</span>
            <span>Inbound calls to this number will now route to your organization</span>
          </li>
        </ol>
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-xs text-blue-200">
            <strong>Note:</strong> Each phone number can only be assigned to one tenant. Make sure the webhook is configured before adding numbers here.
          </p>
        </div>
      </div>
    </div>
  )
}
