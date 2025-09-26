"use client"

import { hasFeature } from '@shared/plans'
import { usePlan } from '../../../lib/plan'

export default function AnalyticsPage() {
  const { planId } = usePlan()
  const advanced = hasFeature(planId, 'analytics.advanced')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white/90">Analytics</h1>
        <p className="text-white/60 text-sm">Engagement and performance insights.</p>
      </div>

      {!advanced && (
        <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-200 text-sm">
          Advanced analytics are available on Pro plans and above. Upgrade in Billing to unlock funnels and retention.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="text-sm font-medium text-white/85">Usage</div>
          <div className="mt-3 h-40 rounded-lg border border-white/10 bg-white/5" />
        </div>
        <div className="card">
          <div className="text-sm font-medium text-white/85">Top intents</div>
          <div className="mt-3 h-40 rounded-lg border border-white/10 bg-white/5" />
        </div>
        {advanced && (
          <div className="card md:col-span-2">
            <div className="text-sm font-medium text-white/85">Funnels</div>
            <div className="mt-3 h-60 rounded-lg border border-white/10 bg-white/5" />
          </div>
        )}
      </div>
    </div>
  )
}
