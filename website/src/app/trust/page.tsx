'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheckIcon, DocumentTextIcon, UserGroupIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'

export default function TrustCenterPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="relative max-width container-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Trust Center
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Security, Privacy, and Compliance</h1>
            <p className="text-gray-700 mb-6">We build and operate with security first. Review our controls, legal docs, and subprocessors.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><CheckBadgeIcon className="w-5 h-5 text-green-600 mr-2"/> Certifications & Controls</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>SOC 2 Type II control alignment</li>
                <li>Encryption in transit and at rest</li>
                <li>Least-privilege access controls</li>
                <li>Audit logging and monitoring</li>
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><DocumentTextIcon className="w-5 h-5 text-blue-600 mr-2"/> Legal Documents</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li><Link href="/legal/security" className="text-primary-600 font-semibold">Security Overview →</Link></li>
                <li><Link href="/legal/privacy-policy" className="text-primary-600 font-semibold">Privacy Policy →</Link></li>
                <li><Link href="/legal/terms-of-service" className="text-primary-600 font-semibold">Terms of Service →</Link></li>
                <li><Link href="/legal/dpa" className="text-primary-600 font-semibold">Data Processing Agreement →</Link></li>
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center"><UserGroupIcon className="w-5 h-5 text-purple-600 mr-2"/> Subprocessors</h3>
              <p className="text-sm text-gray-700 mb-3">We maintain an up-to-date list of subprocessors used to deliver the service. For a current list, contact support.</p>
              <Link href="/contact" className="text-primary-600 font-semibold">Request Subprocessor List →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
