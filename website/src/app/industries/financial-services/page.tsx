'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  ShieldCheckIcon, 
  BanknotesIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const financialSolutions = [
  {
    title: 'Customer Service Automation',
    description: 'AI-powered chatbots and phone agents for account inquiries, transaction support, and general banking assistance.',
    features: [
      'Account balance and transaction history',
      'Payment processing and transfers',
      'Card activation and replacement',
      'Fraud alert notifications',
      'Multi-language support'
    ],
    icon: UserGroupIcon,
    compliance: ['PCI DSS', 'SOX', 'FFIEC']
  },
  {
    title: 'Loan Processing Automation',
    description: 'Streamline loan applications, credit assessments, and approval workflows with intelligent document processing.',
    features: [
      'Automated document verification',
      'Credit score analysis',
      'Risk assessment algorithms',
      'Compliance checking',
      'Decision workflow automation'
    ],
    icon: DocumentTextIcon,
    compliance: ['Fair Credit Reporting Act', 'Equal Credit Opportunity Act']
  },
  {
    title: 'Fraud Detection & Prevention',
    description: 'Real-time transaction monitoring and fraud detection using advanced AI algorithms and pattern recognition.',
    features: [
      'Real-time transaction analysis',
      'Behavioral pattern recognition',
      'Risk scoring algorithms',
      'Automated alert systems',
      'Investigation workflow automation'
    ],
    icon: ShieldCheckIcon,
    compliance: ['BSA/AML', 'OFAC', 'KYC']
  },
  {
    title: 'Regulatory Compliance Automation',
    description: 'Automated compliance monitoring, reporting, and documentation to meet financial industry regulations.',
    features: [
      'Automated regulatory reporting',
      'Compliance monitoring dashboards',
      'Audit trail generation',
      'Policy enforcement automation',
      'Risk management workflows'
    ],
    icon: LockClosedIcon,
    compliance: ['Dodd-Frank', 'MiFID II', 'Basel III']
  }
]

const financialStats = [
  { label: 'Cost Reduction', value: '45%', description: 'Average operational cost savings' },
  { label: 'Processing Speed', value: '80%', description: 'Faster loan processing times' },
  { label: 'Fraud Detection', value: '95%', description: 'Accuracy in fraud identification' },
  { label: 'Compliance Rate', value: '99.9%', description: 'Regulatory compliance adherence' }
]

const useCases = [
  {
    title: 'Retail Banking',
    description: 'Automated customer service, account management, and transaction processing for retail banking operations.',
    benefits: [
      '24/7 customer support availability',
      'Reduced wait times for customers',
      'Consistent service quality',
      'Lower operational costs'
    ],
    icon: BanknotesIcon
  },
  {
    title: 'Investment Services',
    description: 'AI-powered portfolio management, market analysis, and client communication for investment firms.',
    benefits: [
      'Automated portfolio rebalancing',
      'Real-time market analysis',
      'Client communication automation',
      'Regulatory compliance monitoring'
    ],
    icon: ChartBarIcon
  },
  {
    title: 'Insurance Processing',
    description: 'Streamlined claims processing, underwriting automation, and customer service for insurance companies.',
    benefits: [
      'Faster claims processing',
      'Automated underwriting decisions',
      'Fraud detection capabilities',
      'Improved customer satisfaction'
    ],
    icon: ShieldCheckIcon
  },
  {
    title: 'Credit Unions',
    description: 'Member-focused AI solutions for credit unions including loan processing and member services.',
    benefits: [
      'Personalized member experiences',
      'Efficient loan processing',
      'Community-focused service',
      'Cost-effective operations'
    ],
    icon: UserGroupIcon
  }
]

const complianceFeatures = [
  {
    standard: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard compliance for secure payment processing',
    features: ['Encrypted data transmission', 'Secure payment processing', 'Access control measures']
  },
  {
    standard: 'SOX Compliance',
    description: 'Sarbanes-Oxley Act compliance for financial reporting and internal controls',
    features: ['Audit trail maintenance', 'Internal control monitoring', 'Financial reporting accuracy']
  },
  {
    standard: 'FFIEC Guidelines',
    description: 'Federal Financial Institutions Examination Council compliance for banking operations',
    features: ['Risk management frameworks', 'Cybersecurity standards', 'Operational resilience']
  },
  {
    standard: 'BSA/AML',
    description: 'Bank Secrecy Act and Anti-Money Laundering compliance for financial institutions',
    features: ['Transaction monitoring', 'Suspicious activity reporting', 'Customer due diligence']
  }
]

const testimonials = [
  {
    quote: "SpeakDirect's AI solutions helped us reduce loan processing time by 75% while maintaining full regulatory compliance. The ROI was evident within the first quarter.",
    author: "Sarah Chen",
    title: "Chief Technology Officer",
    company: "Metropolitan Credit Union",
    savings: "$2.3M annually"
  },
  {
    quote: "The fraud detection capabilities are exceptional. We've seen a 90% reduction in false positives while catching more actual fraud attempts than ever before.",
    author: "Michael Rodriguez",
    title: "Risk Management Director",
    company: "First National Bank",
    savings: "$5.1M in prevented fraud"
  },
  {
    quote: "Customer satisfaction scores increased by 40% after implementing the AI customer service agents. Our members love the 24/7 availability and instant responses.",
    author: "Jennifer Park",
    title: "VP of Member Services",
    company: "Community Financial Group",
    savings: "40% increase in satisfaction"
  }
]

export default function FinancialServicesPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [solutionsRef, solutionsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [useCasesRef, useCasesInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <BanknotesIcon className="w-4 h-4 mr-2" />
              Financial Services • Compliant • Secure • Scalable
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI Solutions for <span className="text-green-600">Financial Services</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Transform your financial institution with AI-powered automation that ensures regulatory 
              compliance, enhances security, and delivers exceptional customer experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/contact" className="btn-primary">
                Schedule Compliance Demo
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/solutions" className="btn-secondary">
                View All Solutions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="section-padding bg-white border-b border-gray-200">
        <div className="max-width container-padding">
          <div className="grid md:grid-cols-4 gap-8">
            {financialStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stat.value}
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
              Comprehensive Financial AI Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built AI solutions designed specifically for financial institutions 
              with built-in compliance and security features
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {financialSolutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card p-8"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <solution.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {solution.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Compliant with:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {solution.compliance.map((standard) => (
                      <span key={standard} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section ref={useCasesRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Industry Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored solutions for different types of financial institutions
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <useCase.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {useCase.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {useCase.description}
                </p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center space-x-3">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Regulatory Compliance Built-In
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our solutions are designed with financial regulations in mind, ensuring 
              your institution remains compliant while benefiting from AI automation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {complianceFeatures.map((compliance, index) => (
              <motion.div
                key={compliance.standard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {compliance.standard}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {compliance.description}
                </p>
                
                <ul className="space-y-2">
                  {compliance.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Financial Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how financial institutions are transforming their operations with our AI solutions
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {testimonial.savings}
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.title}
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="section-padding bg-blue-50">
        <div className="max-width container-padding">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LockClosedIcon className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bank-Grade Security & Compliance
            </h2>
            
            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
              Our AI solutions are built with the highest security standards, featuring end-to-end encryption, 
              multi-factor authentication, and comprehensive audit trails. We maintain SOC 2 Type II certification 
              and undergo regular security assessments to ensure your data remains protected.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">SOC 2 Type II</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">ISO 27001</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">PCI DSS Level 1</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">FFIEC Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-width container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Financial Institution?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Schedule a compliance-focused demo to see how our AI solutions can help you 
            reduce costs, improve efficiency, and maintain regulatory compliance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-white">
              Schedule Compliance Demo
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/legal/privacy-policy" className="btn-outline-white">
              Review Security & Privacy
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
