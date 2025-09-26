export type PlanId = 'starter' | 'growth' | 'pro' | 'enterprise'

export type FeatureKey =
  | 'agents.count'
  | 'channels.voice'
  | 'channels.chat'
  | 'channels.sms'
  | 'integrations.crm'
  | 'integrations.helpdesk'
  | 'security.sso'
  | 'security.audit_logs'
  | 'analytics.basic'
  | 'analytics.advanced'

export type PlanDefinition = {
  id: PlanId
  name: string
  monthlyPrice: number | 'custom'
  quota?: {
    messages?: number
    minutes?: number
  }
  features: Partial<Record<FeatureKey, boolean>>
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 499,
    quota: { messages: 2000, minutes: 500 },
    features: {
      'agents.count': true,
      'channels.chat': true,
      'analytics.basic': true,
    },
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 1499,
    quota: { messages: 10000, minutes: 2000 },
    features: {
      'agents.count': true,
      'channels.chat': true,
      'channels.voice': true,
      'integrations.crm': true,
      'analytics.basic': true,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 3999,
    quota: { messages: 25000, minutes: 5000 },
    features: {
      'agents.count': true,
      'channels.chat': true,
      'channels.voice': true,
      'channels.sms': true,
      'integrations.crm': true,
      'integrations.helpdesk': true,
      'security.sso': true,
      'security.audit_logs': true,
      'analytics.basic': true,
      'analytics.advanced': true,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 'custom',
    features: {
      'agents.count': true,
      'channels.chat': true,
      'channels.voice': true,
      'channels.sms': true,
      'integrations.crm': true,
      'integrations.helpdesk': true,
      'security.sso': true,
      'security.audit_logs': true,
      'analytics.basic': true,
      'analytics.advanced': true,
    },
  },
}

export function hasFeature(plan: PlanId, feature: FeatureKey): boolean {
  const def = PLANS[plan]
  return !!def?.features?.[feature]
}

export function quotaFor(plan: PlanId): NonNullable<PlanDefinition['quota']> {
  const def = PLANS[plan]
  return def.quota || { messages: Infinity, minutes: Infinity }
}
