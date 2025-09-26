import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — SpeakDirect',
  description: 'Transparent, usage-based pricing with simple setup fees and a low monthly base for upkeep.',
}

const plans = [
  {
    name: 'Starter Plan',
    setup: '$350 one-time setup fee + $0.08/minute',
    features: [
      '1 phone number',
      '1 AI phone agent',
      'Basic industry templates',
      'Small knowledge base',
      'Call transcripts & summaries',
    ],
  },
  {
    name: 'Growth Plan',
    setup: '$400 one-time setup fee + $0.08/minute',
    features: [
      'Multiple agents',
      'Advanced routing (after-hours, overflow, transfers)',
      'CRM integrations (HubSpot, Pipedrive)',
      'Calendar integrations (Google, Outlook)',
      'Larger knowledge base',
    ],
  },
  {
    name: 'Pro Plan',
    setup: '$450 one-time setup fee + $0.08/minute',
    features: [
      'Multiple agents',
      'Fully custom scripts & flows',
      'Multilingual support',
      'Priority support',
      'Custom integrations (tailored to your business systems)',
      'Analytics dashboard',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="section-padding">
      <div className="max-width container-padding">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">Pricing</h1>
          <p className="text-lg text-gray-600 dark:text-white/90">Usage-based pricing with simple setup fees. Base upkeep is a flat monthly fee.</p>
        </div>

        {/* Base Fee */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Base Fee</h2>
          <p className="mt-2 text-gray-700 dark:text-white/85">$10/month – flat upkeep & maintenance</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-white/80">Custom flows or new interfaces (e.g., car ready status, industry-specific tools) are priced separately.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className="card p-6 flex flex-col">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</div>
              <div className="mt-2 text-base font-medium text-gray-900 dark:text-white">{p.setup}</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-white/85">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-white/60" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Link href="/contact" className="btn-primary w-full justify-center">Get started</Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-white/85">
          Telephony and LLM minutes are billed at cost based on your provider. Bring-your-own provider supported.
        </p>
      </div>
    </div>
  )
}
