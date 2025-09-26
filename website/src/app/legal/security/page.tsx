'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const controls = [
  { title: 'SOC 2 Type II', details: ['Change management', 'Access controls', 'Audit logging', 'Vulnerability management'] },
  { title: 'HIPAA Readiness', details: ['PHI encryption', 'BAA available', 'Minimum necessary', 'Breach notification'] },
  { title: 'Network & App Security', details: ['WAF & DDoS', 'CSP & SRI', 'Dependency scanning', 'Static builds available'] },
  { title: 'Data Protection', details: ['Encryption at rest & in transit', 'Backups & DR', 'Key management', 'Data retention'] },
  { title: 'Privacy', details: ['Role-based access', 'Data subject requests', 'Regional hosting options'] },
]

export default function SecurityOverviewPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="relative max-width container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Security & Compliance
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Security Overview</h1>
            <p className="text-gray-700 mb-6">Security is foundational. We align with SOC 2 Type II controls and build HIPAA-ready architectures, offering encryption by default, audit trails, and static-export options for hardened deployments.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {controls.map((c) => (
                <div key={c.title} className="card p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{c.title}</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {c.details.map((d) => (
                      <li key={d} className="flex items-center"><CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" /> {d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
