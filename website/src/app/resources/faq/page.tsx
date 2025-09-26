'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const faqs = [
  { q: 'How fast can we go live?', a: 'Typical pilot launches in 2 weeks with measurable ROI; full rollout by week 5.' },
  { q: 'What about compliance (SOC 2, HIPAA)?', a: 'We support SOC 2 Type II controls and HIPAA-compliant architectures, with audit trails and BAAs.' },
  { q: 'Can we integrate with our CRM/EMR/ERP?', a: 'Yes. We integrate with Salesforce, HubSpot, Epic/EMR, NetSuite/SAP, and more. Custom connectors supported.' },
  { q: 'Do you support multi-language and accents?', a: 'Yes. Our voice stack supports many locales and robust ASR/TTS for diverse accents.' },
  { q: 'How are calls routed to humans?', a: 'We support warm transfers, voicemail fallback, and configurable escalation rules.' }
]

export default function FAQPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">FAQ</h1>
            <p className="text-xl text-gray-600">Answers to the most common questions</p>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((f, i) => (
              <motion.div key={f.q} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.q}</h3>
                <p className="text-gray-700">{f.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
