"use client"

import { hasFeature } from '@shared/plans'
import { usePlan } from '../../../lib/plan'

export default function SettingsPage() {
  const { planId } = usePlan()
  const sso = hasFeature(planId, 'security.sso')
  const audit = hasFeature(planId, 'security.audit_logs')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white/90">Organization settings</h1>
        <p className="text-white/60 text-sm">Manage branding, authentication, and security.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="text-sm font-medium text-white/85">Branding</div>
          <div className="mt-3 space-y-3">
            <label className="block text-sm">Organization name</label>
            <input className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40" placeholder="Acme Inc." />
            <label className="block text-sm">Primary color</label>
            <input type="color" className="h-10 w-16 rounded border border-white/10 bg-white/5" defaultValue="#10b981" />
          </div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-white/85">Authentication</div>
          {!sso && (
            <div className="mt-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-200 text-sm">SSO is available on Pro plans and above.</div>
          )}
          <div className="mt-3 space-y-3">
            <label className="block text-sm">SSO Provider</label>
            <select className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white">
              <option>None</option>
              <option disabled={!sso}>Okta</option>
              <option disabled={!sso}>Azure AD</option>
              <option disabled={!sso}>Google Workspace</option>
            </select>
          </div>
        </div>
        <div className="card md:col-span-2">
          <div className="text-sm font-medium text-white/85">Security</div>
          {!audit && (
            <div className="mt-2 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-200 text-sm">Audit logs are available on Pro plans and above.</div>
          )}
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-white/20 bg-white/10" defaultChecked />
              Enforce 2FA
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-white/20 bg-white/10" defaultChecked={audit} disabled={!audit} />
              Capture audit logs
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-white/20 bg-white/10" />
              Limit PII in transcripts
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
