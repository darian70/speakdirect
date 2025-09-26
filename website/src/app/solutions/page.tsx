'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { PhoneIcon, Cog6ToothIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const solutions = [
  {
    name: 'AI Phone Agents',
    href: '/solutions/phone-agents',
    description: 'Inbound/outbound voice: booking, qualification, and support with CRM integration and compliance.',
    icon: PhoneIcon,
    color: 'blue'
  },
  {
    name: 'Backend Automations',
    href: '/solutions/backend-automations',
    description: 'Low-latency orchestration, CRM/RPA integrations, audit trails, and SOC 2/HIPAA-grade compliance.',
    icon: Cog6ToothIcon,
    color: 'orange'
  },
]

export default function SolutionsHubPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="relative max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Solutions</h1>
            <p className="text-xl text-gray-600">Deploy high-ROI AI systems fast: Phone Agents and Backend Automations</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {solutions.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card p-6 flex items-start gap-4"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                  <s.icon className={`w-7 h-7 ${s.color === 'blue' ? 'text-blue-600' : 'text-orange-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{s.name}</h3>
                  <p className="text-gray-600 mb-4">{s.description}</p>
                  <Link href={s.href} className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700">
                    Explore {s.name}
                    <ArrowRightIcon className="w-5 h-5 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
