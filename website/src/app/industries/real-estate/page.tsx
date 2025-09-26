'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  HomeIcon,
  PhoneIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const solutions = [
  {
    name: 'Lead Qualification & Follow-up',
    description: 'Phone Agents qualify inquiries, schedule showings, and send follow-ups automatically to boost conversion rates.',
    icon: PhoneIcon,
    metrics: { 'Lead response time': '< 1 min', 'Appointments booked': '+3.2x', 'No-shows': '-45%' },
    color: 'blue'
  },
  {
    name: 'Listing Intake & Updates',
    description: 'Automate listing intake, document collection, disclosures, and status updates with audit trails.',
    icon: ClipboardDocumentListIcon,
    metrics: { 'Admin time saved': '20 hrs/wk', 'Errors': '-90%', 'Speed to list': '2x faster' },
    color: 'green'
  },
  {
    name: 'Showing Coordination',
    description: 'Automated showing scheduling, reminders, and feedback collection via SMS/voice workflows.',
    icon: CalendarDaysIcon,
    metrics: { 'Time-to-show': '-55%', 'Feedback response': '85%', 'Scheduling conflicts': '-70%' },
    color: 'purple'
  }
]

export default function RealEstatePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={heroInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <HomeIcon className="w-4 h-4 mr-2" />
                Real Estate AI • Faster Deals • Fewer No-Shows
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                AI for Real Estate Teams
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Capture and convert more leads with Phone Agents, and streamline backend operations with automations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group">
                  Schedule Real Estate Demo
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#solutions" className="btn-outline">View Solutions</Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={heroInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  {[{label:'Leads to appt', value:'+3.2x', color:'text-green-600'}, {label:'No-shows', value:'-45%', color:'text-green-600'}, {label:'Response time', value:'< 1m', color:'text-green-600'}].map((m)=> (
                    <div key={m.label} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                      <div className="text-xs text-gray-600">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                  <span className="text-sm text-gray-600">Live conversion metrics</span>
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="solutions" className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Real Estate Solutions</h2>
            <p className="text-xl text-gray-600">Blueprints that increase speed-to-deal</p>
          </div>
          <div className="space-y-10">
            {solutions.map((s) => (
              <div key={s.name} className="card p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${s.color==='blue'?'bg-blue-100':s.color==='green'?'bg-green-100':'bg-purple-100'}`}>
                    <s.icon className={`w-7 h-7 ${s.color==='blue'?'text-blue-600':s.color==='green'?'text-green-600':'text-purple-600'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{s.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{s.description}</p>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  {Object.entries(s.metrics).map(([k,v]) => (
                    <div key={k} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{k}:</span> {v}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link href="/contact" className="btn-primary">Get Started</Link>
                  <Link href="/demo" className="btn-outline">View Demo</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
