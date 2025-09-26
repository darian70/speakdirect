'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

const steps = [
  { title: 'Discovery & Security Review (Week 0)', items: ['Use-case selection', 'Data flows & systems', 'Security requirements (SOC 2, HIPAA)'] },
  { title: 'Pilot & Success Criteria (Weeks 1-2)', items: ['2-week pilot scope', 'KPIs & baselines', 'Sign-off criteria'] },
  { title: 'Integration & Automations (Weeks 3-4)', items: ['CRM/EMR/ERP integration', 'Workflows & RPA', 'Audit trails & alerts'] },
  { title: 'Training & Handoff (Week 5)', items: ['Playbooks & SOPs', 'Admin training', 'Escalation & support'] },
  { title: 'Scale & Optimize (Ongoing)', items: ['A/B call flows', 'Latency & QoS tuning', 'Quarterly security reviews'] },
]

export default function ImplementationGuidePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Implementation Guide</h1>
            <p className="text-xl text-gray-600">A proven rollout path with security front-and-center</p>
          </motion.div>
          <div className="space-y-6 max-w-3xl mx-auto">
            {steps.map((s) => (
              <div key={s.title} className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <ul className="space-y-2">
                  {s.items.map((i) => (
                    <li key={i} className="flex items-center text-gray-700 text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
