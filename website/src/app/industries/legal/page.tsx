'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  ScaleIcon, 
  PhoneIcon, 
  DocumentTextIcon, 
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const legalSolutions = [
  {
    name: 'Legal Intake Automation',
    description: 'AI-powered client intake system that qualifies leads, schedules consultations, and collects case information 24/7.',
    icon: PhoneIcon,
    features: [
      'Automated lead qualification',
      'Case type identification',
      'Conflict of interest checking',
      'Consultation scheduling',
      'Client information collection',
      'Attorney-client privilege protection'
    ],
    metrics: {
      'Lead conversion': '45% increase',
      'Response time': '< 2 minutes',
      'Staff time saved': '30 hours/week'
    },
    color: 'blue'
  },
  {
    name: 'Contract Analysis AI',
    description: 'Advanced document processing that reviews contracts, extracts key terms, identifies risks, and ensures compliance.',
    icon: DocumentTextIcon,
    features: [
      'Contract clause extraction',
      'Risk assessment and scoring',
      'Compliance verification',
      'Deadline and renewal tracking',
      'Version comparison analysis',
      'Legal precedent integration'
    ],
    metrics: {
      'Review speed': '20x faster',
      'Risk detection': '95% accuracy',
      'Cost reduction': '70%'
    },
    color: 'green'
  },
  {
    name: 'Legal Research Assistant',
    description: 'AI-powered research tool that analyzes case law, statutes, and legal precedents to support case preparation.',
    icon: MagnifyingGlassIcon,
    features: [
      'Case law analysis',
      'Statute interpretation',
      'Precedent identification',
      'Citation verification',
      'Legal brief generation',
      'Multi-jurisdiction support'
    ],
    metrics: {
      'Research time': '80% reduction',
      'Citation accuracy': '99.5%',
      'Case preparation': '5x faster'
    },
    color: 'purple'
  }
]

const practiceAreas = [
  {
    area: 'Personal Injury',
    description: 'Streamline client intake, case evaluation, and settlement negotiations.',
    challenges: [
      'High volume of initial inquiries',
      'Case merit evaluation',
      'Medical record processing',
      'Settlement calculations'
    ],
    solutions: [
      'Automated case screening',
      'Medical record analysis',
      'Settlement value estimation',
      'Client communication automation'
    ]
  },
  {
    area: 'Corporate Law',
    description: 'Automate contract review, compliance monitoring, and due diligence processes.',
    challenges: [
      'Complex contract analysis',
      'Regulatory compliance tracking',
      'Due diligence documentation',
      'Multi-party coordination'
    ],
    solutions: [
      'Contract risk assessment',
      'Compliance monitoring alerts',
      'Due diligence checklists',
      'Stakeholder communication'
    ]
  },
  {
    area: 'Family Law',
    description: 'Sensitive client handling with automated scheduling and document preparation.',
    challenges: [
      'Emotional client situations',
      'Complex custody arrangements',
      'Financial disclosure processing',
      'Court filing deadlines'
    ],
    solutions: [
      'Empathetic client communication',
      'Custody schedule optimization',
      'Financial analysis automation',
      'Deadline tracking and alerts'
    ]
  },
  {
    area: 'Real Estate Law',
    description: 'Streamline property transactions, title searches, and closing processes.',
    challenges: [
      'Title search complexity',
      'Multiple party coordination',
      'Document preparation volume',
      'Closing timeline management'
    ],
    solutions: [
      'Automated title analysis',
      'Transaction coordination',
      'Document generation',
      'Timeline management'
    ]
  }
]

const complianceFeatures = [
  {
    title: 'Attorney-Client Privilege',
    description: 'Strict confidentiality protections with encrypted communications and secure data handling.',
    icon: ShieldCheckIcon,
    details: [
      'End-to-end encryption',
      'Privileged communication protection',
      'Secure client portals',
      'Access control management'
    ]
  },
  {
    title: 'Bar Association Compliance',
    description: 'Adherence to professional conduct rules and ethical guidelines across all jurisdictions.',
    icon: ScaleIcon,
    details: [
      'Professional conduct compliance',
      'Ethical guideline adherence',
      'Multi-jurisdiction support',
      'Regular compliance audits'
    ]
  }
]

const legalStats = [
  { metric: '45%', description: 'Increase in lead conversion', icon: ChartBarIcon },
  { metric: '70%', description: 'Reduction in review costs', icon: CurrencyDollarIcon },
  { metric: '20x', description: 'Faster contract analysis', icon: DocumentTextIcon },
  { metric: '24/7', description: 'Client intake availability', icon: ClockIcon },
  { metric: '30hrs', description: 'Staff time saved weekly', icon: UserGroupIcon },
  { metric: '95%', description: 'Risk detection accuracy', icon: ShieldCheckIcon }
]

const testimonial = {
  quote: "SpeakDirect revolutionized our client intake process. We're now capturing leads 24/7 and our attorneys can focus on high-value legal work instead of administrative tasks. The ROI has been exceptional.",
  author: "Michael Rodriguez, Esq.",
  title: "Managing Partner",
  organization: "Rodriguez & Associates",
  image: "/testimonials/michael-rodriguez.jpg"
}

const caseStudy = {
  title: "Personal Injury Firm Increases Conversions by 45%",
  firm: "Johnson & Smith Law",
  challenge: "Missing potential clients due to after-hours calls and slow response times during peak periods.",
  solution: "Implemented 24/7 AI intake system with case qualification and automatic attorney routing.",
  results: [
    "45% increase in lead conversion rate",
    "90% reduction in response time",
    "30 hours/week saved in administrative work",
    "$150K additional monthly revenue"
  ]
}

export default function LegalPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [solutionsRef, solutionsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [practiceRef, practiceInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [complianceRef, complianceInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
                <ScaleIcon className="w-4 h-4 mr-2" />
                Legal AI • Bar Compliant • 45% Higher Conversions
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Legal AI That 
                <span className="text-gradient"> Scales Justice</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your legal practice with AI solutions that capture more clients, accelerate case work, 
                and ensure compliance. <strong className="text-gray-900">Increase lead conversions by 45% while reducing costs by 70%.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group" data-analytics="cta_click" data-label="legal_hero_demo" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                  Schedule Legal Demo
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#solutions" className="btn-outline">
                  View Solutions
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">500+</div>
                  <div className="text-sm text-gray-600">Law firms served</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">45%</div>
                  <div className="text-sm text-gray-600">Conversion increase</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">24/7</div>
                  <div className="text-sm text-gray-600">Client intake</div>
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
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center">
                  <ScaleIcon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Legal Practice Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {legalStats.map((stat, index) => (
                      <motion.div
                        key={stat.description}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + 1 }}
                        className="text-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <stat.icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-2xl font-bold text-indigo-600">{stat.metric}</div>
                        <div className="text-xs text-gray-600">{stat.description}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Real-time legal metrics</span>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Legal Solutions */}
      <section id="solutions" ref={solutionsRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Legal AI Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized AI tools designed for legal professionals with built-in compliance and ethical safeguards
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {legalSolutions.map((solution, index) => (
              <motion.div
                key={solution.name}
                initial={{ opacity: 0, y: 30 }}
                animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card overflow-hidden"
              >
                <div className="lg:flex">
                  <div className="lg:w-2/3 p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        solution.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        solution.color === 'green' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <solution.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {solution.name}
                        </h3>
                        <div className="text-sm text-gray-600 font-medium">
                          Bar Compliant • Attorney-Client Privilege Protected
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {solution.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {solution.features.map((feature) => (
                        <div key={feature} className="flex items-start space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-4">
                      <Link 
                        href="/contact"
                        className="btn-primary"
                      >
                        Get Started
                      </Link>
                      <Link 
                        href="/demo"
                        className="btn-outline"
                      >
                        Legal Demo
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 bg-gray-50 p-8">
                    <h4 className="font-bold text-gray-900 mb-6">Legal Metrics</h4>
                    <div className="space-y-6">
                      {Object.entries(solution.metrics).map(([metric, value]) => (
                        <div key={metric}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">{metric}</span>
                            <span className={`text-2xl font-bold ${
                              solution.color === 'blue' ? 'text-blue-600' :
                              solution.color === 'green' ? 'text-green-600' :
                              'text-purple-600'
                            }`}>
                              {value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-white rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">Compliance</h5>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-green-600">
                          <ScaleIcon className="w-4 h-4 mr-2" />
                          Bar Association Compliant
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                          <ShieldCheckIcon className="w-4 h-4 mr-2" />
                          Attorney-Client Privilege
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Ethical Guidelines
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section ref={practiceRef} className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={practiceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Practice Area Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized AI solutions tailored to the unique needs of different legal practice areas
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {practiceAreas.map((area, index) => (
              <motion.div
                key={area.area}
                initial={{ opacity: 0, y: 30 }}
                animate={practiceInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {area.area}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {area.description}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mr-2" />
                      Common Challenges
                    </h4>
                    <ul className="space-y-2">
                      {area.challenges.map((challenge) => (
                        <li key={challenge} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                      AI Solutions
                    </h4>
                    <ul className="space-y-2">
                      {area.solutions.map((solution) => (
                        <li key={solution} className="text-sm text-gray-600 flex items-start">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Story
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from legal professionals using our AI solutions
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="card p-8 lg:p-12"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {caseStudy.title}
                </h3>
                <div className="text-lg text-indigo-600 font-semibold mb-6">
                  {caseStudy.firm}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                    <p className="text-gray-600">{caseStudy.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
                    <p className="text-gray-600">{caseStudy.solution}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Results</h4>
                <div className="space-y-4">
                  {caseStudy.results.map((result, index) => (
                    <motion.div
                      key={result}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg"
                    >
                      <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">{result}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Section */}
      <section ref={complianceRef} className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={complianceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Legal Compliance & Ethics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with legal professionals in mind, ensuring full compliance with bar association rules and ethical guidelines
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {complianceFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={complianceInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card p-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-3">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-indigo-600 text-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-2xl lg:text-3xl font-light leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center">
                  <ScaleIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-lg">{testimonial.author}</div>
                  <div className="text-white/90">{testimonial.title}</div>
                  <div className="text-white/80 text-sm">{testimonial.organization}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-indigo-600 text-white">
        <div className="max-width container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Legal Practice?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join 500+ law firms already using our AI solutions to capture more clients, 
              accelerate case work, and increase profitability. Start with a free consultation today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact" className="btn-secondary" data-analytics="cta_click" data-label="legal_bottom_demo" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                Schedule Legal Demo
              </Link>
              <Link href="tel:1-800-666-4241" className="btn-outline border-white text-white hover:bg-white hover:text-indigo-600">
                Call Legal Specialist
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Bar association compliant
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Attorney-client privilege protected
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Free consultation included
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
