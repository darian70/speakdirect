"use client"

import { useEffect, useState } from 'react'
import type { PlanId, PlanDefinition } from '@shared/plans'
import { PLANS } from '@shared/plans'

const STORAGE_KEY = 'oa_plan_id'

export function usePlan(): { planId: PlanId; plan: PlanDefinition } {
  const [planId, setPlanId] = useState<PlanId>('starter')
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as PlanId | null
      const envDefault = (process.env.NEXT_PUBLIC_DEFAULT_PLAN_ID as PlanId | undefined) || 'starter'
      const initial = saved && PLANS[saved] ? saved : envDefault
      setPlanId(initial)
    } catch {
      setPlanId('starter')
    }
  }, [])
  return { planId, plan: PLANS[planId] }
}

export function setPlan(plan: PlanId) {
  if (!PLANS[plan]) return
  try { localStorage.setItem(STORAGE_KEY, plan) } catch {}
}
