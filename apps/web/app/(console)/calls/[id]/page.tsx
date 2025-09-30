"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

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
  meta?: any
}

type CallEvent = { id: string; callId: string; type: string; ts: string; payload?: any }

type Transcript = { id: string; callId: string; channel: string; text: string; ts: string }

export default function CallDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const [call, setCall] = useState<Call | null>(null)
  const [events, setEvents] = useState<CallEvent[]>([])
  const [transcript, setTranscript] = useState<Transcript[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    fetch(`/api/calls/${encodeURIComponent(String(id))}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return
        if (data?.ok) {
          setCall(data.call)
          setEvents(data.events || [])
          setTranscript(data.transcript || [])
        } else setError(data?.error || 'failed_to_load')
      })
      .catch(() => active && setError('network_error'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  const started = call?.startedAt ? new Date(call.startedAt) : undefined
  const ended = call?.endedAt ? new Date(call.endedAt) : undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Call Details</h1>
          <p className="text-white/60 text-sm">Call #{id}</p>
        </div>
        <Link href="/calls" className="text-xs text-white/80 hover:text-white">Back to Calls</Link>
      </div>

      {loading && <div className="text-white/70 text-sm">Loading…</div>}
      {error && <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">{error}</div>}

      {call && (
        <div className="space-y-4">
          {/* Work Order Info (if exists) */}
          {call.meta?.workOrder && (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-lg font-semibold text-blue-200">Work Order Details</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs text-blue-300/70 mb-1">Customer Name</div>
                  <div className="text-sm text-blue-100 font-medium">{call.meta.workOrder.customerName}</div>
                </div>
                <div>
                  <div className="text-xs text-blue-300/70 mb-1">Vehicle</div>
                  <div className="text-sm text-blue-100 font-medium">{call.meta.workOrder.vehicleInfo}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-blue-300/70 mb-1">Service Performed</div>
                  <div className="text-sm text-blue-100">{call.meta.workOrder.servicePerformed}</div>
                </div>
                <div>
                  <div className="text-xs text-blue-300/70 mb-1">Total Cost</div>
                  <div className="text-sm text-blue-100 font-medium">{call.meta.workOrder.totalCost}</div>
                </div>
                {call.meta.workOrder.requiresApproval && (
                  <div>
                    <div className="text-xs text-blue-300/70 mb-1">Approval</div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-200">
                      Required
                    </span>
                  </div>
                )}
                {call.meta.workOrder.notes && (
                  <div className="md:col-span-2">
                    <div className="text-xs text-blue-300/70 mb-1">Notes</div>
                    <div className="text-sm text-blue-100 italic">{call.meta.workOrder.notes}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-base font-medium text-white/85">Call Overview</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <div className="text-white/50 text-xs mb-1">Direction</div>
                  <div className="text-white/90">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      call.direction === 'outbound' ? 'bg-green-500/20 text-green-200' : 'bg-blue-500/20 text-blue-200'
                    }`}>
                      {call.direction === 'outbound' ? '📞 Outbound' : '📱 Inbound'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Status</div>
                  <div className="text-white/90">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/10 text-white/80">
                      {call.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">From</div>
                  <div className="text-white/90 font-mono text-xs">{call.from}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">To</div>
                  <div className="text-white/90 font-mono text-xs">{call.to}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Started</div>
                  <div className="text-white/90">{started ? started.toLocaleString() : '—'}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Ended</div>
                  <div className="text-white/90">{ended ? ended.toLocaleString() : '—'}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Duration</div>
                  <div className="text-white/90 font-medium">
                    {typeof call.durationSec === 'number' ? `${Math.floor(call.durationSec / 60)}m ${call.durationSec % 60}s` : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Provider</div>
                  <div className="text-white/90">{call.provider || '—'}</div>
                </div>
                {call.providerCallId && (
                  <div className="md:col-span-2">
                    <div className="text-white/50 text-xs mb-1">Provider Call ID</div>
                    <div className="text-white/70 font-mono text-xs">{call.providerCallId}</div>
                  </div>
                )}
                {call.recordingUrl && (
                  <div className="md:col-span-2">
                    <div className="text-white/50 text-xs mb-1">Recording</div>
                    <a 
                      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline" 
                      href={call.recordingUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                      </svg>
                      Play Recording
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-base font-medium text-white/85">Events</h2>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {events.length === 0 && <div className="text-white/60 text-sm">No events captured yet.</div>}
                {events.map((e) => (
                  <div key={e.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/50 mb-1">{new Date(e.ts).toLocaleString()}</div>
                    <div className="text-sm text-white/85 font-medium">{e.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transcript Section */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h2 className="text-base font-medium text-white/85">Conversation Transcript</h2>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {transcript.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-white/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-white/60 text-sm">No transcript available yet.</p>
                  <p className="text-white/40 text-xs mt-1">Transcripts will appear here once the call is processed.</p>
                </div>
              )}
              {transcript.map((t) => (
                <div key={t.id} className={`rounded-lg p-3 ${
                  t.channel === 'agent' 
                    ? 'bg-blue-500/10 border border-blue-500/30' 
                    : 'bg-white/5 border border-white/10'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.channel === 'agent'
                        ? 'bg-blue-500/20 text-blue-200'
                        : 'bg-white/10 text-white/80'
                    }`}>
                      {t.channel === 'agent' ? '🤖 AI Agent' : '👤 Customer'}
                    </span>
                    <span className="text-xs text-white/50">{new Date(t.ts).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">{t.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
