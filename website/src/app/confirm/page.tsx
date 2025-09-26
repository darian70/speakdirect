'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { confirmLead } from '@/lib/omni/api'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function ConfirmPage() {
  const search = useSearchParams()
  const token = useMemo(() => search.get('token') || '', [search])
  const [loading, setLoading] = useState<boolean>(!!token)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)
  const [leadName, setLeadName] = useState<string>('')
  const [leadEmail, setLeadEmail] = useState<string>('')

  useEffect(() => {
    let mounted = true
    async function run() {
      if (!token) {
        setError('Missing token')
        setLoading(false)
        return
      }
      try {
        const res = await confirmLead(token)
        if (!mounted) return
        if (res.ok && res.confirmed) {
          setOk(true)
          setLeadName(res.lead?.name || '')
          setLeadEmail(res.lead?.email || '')
          setError(null)
        } else {
          setError(res.error || 'Confirmation failed')
        }
      } catch (e: any) {
        setError(e?.message || 'Network error')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [token])

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-24">
      <div className="max-w-xl w-full px-6">
        {loading ? (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-6 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-gray-600">Confirming your email…</p>
          </div>
        ) : ok ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Email confirmed</h1>
            <p className="text-gray-600 mb-6">Thanks {leadName ? leadName.split(' ')[0] : 'there'}! We confirmed {leadEmail || 'your address'}.</p>
            <div className="flex gap-3 justify-center">
              <a className="btn-primary" href="/contact">Book a consultation</a>
              <a className="btn-secondary" href="/case-studies">View case studies</a>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-10 h-10 text-yellow-700" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Couldn’t confirm email</h1>
            <p className="text-gray-600 mb-6">{error || 'The confirmation link may be invalid or expired.'}</p>
            <div className="flex gap-3 justify-center">
              <a className="btn-secondary" href="/contact">Try again</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
