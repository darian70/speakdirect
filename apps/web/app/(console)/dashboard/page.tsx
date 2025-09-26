"use client"

import Link from 'next/link'
import { usePlan } from '../../../lib/plan'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white/90">{value}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { plan } = usePlan()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Dashboard</h1>
          <p className="text-white/60 text-sm">Welcome back. Here's your snapshot.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/agents" className="btn-secondary">Browse agents</Link>
          <Link href="/technicians" className="btn-primary">Click-to-call</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Active agents" value={plan.id === 'starter' ? '1' : plan.id === 'growth' ? '3' : '8+'} />
        <Stat label="Messages this month" value={plan.quota?.messages ? `${plan.quota.messages}` : '—'} />
        <Stat label="Minutes this month" value={plan.quota?.minutes ? `${plan.quota.minutes}` : '—'} />
        <Stat label="SLA" value={plan.id === 'enterprise' ? '99.99%' : '99.9%'} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium text-white/85">Quick actions</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Link href="/agents" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10">Create agent</Link>
            <Link href="/settings" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10">Organization settings</Link>
            <Link href="/billing" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10">Manage billing</Link>
            <Link href="/analytics" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10">View analytics</Link>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium text-white/85">Getting started</div>
          <ol className="mt-3 space-y-2 text-sm text-white/70 list-decimal list-inside">
            <li>Pick a template in Agents</li>
            <li>Connect CRM and helpdesk (Pro+)</li>
            <li>Enable phone or SMS channels</li>
            <li>Invite your team</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
