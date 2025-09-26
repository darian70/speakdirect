'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  PhoneIcon, 
  Cog6ToothIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const solutions = [
  {
    name: 'AI Phone Agents',
    description: 'Inbound/outbound voice that books appointments, qualifies leads, and supports customers with natural conversation.',
    icon: PhoneIcon,
    href: '/solutions/phone-agents',
    features: ['24/7 availability', 'Natural conversation', 'CRM integration', 'Multi-language support'],
    color: 'blue'
  },
  {
    name: 'Backend Automations',
    description: 'Low-latency orchestration that syncs data, triggers workflows, and enforces SOC 2/HIPAA-grade compliance.',
    icon: Cog6ToothIcon,
    href: '/solutions/workflow-automation',
    features: ['CRM synchronization', 'RPA & integrations', 'Data validation', 'Audit trails'],
    color: 'orange'
  }
]

const industries = [
  { name: 'Healthcare', href: '/industries/healthcare', icon: '🏥', description: 'HIPAA-compliant patient scheduling and support' },
  { name: 'Legal Services', href: '/industries/legal', icon: '⚖️', description: 'Client intake and document processing automation' },
  { name: 'Real Estate', href: '/industries/real-estate', icon: '🏠', description: 'Lead qualification and property inquiry handling' },
  { name: 'Financial Services', href: '/industries/financial', icon: '💰', description: 'Compliant customer service and document processing' },
  { name: 'E-commerce', href: '/industries/ecommerce', icon: '🛒', description: 'Order support and customer service automation' },
  { name: 'Manufacturing', href: '/industries/manufacturing', icon: '🏭', description: 'Supply chain and customer communication automation' }
]

const stats = [
  { label: 'Cost Reduction', value: '80%', description: 'Average operational cost savings' },
  { label: 'Implementation Time', value: '5 Days', description: 'From contract to go-live' },
  { label: 'Customer Satisfaction', value: '4.8/5', description: 'Average client rating' },
  { label: 'ROI Timeline', value: '3-6 Months', description: 'Typical payback period' }
]

const testimonials = [
  {
    content: "SpeakDirect reduced our no-show rate from 28% to 12% in just 30 days. The AI handles all our appointment scheduling and insurance verification, freeing up our staff to focus on patient care.",
    author: "Dr. Sarah Chen",
    role: "Medical Director",
    company: "Metro Family Clinic",
    avatar: "SC"
  },
  {
    content: "The AI lead qualification system has been a game-changer. We're processing 3x more leads with the same staff, and our response time went from hours to minutes.",
    author: "Michael Rodriguez",
    role: "Managing Partner",
    company: "Rodriguez & Associates Law",
    avatar: "MR"
  },
  {
    content: "Our customer support costs dropped by 75% while satisfaction scores increased. The AI handles 80% of inquiries automatically, and customers love the instant responses.",
    author: "Jennifer Park",
    role: "VP of Operations",
    company: "TechGear Direct",
    avatar: "JP"
  }
]

export default function HomePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [solutionsRef, solutionsInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-black dark:to-black"></div>
        <div className="relative max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6 dark:bg-white/10 dark:text-white">
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                SOC 2 Certified • HIPAA Compliant • Enterprise Ready
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                AI Phone Agents that 
                <span className="text-gradient"> Book, Qualify, and Support</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Deploy enterprise-grade voice automation plus backend orchestration—24/7, across every industry.
                <strong className="text-gray-900"> See ROI in 30 days.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group" data-analytics="cta_click" data-label="home_hero_demo" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                  Schedule Free Demo
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/solutions/phone-agents" className="btn-outline group" data-analytics="watch_demo_click" data-label="home_watch_demo">
                  <PlayCircleIcon className="w-5 h-5 mr-2" />
                  Watch Demo Video
                </Link>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  5-day implementation
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  No long-term contracts
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  24/7 support included
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 dark:bg-white/5 dark:border-white/10">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center">
                  <PhoneIcon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Live AI Agent Demo</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Online</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 dark:bg-white/5">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center dark:bg-white/10">
                          <span className="text-primary-600 font-semibold text-sm">AI</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">"Hi! I'm calling from Dr. Smith's office. I understand you'd like to schedule an appointment?"</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-primary-50 rounded-lg p-4 dark:bg-white/5">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center dark:bg-white/10">
                          <span className="text-gray-600 font-semibold text-sm">P</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">"Yes, I need a consultation next week."</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 dark:bg-white/5">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center dark:bg-white/10">
                          <span className="text-primary-600 font-semibold text-sm">AI</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">"Perfect! I have availability Tuesday at 2 PM or Wednesday at 10 AM. Which works better for you?"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Appointment booked automatically</span>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Proven Results Across Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join 500+ businesses already transforming their operations with AI automation
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
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

      {/* Solutions Section */}
      <section ref={solutionsRef} className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Complete AI Automation Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to automate your business operations, from customer interactions to back-office processes
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.name}
                initial={{ opacity: 0, y: 30 }}
                animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-hover p-8"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    solution.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    solution.color === 'green' ? 'bg-green-100 text-green-600' :
                    solution.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <solution.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {solution.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {solution.description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {solution.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  href={solution.href}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
                >
                  Learn more
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Specialized Solutions by Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-specific AI agents designed for your unique business requirements and compliance needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={industry.href} className="card-hover p-6 block group">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl">{industry.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {industry.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {industry.description}
                  </p>
                  <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-semibold text-sm">
                    Explore solutions
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-lg font-semibold text-gray-900">4.8/5</span>
              <span className="text-gray-600">from 200+ reviews</span>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
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
              Join hundreds of businesses already saving time and money with AI automation. 
              Get started with a free consultation and see results in days, not months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact" className="btn-secondary" data-analytics="cta_click" data-label="home_bottom_demo" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                Schedule Free Demo
              </Link>
              <Link href="/pricing" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                View Pricing Plans
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                5-day implementation
              </div>
              <div className="flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                ROI guarantee
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Enterprise security
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
