'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function AutomotiveIndustryPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Automotive Technicians</h1>
            <p className="text-xl text-gray-600">One-click client calling and automated follow-ups for service bays and mobile techs.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[{
              title: 'One-Click Callbacks',
              desc: 'From your dashboard, ring the client instantly and bridge the call through your business line.'
            }, {
              title: 'Missed Call Rescue',
              desc: 'Automatically call back missed calls, confirm availability, and schedule service windows.'
            }, {
              title: 'Smart Workflows',
              desc: 'Log outcomes to CRM, send SMS estimates, and follow-up reminders automatically.'
            }].map((b) => (
              <div key={b.title} className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">Talk to Sales</Link>
            <Link href="/agents" className="btn-outline">Explore Phone Agents</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
