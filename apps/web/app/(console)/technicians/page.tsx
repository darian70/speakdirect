'use client'

import { useState, FormEvent } from 'react'
import { usePlan } from '../../../lib/plan'
import { hasFeature } from '@shared/plans'

type WorkOrder = {
  customerName: string
  customerPhone: string
  vehicleInfo: string
  servicePerformed: string
  totalCost: string
  notes: string
  requiresApproval: boolean
}

export default function TechniciansPage() {
  const { planId } = usePlan()
  const canVoice = hasFeature(planId, 'channels.voice')
  
  const [workOrder, setWorkOrder] = useState<WorkOrder>({
    customerName: '',
    customerPhone: '',
    vehicleInfo: '',
    servicePerformed: '',
    totalCost: '',
    notes: '',
    requiresApproval: false,
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [callHistory, setCallHistory] = useState<any[]>([])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!canVoice) {
      setMessage({ type: 'error', text: 'Voice calling requires Growth plan or above. Please upgrade.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // Format phone number to E.164 if needed
      let phone = workOrder.customerPhone.trim()
      if (!phone.startsWith('+')) {
        // Assume US number if no country code
        phone = '+1' + phone.replace(/\D/g, '')
      }

      const res = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientNumber: phone,
          meta: {
            workOrder: {
              customerName: workOrder.customerName,
              vehicleInfo: workOrder.vehicleInfo,
              servicePerformed: workOrder.servicePerformed,
              totalCost: workOrder.totalCost,
              notes: workOrder.notes,
              requiresApproval: workOrder.requiresApproval,
            },
          },
        }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to initiate call')
      }

      setMessage({ 
        type: 'success', 
        text: `Call initiated successfully! Call SID: ${data.sid}` 
      })
      
      // Add to call history
      setCallHistory(prev => [{
        id: data.sid,
        customerName: workOrder.customerName,
        customerPhone: phone,
        timestamp: new Date().toISOString(),
        status: 'initiated'
      }, ...prev])

      // Reset form
      setWorkOrder({
        customerName: '',
        customerPhone: '',
        vehicleInfo: '',
        servicePerformed: '',
        totalCost: '',
        notes: '',
        requiresApproval: false,
      })
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to initiate call' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white/90">Technician Portal</h1>
        <p className="text-white/60 text-sm">Complete work orders and notify customers via AI phone call</p>
      </div>

      {/* Plan Warning */}
      {!canVoice && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-200">Upgrade Required</h3>
              <p className="text-sm text-yellow-200/80 mt-1">
                Voice calling is available on Growth plans and above. Upgrade in Billing to enable this feature.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Work Order Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-medium text-white/90 mb-4">Customer Work Order</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1">
              Customer Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={workOrder.customerName}
              onChange={(e) => setWorkOrder(prev => ({ ...prev, customerName: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
              placeholder="John Smith"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1">
              Customer Phone <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              required
              value={workOrder.customerPhone}
              onChange={(e) => setWorkOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
              placeholder="+15551234567 or 5551234567"
            />
            <p className="text-xs text-white/50 mt-1">Include country code or we'll assume US (+1)</p>
          </div>

          {/* Vehicle Info */}
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1">
              Vehicle Information <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={workOrder.vehicleInfo}
              onChange={(e) => setWorkOrder(prev => ({ ...prev, vehicleInfo: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
              placeholder="2018 Honda Accord"
            />
          </div>

          {/* Total Cost */}
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1">
              Total Cost <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={workOrder.totalCost}
              onChange={(e) => setWorkOrder(prev => ({ ...prev, totalCost: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
              placeholder="$450.00"
            />
          </div>

          {/* Service Performed - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/85 mb-1">
              Service Performed <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={workOrder.servicePerformed}
              onChange={(e) => setWorkOrder(prev => ({ ...prev, servicePerformed: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none resize-none"
              placeholder="Oil change, brake pad replacement, tire rotation"
            />
          </div>

          {/* Additional Notes - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/85 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={workOrder.notes}
              onChange={(e) => setWorkOrder(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none resize-none"
              placeholder="Any additional information for the customer"
            />
          </div>

          {/* Requires Approval Checkbox */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={workOrder.requiresApproval}
                onChange={(e) => setWorkOrder(prev => ({ ...prev, requiresApproval: e.target.checked }))}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="text-sm text-white/85">Requires customer approval before pickup</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={loading || !canVoice}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              loading || !canVoice
                ? 'bg-white/20 text-white/40 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calling Customer...
              </span>
            ) : (
              '📞 Call Customer Now'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setWorkOrder({
              customerName: '',
              customerPhone: '',
              vehicleInfo: '',
              servicePerformed: '',
              totalCost: '',
              notes: '',
              requiresApproval: false,
            })}
            className="px-4 py-2.5 rounded-lg font-medium border border-white/10 text-white/80 hover:bg-white/5 transition-colors"
          >
            Clear Form
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 rounded-lg p-4 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30 text-green-200'
              : 'bg-red-500/10 border border-red-500/30 text-red-200'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}
      </form>

      {/* Call History */}
      {callHistory.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white/90 mb-4">Recent Calls</h2>
          <div className="space-y-3">
            {callHistory.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <div className="text-sm font-medium text-white/85">{call.customerName}</div>
                  <div className="text-xs text-white/60">{call.customerPhone} • {new Date(call.timestamp).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-200">
                    {call.status}
                  </span>
                  <a 
                    href={`/calls/${call.id}`}
                    className="text-xs text-white/70 hover:text-white hover:underline"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-medium text-white/85 mb-3">How It Works</h3>
        <ol className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/80 text-xs font-medium flex-shrink-0">1</span>
            <span>Fill out the work order with customer and vehicle details</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/80 text-xs font-medium flex-shrink-0">2</span>
            <span>Our AI agent calls the customer with a professional update</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/80 text-xs font-medium flex-shrink-0">3</span>
            <span>Customer approves charges or asks questions naturally</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-white/80 text-xs font-medium flex-shrink-0">4</span>
            <span>Call transcript and outcome logged automatically</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
