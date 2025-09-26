'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { DocumentTextIcon, CalculatorIcon, QuestionMarkCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const items = [
  { name: 'Case Studies', href: '/case-studies', description: 'Real-world ROI and deployments across industries.', icon: DocumentTextIcon },
  { name: 'ROI Calculator', href: '/roi-calculator', description: 'Estimate savings from Phone Agents and Automations.', icon: CalculatorIcon },
  { name: 'White Papers', href: '/resources/whitepapers', description: 'In-depth technical and business insights.', icon: DocumentTextIcon },
  { name: 'Implementation Guide', href: '/resources/implementation', description: 'Timeline, roles, and security for rollout.', icon: DocumentTextIcon },
  { name: 'FAQ', href: '/resources/faq', description: 'Answers to common questions and objections.', icon: QuestionMarkCircleIcon },
]

export default function ResourcesHubPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="relative max-width container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Resources</h1>
            <p className="text-xl text-gray-600">Proof, tooling, and guidance to launch quickly</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it, i) => (
              <motion.div key={it.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
                    <it.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{it.name}</h3>
                    <p className="text-gray-600 mb-4">{it.description}</p>
                    <Link href={it.href} className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700">
                      Open {it.name}
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
