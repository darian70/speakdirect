'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const papers = [
  { title: 'Voice AI for Call Centers in 2025', summary: 'Latency, LLM selection, speech pipelines, and compliance design patterns.', href: '#'},
  { title: 'Operationalizing Backend Automations', summary: 'SLAs, retries, idempotency, audit trails, and observability.', href: '#'},
  { title: 'Healthcare AI: HIPAA and PHI-by-Design', summary: 'Architectures and controls for HIPAA-compliant AI.', href: '#'},
]

export default function WhitepapersPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">White Papers</h1>
            <p className="text-xl text-gray-600">In-depth technical & business research</p>
          </motion.div>
          <div className="space-y-6 max-w-3xl mx-auto">
            {papers.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
                    <DocumentTextIcon className="w-7 h-7 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{p.title}</h3>
                    <p className="text-gray-600 mb-4">{p.summary}</p>
                    <Link href={p.href} className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700">
                      Read Paper
                      <ArrowRightIcon className="w-5 h-5 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
