'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function DpaPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="relative max-width container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Data Processing Agreement (DPA)</h1>
            <p className="text-gray-700 mb-6">This DPA outlines our commitments as a data processor and your rights as a data controller, including processing instructions, confidentiality, sub-processors, data subject rights assistance, security, breach notifications, and audit rights.</p>
            <div className="space-y-4 text-gray-700">
              <p><strong>Security Measures:</strong> We maintain SOC 2 Type II controls, access controls, encryption in transit and at rest, audit logging, and regular risk assessments.</p>
              <p><strong>Sub-processors:</strong> We maintain an up-to-date list available upon request and will notify you of changes in accordance with the Agreement.</p>
              <p><strong>Data Subject Requests:</strong> We assist with access, rectification, deletion, and portability requests as required under applicable law.</p>
              <p><strong>Breach Notification:</strong> We will notify you without undue delay upon becoming aware of a personal data breach affecting your data.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
