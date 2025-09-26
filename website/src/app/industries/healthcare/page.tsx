'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  HeartIcon, 
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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const healthcareSolutions = [
  {
    name: 'Patient Appointment Scheduling',
    description: 'HIPAA-compliant AI phone agents that handle appointment booking, rescheduling, and cancellations with insurance verification.',
    icon: CalendarDaysIcon,
    features: [
      'Insurance verification and pre-authorization',
      'Multi-provider scheduling coordination',
      'Automated appointment reminders',
      'Pre-visit questionnaire collection',
      'EHR system integration',
      'HIPAA compliance and audit trails'
    ],
    metrics: {
      'No-show reduction': '50%',
      'Staff time saved': '25 hours/week',
      'Patient satisfaction': '4.9/5'
    },
    color: 'blue'
  },
  {
    name: 'Medical Records Processing',
    description: 'AI-powered document processing that extracts patient data, medical codes, and insurance information with 99.8% accuracy.',
    icon: DocumentTextIcon,
    features: [
      'Medical terminology recognition',
      'ICD-10 and CPT code extraction',
      'Insurance claim processing',
      'Lab result digitization',
      'Prescription data extraction',
      'PHI protection and encryption'
    ],
    metrics: {
      'Processing speed': '20x faster',
      'Accuracy rate': '99.8%',
      'Cost reduction': '80%'
    },
    color: 'green'
  },
  {
    name: 'Patient Support Chatbot',
    description: 'Web-based AI assistant that provides 24/7 patient support, symptom checking, and healthcare information.',
    icon: HeartIcon,
    features: [
      'Symptom assessment and triage',
      'Medication reminders and info',
      'Appointment scheduling assistance',
      'Healthcare provider directory',
      'Insurance coverage verification',
      'Multilingual patient support'
    ],
    metrics: {
      'Patient engagement': '3x increase',
      'Support ticket reduction': '70%',
      'Response time': '< 5 seconds'
    },
    color: 'purple'
  }
]

const complianceFeatures = [
  {
    title: 'HIPAA Compliance',
    description: 'Full healthcare data protection with encrypted processing, secure storage, and comprehensive audit trails.',
    icon: ShieldCheckIcon,
    details: [
      'End-to-end encryption',
      'Access controls and authentication',
      'Audit logging and monitoring',
      'Business Associate Agreements (BAA)',
      'Risk assessments and safeguards',
      'Breach notification procedures'
    ]
  },
  {
    title: 'SOC 2 Type II Certified',
    description: 'Rigorous security controls and processes audited by third-party security firms.',
    icon: CheckCircleIcon,
    details: [
      'Security control frameworks',
      'Availability and processing integrity',
      'Confidentiality protections',
      'Privacy safeguards',
      'Annual security audits',
      'Continuous monitoring'
    ]
  }
]

const healthcareStats = [
  { metric: '50%', description: 'Reduction in no-show rates', icon: CalendarDaysIcon },
  { metric: '80%', description: 'Lower administrative costs', icon: CurrencyDollarIcon },
  { metric: '99.8%', description: 'Medical record accuracy', icon: DocumentTextIcon },
  { metric: '24/7', description: 'Patient support availability', icon: ClockIcon },
  { metric: '25hrs', description: 'Staff time saved weekly', icon: UserGroupIcon },
  { metric: '4.9/5', description: 'Patient satisfaction score', icon: HeartIcon }
]

const useCases = [
  {
    title: 'Hospitals & Health Systems',
    description: 'Large-scale patient management, multi-department coordination, and enterprise-grade compliance.',
    challenges: [
      'High patient volume management',
      'Complex scheduling across departments',
      'Insurance verification delays',
      'Staff burnout and turnover'
    ],
    solutions: [
      'Automated patient intake and scheduling',
      'Real-time insurance verification',
      'Multi-provider coordination',
      'Staff workload optimization'
    ]
  },
  {
    title: 'Private Practices',
    description: 'Streamlined operations for small to medium practices with cost-effective automation solutions.',
    challenges: [
      'Limited administrative staff',
      'Manual appointment scheduling',
      'Paper-based record keeping',
      'Patient communication gaps'
    ],
    solutions: [
      '24/7 automated scheduling',
      'Digital record processing',
      'Patient communication automation',
      'Cost-effective AI solutions'
    ]
  },
  {
    title: 'Specialty Clinics',
    description: 'Specialized AI solutions for dermatology, cardiology, orthopedics, and other medical specialties.',
    challenges: [
      'Specialized scheduling requirements',
      'Complex medical terminology',
      'Referral management',
      'Equipment scheduling coordination'
    ],
    solutions: [
      'Specialty-trained AI agents',
      'Medical terminology processing',
      'Automated referral routing',
      'Resource scheduling optimization'
    ]
  }
]

const testimonial = {
  quote: "SpeakDirect transformed our patient scheduling process. We've reduced no-shows by 50% and our staff can now focus on patient care instead of administrative tasks. The HIPAA compliance gives us complete peace of mind.",
  author: "Dr. Sarah Chen",
  title: "Chief Medical Officer",
  organization: "Metro Health Partners",
  image: "/testimonials/dr-chen.jpg"
}

const roi = {
  title: "Healthcare ROI Calculator",
  subtitle: "See your potential savings with AI automation",
  metrics: [
    { label: "Current monthly appointments", value: "1,200", input: true },
    { label: "No-show rate reduction", value: "50%", calculated: true },
    { label: "Staff hours saved per week", value: "25", calculated: true },
    { label: "Monthly cost savings", value: "$8,500", calculated: true },
    { label: "Annual ROI", value: "340%", calculated: true }
  ]
}

export default function HealthcarePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [solutionsRef, solutionsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [complianceRef, complianceInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [useCasesRef, useCasesInView] = useInView({ threshold: 0.1, triggerOnce: true })

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
                <HeartIcon className="w-4 h-4 mr-2" />
                Healthcare AI • HIPAA Compliant • 99.8% Accuracy
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Healthcare AI That 
                <span className="text-gradient"> Puts Patients First</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your healthcare operations with HIPAA-compliant AI solutions that reduce no-shows by 50%, 
                save 25+ staff hours weekly, and improve patient satisfaction. <strong className="text-gray-900">Trusted by 200+ healthcare providers nationwide.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group" data-analytics="cta_click" data-label="healthcare_hero_demo" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                  Schedule Healthcare Demo
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#solutions" className="btn-outline">
                  View Solutions
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-blue-600">200+</div>
                  <div className="text-sm text-gray-600">Healthcare providers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">HIPAA</div>
                  <div className="text-sm text-gray-600">Compliant</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">50%</div>
                  <div className="text-sm text-gray-600">No-show reduction</div>
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
                  <HeartIcon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Healthcare Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Live</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {healthcareStats.map((stat, index) => (
                      <motion.div
                        key={stat.description}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + 1 }}
                        className="text-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <stat.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{stat.metric}</div>
                        <div className="text-xs text-gray-600">{stat.description}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Real-time healthcare metrics</span>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Healthcare Solutions */}
      <section id="solutions" ref={solutionsRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Healthcare AI Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HIPAA-compliant AI solutions designed specifically for healthcare providers and patient care
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {healthcareSolutions.map((solution, index) => (
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
                          HIPAA Compliant • SOC 2 Certified
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
                        Healthcare Demo
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 bg-gray-50 p-8">
                    <h4 className="font-bold text-gray-900 mb-6">Healthcare Metrics</h4>
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
                          <ShieldCheckIcon className="w-4 h-4 mr-2" />
                          HIPAA Compliant
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                          <ShieldCheckIcon className="w-4 h-4 mr-2" />
                          SOC 2 Type II
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                          <ShieldCheckIcon className="w-4 h-4 mr-2" />
                          BAA Available
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
              Healthcare Compliance & Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with the highest security standards to protect patient data and ensure regulatory compliance
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
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-red-600" />
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

      {/* Use Cases */}
      <section ref={useCasesRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Healthcare Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored solutions for different types of healthcare organizations and their unique challenges
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {useCase.description}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mr-2" />
                      Common Challenges
                    </h4>
                    <ul className="space-y-2">
                      {useCase.challenges.map((challenge) => (
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
                      Our Solutions
                    </h4>
                    <ul className="space-y-2">
                      {useCase.solutions.map((solution) => (
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

      {/* Testimonial */}
      <section className="section-padding bg-blue-600 text-white">
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
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <HeartIcon className="w-8 h-8 text-white" />
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

      {/* ROI Calculator */}
      <section className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {roi.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {roi.subtitle}
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <div className="space-y-6">
                {roi.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-gray-700 font-medium">{metric.label}</span>
                    <span className={`text-xl font-bold ${
                      metric.calculated ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {metric.value}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Link href="/contact" className="btn-primary">
                  Get Detailed ROI Analysis
                </Link>
              </div>
            </div>
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
              Ready to Transform Your Healthcare Operations?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join 200+ healthcare providers already using our HIPAA-compliant AI solutions to improve patient care, 
              reduce costs, and streamline operations. Start with a free consultation today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact" className="btn-secondary" data-analytics="cta_click" data-label="healthcare_bottom_demo" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                Schedule Healthcare Demo
              </Link>
              <Link href="tel:1-800-666-4241" className="btn-outline border-white text-white hover:bg-white hover:text-blue-600">
                Call Healthcare Specialist
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                HIPAA compliant from day one
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                BAA included at no extra cost
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                24/7 healthcare support
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
