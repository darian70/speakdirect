'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  RocketLaunchIcon, 
  LightBulbIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  ChartBarIcon,
  HeartIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

const stats = [
  { number: '2019', label: 'Founded', description: 'Started with a vision to democratize AI' },
  { number: '500+', label: 'Clients Served', description: 'Businesses transformed worldwide' },
  { number: '50M+', label: 'Interactions', description: 'AI conversations processed monthly' },
  { number: '99.9%', label: 'Uptime', description: 'Enterprise-grade reliability' },
  { number: '24/7', label: 'Support', description: 'Always here when you need us' },
  { number: '15+', label: 'Industries', description: 'Specialized solutions across sectors' }
]

const values = [
  {
    icon: LightBulbIcon,
    title: 'Innovation First',
    description: 'We push the boundaries of what\'s possible with AI, constantly exploring new technologies and methodologies to deliver cutting-edge solutions.',
    color: 'yellow'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Trust & Security',
    description: 'Security and compliance are built into everything we do. We protect your data with enterprise-grade encryption and industry certifications.',
    color: 'green'
  },
  {
    icon: UserGroupIcon,
    title: 'Customer Success',
    description: 'Your success is our success. We work as an extension of your team to ensure you achieve measurable results and ROI.',
    color: 'blue'
  },
  {
    icon: HeartIcon,
    title: 'Human-Centered AI',
    description: 'We believe AI should augment human capabilities, not replace them. Our solutions are designed to empower people and improve experiences.',
    color: 'red'
  }
]

// timeline removed per content policy

// Leadership team section removed per content policy

const certifications = [
  { name: 'SOC 2 Type II', description: 'Security and compliance certification' },
  { name: 'HIPAA Compliant', description: 'Healthcare data protection standards' },
  { name: 'GDPR Ready', description: 'European data privacy compliance' },
  { name: 'ISO 27001', description: 'Information security management' }
]

export default function AboutPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [valuesRef, valuesInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <RocketLaunchIcon className="w-4 h-4 mr-2" />
              About SpeakDirect • Trusted by 500+ Enterprises • Since 2019
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              We're Building the 
              <span className="text-gradient"> Future of Work</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              SpeakDirect is the leading provider of enterprise AI automation solutions, trusted by 500+ businesses 
              to transform their operations, reduce costs, and scale efficiently. <strong className="text-gray-900">We process 50+ million 
              AI interactions monthly with 99.9% uptime.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/contact" className="btn-primary group">
                Partner With Us
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
            </div>
          </motion.div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-2xl text-gray-700 leading-relaxed mb-8">
                To democratize enterprise AI and empower every business to achieve more through intelligent automation.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that AI should be accessible, trustworthy, and transformative. Our platform makes it possible 
                for businesses of all sizes to harness the power of artificial intelligence without the complexity, 
                cost, or technical barriers that have traditionally limited adoption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our culture
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    value.color === 'yellow' ? 'bg-yellow-100' :
                    value.color === 'green' ? 'bg-green-100' :
                    value.color === 'blue' ? 'bg-blue-100' :
                    'bg-red-100'
                  }`}>
                    <value.icon className={`w-8 h-8 ${
                      value.color === 'yellow' ? 'text-yellow-600' :
                      value.color === 'green' ? 'text-green-600' :
                      value.color === 'blue' ? 'text-blue-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline removed */}

      

      {/* Certifications */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trust & Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade security and compliance certifications you can trust
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {cert.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {cert.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-blue-600 text-white">
        <div className="max-width container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join 500+ enterprises already using SpeakDirect to automate operations, 
              reduce costs, and scale efficiently. Let's build the future together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact" className="btn-secondary">
                Start Your Journey
              </Link>
              
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Enterprise-grade security
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                99.9% uptime guarantee
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                24/7 expert support
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
