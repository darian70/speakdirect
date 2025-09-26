'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  PhoneIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  LifebuoyIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const phoneAgents = [
  {
    name: 'SmartScheduler Pro',
    description: 'Intelligent appointment booking agent that handles scheduling, rescheduling, and cancellations with natural conversation flow.',
    icon: CalendarDaysIcon,
    features: [
      'Multi-calendar integration (Google, Outlook, Calendly)',
      'Automated confirmation emails and SMS',
      'Conflict detection and alternative suggestions',
      'HIPAA compliant for healthcare practices',
      'Insurance verification capabilities',
      'Pre-visit questionnaire collection'
    ],
    industries: ['Healthcare', 'Legal', 'Professional Services', 'Beauty & Wellness'],
    pricing: 'From $2,500 setup + $299/month',
    color: 'blue',
    metrics: {
      'No-show reduction': '50%',
      'Staff time saved': '15 hours/week',
      'Booking accuracy': '99.2%'
    }
  },
  {
    name: 'QualifyBot Elite',
    description: 'Advanced lead qualification agent that conducts intelligent conversations to score leads and route them to appropriate sales teams.',
    icon: UserGroupIcon,
    features: [
      'Intelligent lead scoring algorithms',
      'CRM integration (HubSpot, Salesforce)',
      'Automated follow-up sequences',
      'Real-time lead alerts to sales team',
      'Custom qualification criteria',
      'Multi-language support'
    ],
    industries: ['Real Estate', 'Insurance', 'B2B Software', 'Financial Services'],
    pricing: 'From $4,500 setup + $499/month',
    color: 'green',
    metrics: {
      'Lead processing': '3x increase',
      'Response time': '< 2 minutes',
      'Qualification accuracy': '85%'
    }
  },
  {
    name: 'SupportGenius 24/7',
    description: 'Comprehensive customer support agent that handles inquiries, troubleshooting, and escalations with empathy and efficiency.',
    icon: LifebuoyIcon,
    features: [
      'Multi-language support (12+ languages)',
      'Knowledge base integration',
      'Ticket creation and tracking',
      'Seamless human agent handoff',
      'Sentiment analysis and escalation',
      'Order status and tracking'
    ],
    industries: ['E-commerce', 'SaaS', 'Service Providers', 'Tech Support'],
    pricing: 'From $3,500 setup + $399/month',
    color: 'purple',
    metrics: {
      'Cost reduction': '80%',
      'Resolution rate': '75%',
      'Customer satisfaction': '4.8/5'
    }
  }
]

const benefits = [
  {
    icon: ClockIcon,
    title: '24/7 Availability',
    description: 'Never miss a call again. Handle inquiries, bookings, and support requests around the clock, even during holidays and weekends.'
  },
  {
    icon: CurrencyDollarIcon,
    title: '80% Cost Reduction',
    description: 'Replace expensive call center staff with AI agents that handle unlimited concurrent calls at a fraction of the cost.'
  },
  {
    icon: ChartBarIcon,
    title: 'Higher Conversion Rates',
    description: 'Consistent, optimized conversations that convert more leads and satisfy more customers with personalized interactions.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise Security',
    description: 'SOC 2 certified, HIPAA compliant, and GDPR ready with end-to-end encryption and audit trails.'
  }
]

const conversationExample = {
  title: 'Live Conversation Example: Healthcare Appointment Booking',
  messages: [
    { speaker: 'AI Agent', message: "Hi! I'm calling from Dr. Smith's office. I understand you'd like to schedule an appointment?" },
    { speaker: 'Patient', message: "Yes, I need a consultation for next week." },
    { speaker: 'AI Agent', message: "Perfect! I have availability Tuesday at 2 PM or Wednesday at 10 AM. Which works better for you?" },
    { speaker: 'Patient', message: "Tuesday at 2 PM sounds good." },
    { speaker: 'AI Agent', message: "Excellent! I've booked you for Tuesday, March 15th at 2 PM. You'll receive a confirmation email shortly. Is there anything specific you'd like to discuss with Dr. Smith?" },
    { speaker: 'Patient', message: "Just a routine check-up." },
    { speaker: 'AI Agent', message: "Perfect! I've noted that in your appointment. Please arrive 15 minutes early for check-in. Is there anything else I can help you with today?" }
  ]
}

const implementationSteps = [
  { step: 1, title: 'Consultation', description: 'Analyze your needs and design custom solution', duration: '1 day' },
  { step: 2, title: 'Setup', description: 'Configure agent with your business logic and integrations', duration: '1-2 days' },
  { step: 3, title: 'Training', description: 'Train agent on your specific processes and scenarios', duration: '1 day' },
  { step: 4, title: 'Testing', description: 'Comprehensive testing with your team\'s feedback', duration: '1 day' },
  { step: 5, title: 'Go Live', description: 'Deploy and monitor with ongoing support', duration: '1 day' }
]

export default function PhoneAgentsPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [agentsRef, agentsInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <PhoneIcon className="w-4 h-4 mr-2" />
                AI Phone Agents • Available 24/7 • Human-Like Conversations
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Phone AI Agents That 
                <span className="text-gradient"> Never Sleep</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Handle appointments, qualify leads, provide customer support, and manage sales calls with AI agents 
                that sound human and deliver results 24/7. <strong className="text-gray-900">Reduce costs by 80% while improving customer satisfaction.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group" data-analytics="cta_click" data-label="phone_agents_hero_demo" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                  Schedule Demo Call
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#solutions" className="btn-outline">
                  View Solutions
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Businesses served</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime guarantee</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">5 Days</div>
                  <div className="text-sm text-gray-600">Implementation</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
                  <PhoneIcon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Live Call in Progress</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Recording</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {conversationExample.messages.slice(0, 4).map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.5 + 1 }}
                        className={`${msg.speaker === 'AI Agent' ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-4`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            msg.speaker === 'AI Agent' ? 'bg-blue-100' : 'bg-gray-200'
                          }`}>
                            <span className={`font-semibold text-sm ${
                              msg.speaker === 'AI Agent' ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              {msg.speaker === 'AI Agent' ? 'AI' : 'P'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-1">{msg.speaker}</div>
                            <p className="text-sm text-gray-900">{msg.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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

      {/* Demo Media */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Watch a Demo</h2>
            <p className="text-xl text-gray-600">See AI Phone Agents in action</p>
          </div>
          <div className="relative overflow-hidden rounded-xl shadow-soft aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0"
              title="AI Phone Agents Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              data-analytics="demo_video_play"
              data-label="phone_agents_demo_iframe"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Phone AI Agents?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your phone operations with intelligent automation that works around the clock
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phone Agents Solutions */}
      <section id="solutions" ref={agentsRef} className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={agentsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Phone AI Agent Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized agents for every phone-based business function, ready to deploy in days
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {phoneAgents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 30 }}
                animate={agentsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card overflow-hidden"
              >
                <div className="lg:flex">
                  <div className="lg:w-2/3 p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        agent.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        agent.color === 'green' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <agent.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {agent.name}
                        </h3>
                        <div className={`text-lg font-semibold ${
                          agent.color === 'blue' ? 'text-blue-600' :
                          agent.color === 'green' ? 'text-green-600' :
                          'text-purple-600'
                        }`}>
                          {agent.pricing}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {agent.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {agent.features.map((feature) => (
                        <div key={feature} className="flex items-start space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="text-sm text-gray-600 font-medium">Perfect for:</span>
                      {agent.industries.map((industry) => (
                        <span key={industry} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {industry}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href="/contact"
                      className="btn-primary"
                    >
                      Get Started
                    </Link>
                  </div>
                  
                  <div className="lg:w-1/3 bg-gray-50 p-8">
                    <h4 className="font-bold text-gray-900 mb-6">Key Metrics</h4>
                    <div className="space-y-6">
                      {Object.entries(agent.metrics).map(([metric, value]) => (
                        <div key={metric}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">{metric}</span>
                            <span className={`text-2xl font-bold ${
                              agent.color === 'blue' ? 'text-blue-600' :
                              agent.color === 'green' ? 'text-green-600' :
                              'text-purple-600'
                            }`}>
                              {value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-white rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">ROI Calculator</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        See your potential savings with {agent.name}
                      </p>
                      <Link 
                        href="/roi-calculator"
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        Calculate ROI →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple 5-Step Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From consultation to go-live in just 5-7 days with full support and training
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8">
            {implementationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  {index < implementationSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {step.description}
                </p>
                <div className="text-xs text-primary-600 font-semibold">
                  {step.duration}
                </div>
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
              Ready to Transform Your Phone Operations?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join 500+ businesses already using our Phone AI Agents to reduce costs, 
              improve customer satisfaction, and never miss another call.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact" className="btn-secondary" data-analytics="cta_click" data-label="phone_agents_bottom_demo" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                Schedule Free Demo
              </Link>
              <Link href="tel:1-800-666-4241" className="btn-outline border-white text-white hover:bg-white hover:text-blue-600">
                Call Us Now: 1-800-666-4241
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                No setup fees for qualified businesses
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                24/7 enterprise support
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
