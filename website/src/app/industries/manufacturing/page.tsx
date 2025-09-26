'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const solutions = [
  {
    name: 'Production Line Scheduling',
    description: 'AI optimizes work order sequencing and resource allocation to minimize downtime and changeovers.',
    icon: Cog6ToothIcon,
    metrics: { 'Throughput increase': '18%', 'Changeover time': '-35%', 'On-time delivery': '+22%' },
    color: 'orange'
  },
  {
    name: 'Maintenance Automation',
    description: 'Predictive maintenance alerts with parts ordering, technician dispatch, and CMMS updates.',
    icon: WrenchScrewdriverIcon,
    metrics: { 'Unplanned downtime': '-40%', 'MTBF': '+28%', 'Maintenance cost': '-20%' },
    color: 'blue'
  },
  {
    name: 'Logistics & Fulfillment',
    description: 'Automate pick-pack-ship tasks, ASN creation, label gen, and carrier bookings with audit trails.',
    icon: TruckIcon,
    metrics: { 'Order accuracy': '99.8%', 'Cycle time': '-30%', 'Chargebacks': '-60%' },
    color: 'green'
  }
]

export default function ManufacturingPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={heroInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
                <Cog6ToothIcon className="w-4 h-4 mr-2" />
                Manufacturing AI • Throughput • Downtime • On-time Delivery
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                AI for Modern Manufacturing
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Boost throughput, reduce downtime, and ship on time with Phone Agents and Backend Automations tailored for factory workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group">
                  Schedule Manufacturing Demo
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#solutions" className="btn-outline">View Solutions</Link>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div><div className="text-2xl font-bold text-orange-600">-40%</div><div className="text-sm text-gray-600">Unplanned downtime</div></div>
                <div><div className="text-2xl font-bold text-orange-600">+18%</div><div className="text-sm text-gray-600">Line throughput</div></div>
                <div><div className="text-2xl font-bold text-orange-600">+22%</div><div className="text-sm text-gray-600">On-time delivery</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={heroInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  {[{label:'OEE', value:'87%'},{label:'Downtime',value:'-40%'},{label:'Orders On-time',value:'98%'}].map((m)=> (
                    <div key={m.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{m.label}</span>
                      <span className="text-2xl font-bold text-orange-600">{m.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Real-time shopfloor metrics</span>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="solutions" className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Manufacturing Solutions</h2>
            <p className="text-xl text-gray-600">Prebuilt blueprints for factory operations</p>
          </div>
          <div className="space-y-10">
            {solutions.map((s) => (
              <div key={s.name} className="card p-6 lg:flex">
                <div className="lg:w-2/3 pr-0 lg:pr-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${s.color==='orange'?'bg-orange-100':s.color==='blue'?'bg-blue-100':'bg-green-100'}`}>
                      <s.icon className={`w-7 h-7 ${s.color==='orange'?'text-orange-600':s.color==='blue'?'text-blue-600':'text-green-600'}`} />
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
                <div className="lg:w-1/3 mt-6 lg:mt-0 bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-4">Quality & Compliance</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4 text-green-600" /> ISO 9001-ready audit trails</li>
                    <li className="flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4 text-green-600" /> Supplier scorecards & alerts</li>
                    <li className="flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4 text-green-600" /> Traceability & recall workflows</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-orange-600 text-white">
        <div className="max-width container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Modernize Your Factory?</h2>
          <p className="text-white/90 mb-6">Start with a 2-week pilot that delivers measurable results.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact" className="btn-secondary" data-analytics="cta_click" data-label="manufacturing_book_pilot" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">Book a Pilot</Link>
            <Link href="/demo" className="btn-outline border-white text-white hover:bg-white hover:text-orange-600" data-analytics="watch_demo_click" data-label="manufacturing_see_demo">See Demo</Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-white/80 text-sm">
            <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1" /> 2-week pilot</span>
            <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1" /> No downtime required</span>
            <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1" /> Enterprise support</span>
          </div>
        </div>
      </section>
    </div>
  )
}
