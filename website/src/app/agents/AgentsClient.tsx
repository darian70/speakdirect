'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  Bot,
  Phone,
  Mail,
  MessageSquare,
  Headphones,
  Calendar,
  Database,
  Shield,
  Building2,
  ShoppingCart,
  Hotel,
  Stethoscope,
  GraduationCap,
  Truck,
  Wrench,
  GitBranch,
  Mic,
  CreditCard,
  Home as HomeIcon,
  LayoutTemplate,
} from 'lucide-react'

type Vertical = { label: string; icon: LucideIcon }

type Agent = {
  name: string
  desc: string
  channels: string[]
  caps: string[]
  vertical: string
  icon: LucideIcon
}

const channels = [
  'Voice',
  'Phone IVR',
  'SMS',
  'Email',
  'Chat/Web',
  'WhatsApp',
  'Slack',
  'Teams',
  'API',
]

const verticals: Vertical[] = [
  { label: 'E‑commerce', icon: ShoppingCart },
  { label: 'Real Estate', icon: HomeIcon },
  { label: 'Hospitality', icon: Hotel },
  { label: 'Healthcare', icon: Stethoscope },
  { label: 'Education', icon: GraduationCap },
  { label: 'Logistics', icon: Truck },
  { label: 'Field Services', icon: Wrench },
  { label: 'SaaS / B2B', icon: Building2 },
]

const agentsSeed: Agent[] = [
  { name: 'Sales Agent', desc: 'Conversational seller across web, SMS, and voice with CRM sync and payment links.', channels: ['Voice', 'SMS', 'Chat/Web', 'Email'], caps: ['Lead qual', 'Product Q&A', 'Order links', 'CRM'], vertical: 'E‑commerce', icon: Bot },
  { name: 'Support Agent', desc: '24/7 tier‑1 support with RAG over your docs, ticket deflection, and handoff.', channels: ['Chat/Web', 'Email', 'Slack'], caps: ['RAG', 'Ticket triage', 'Macros', 'Escalation'], vertical: 'SaaS / B2B', icon: Headphones },
  { name: 'Booking Agent', desc: 'Calendar scheduling over voice and chat with reschedule and reminders.', channels: ['Voice', 'SMS', 'Chat/Web'], caps: ['Calendar', 'Reminders', 'Payments'], vertical: 'Hospitality', icon: Calendar },
  { name: 'Phone IVR', desc: 'Natural IVR with call routing, verification, and intent capture.', channels: ['Phone IVR', 'Voice'], caps: ['DTMF', 'Intent', 'Routing'], vertical: 'SaaS / B2B', icon: Phone },
  { name: 'Lead Enrichment', desc: 'Prospect research, enrichment, and first‑touch outreach from signals.', channels: ['Email', 'Slack'], caps: ['Scrape', 'Enrich', 'Sequence'], vertical: 'SaaS / B2B', icon: Database },
  { name: 'Returns Agent', desc: 'Automates returns, exchanges, and status checks across channels.', channels: ['Chat/Web', 'Email', 'SMS'], caps: ['RMA', 'Labels', 'Refunds'], vertical: 'E‑commerce', icon: ShoppingCart },
  { name: 'Concierge', desc: 'Property guest messaging, check‑in, FAQ, and upsells.', channels: ['SMS', 'WhatsApp', 'Chat/Web'], caps: ['FAQ', 'Upsell', 'Local tips'], vertical: 'Hospitality', icon: Hotel },
  { name: 'Ops Copilot', desc: 'Internal automations over Slack: approvals, inventory, and daily reports.', channels: ['Slack', 'Teams'], caps: ['Approvals', 'Inventory', 'Reports'], vertical: 'Field Services', icon: GitBranch },
  { name: 'Docs QA', desc: 'RAG knowledge bot with sources, citations, and feedback loop.', channels: ['Chat/Web', 'Slack', 'Teams'], caps: ['RAG', 'Citations', 'Feedback'], vertical: 'SaaS / B2B', icon: Database },
  { name: 'Collections Agent', desc: 'Friendly payment collections and plan setup over SMS and phone.', channels: ['SMS', 'Voice'], caps: ['Pay links', 'Plans', 'Follow‑ups'], vertical: 'SaaS / B2B', icon: CreditCard },
  { name: 'Patient Intake', desc: 'Appointment intake, form capture, and reminders with audit trail.', channels: ['SMS', 'Email', 'Chat/Web'], caps: ['Forms', 'HIPAA guard', 'Reminders'], vertical: 'Healthcare', icon: Stethoscope },
  { name: 'Support Voice', desc: 'Real‑time phone support with knowledge search and summary to ticket.', channels: ['Voice', 'Phone IVR'], caps: ['Search', 'Summaries', 'Ticket'], vertical: 'SaaS / B2B', icon: Mic },
]

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ')
}

function filterAgents(q: string, channel: string | null, vert: string | null) {
  const ql = (q || '').toLowerCase()
  return agentsSeed.filter((a) => {
    const matchQ = !ql || [a.name, a.desc, a.vertical, a.caps.join(' ')].join(' ').toLowerCase().includes(ql)
    const matchC = !channel || a.channels.includes(channel)
    const matchV = !vert || a.vertical === vert
    return matchQ && matchC && matchV
  })
}

export default function AgentsClient() {
  const [q, setQ] = useState('')
  const [channel, setChannel] = useState<string | null>(null)
  const [vert, setVert] = useState<string | null>(null)

  const filtered = useMemo(() => filterAgents(q, channel, vert), [q, channel, vert])

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">Agent Catalog</h1>
        <p className="text-lg text-gray-600 dark:text-white/90">Search, filter, and pick a starting point. We tailor to your workflow.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search agents"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 md:max-w-sm dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/60"
        />
        <div className="flex flex-wrap gap-2">
          <Pill active={!channel} onClick={() => setChannel(null)}>All channels</Pill>
          {channels.map((c) => (
            <Pill key={c} active={channel === c} onClick={() => setChannel(c)}>{c}</Pill>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill active={!vert} onClick={() => setVert(null)}>All industries</Pill>
        {verticals.map((v) => (
          <Pill key={v.label} active={vert === v.label} onClick={() => setVert(v.label)}>{v.label}</Pill>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <div key={a.name} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-white/10 dark:bg-white/5">
                  <a.icon className="h-5 w-5 text-gray-800 dark:text-white/90" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{a.name}</div>
                  <div className="text-xs text-gray-600 dark:text-white/80">{a.vertical}</div>
                </div>
              </div>
              <Link href="/contact" className="btn-outline text-xs py-1 px-2">Try</Link>
            </div>
            <p className="mt-3 text-sm text-gray-700 dark:text-white/90">{a.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {a.channels.map((c) => (
                <span key={c} className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-white/90">{c}</span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {a.caps.map((c) => (
                <span key={c} className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700 dark:bg-white/5 dark:text-white/85">{c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <Feature icon={LayoutTemplate} title="Templates first" desc="Start from a proven template and tune policies." />
          </div>
          <div className="card p-6">
            <Feature icon={GitBranch} title="Workflow orchestration" desc="Compose tools, data, and human steps." />
          </div>
          <div className="card p-6">
            <Feature icon={Shield} title="Compliance" desc="SSO, data residency options, and access controls." />
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link href="/contact" className="btn-primary">Request scoping call</Link>
        </div>
      </div>
    </div>
  )
}

function Pill({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'rounded-full border px-3 py-1 text-xs transition',
        active ? 'border-primary-200 bg-primary-50 text-primary-700 dark:border-white/20 dark:bg-white/10 dark:text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:hover:bg-white/10'
      )}
    >
      {children}
    </button>
  )
}

function Feature({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-white/10 dark:bg-white/5">
        <Icon className="h-5 w-5 text-gray-800 dark:text-white/90" />
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900 dark:text-white">{title}</div>
        <div className="text-xs text-gray-600 dark:text-white/80">{desc}</div>
      </div>
    </div>
  )
}
