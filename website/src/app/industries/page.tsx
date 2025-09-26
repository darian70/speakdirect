'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const industries = [
  { name: 'Healthcare', href: '/industries/healthcare', emoji: '🏥', blurb: 'HIPAA-compliant scheduling, records, and patient support.' },
  { name: 'Legal Services', href: '/industries/legal', emoji: '⚖️', blurb: 'Client intake, contract processing, and compliance workflows.' },
  { name: 'Financial Services', href: '/industries/financial-services', emoji: '💰', blurb: 'Compliant service, KYC ops, and reporting automations.' },
  { name: 'E-commerce', href: '/industries/ecommerce', emoji: '🛒', blurb: 'Order support, returns, and fulfillment automations.' },
  { name: 'Real Estate', href: '/industries/real-estate', emoji: '🏠', blurb: 'Lead qualification, showing coordination, and listing ops.' },
  { name: 'Manufacturing', href: '/industries/manufacturing', emoji: '🏭', blurb: 'Production, maintenance, and logistics automations.' },
  { name: 'Automotive', href: '/industries/automotive', emoji: '🚗', blurb: 'Click-to-call for technicians, missed-call callbacks, and service workflows.' },
  { name: 'Professional Services', href: '/industries/professional-services', emoji: '💼', blurb: 'Client intake, document workflows, and follow-up.' }
]

export default function IndustriesIndexPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Industries</h1>
            <p className="text-xl text-gray-600">Prebuilt blueprints for your vertical</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((i, idx) => (
              <motion.div key={i.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.05 }} className="card p-6">
                <div className="text-3xl mb-2">{i.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{i.name}</h3>
                <p className="text-gray-600 mb-4">{i.blurb}</p>
                <Link href={i.href} className="text-primary-600 font-semibold hover:text-primary-700">Explore {i.name} →</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
