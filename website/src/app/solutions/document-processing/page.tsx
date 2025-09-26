'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  DocumentTextIcon, 
  DocumentArrowUpIcon, 
  MagnifyingGlassIcon, 
  DocumentCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  EyeIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'

const documentSolutions = [
  {
    name: 'IntelliExtract Pro',
    description: 'Advanced document processing AI that extracts, validates, and organizes data from any document type with 99.5% accuracy.',
    icon: DocumentArrowUpIcon,
    features: [
      'OCR and handwriting recognition',
      'Multi-format support (PDF, Word, Excel, Images)',
      'Intelligent field extraction',
      'Data validation and verification',
      'Automated workflow routing',
      'HIPAA and SOX compliance'
    ],
    industries: ['Healthcare', 'Finance', 'Insurance', 'Legal'],
    pricing: 'From $3,500 setup + $599/month',
    color: 'blue',
    metrics: {
      'Processing speed': '10x faster',
      'Accuracy rate': '99.5%',
      'Cost reduction': '85%'
    }
  },
  {
    name: 'ContractGenius AI',
    description: 'Specialized contract analysis and management system that reviews, extracts key terms, and identifies risks automatically.',
    icon: DocumentCheckIcon,
    features: [
      'Contract clause extraction',
      'Risk assessment and scoring',
      'Compliance checking',
      'Renewal date tracking',
      'Version comparison',
      'Legal term glossary integration'
    ],
    industries: ['Legal', 'Real Estate', 'Procurement', 'HR'],
    pricing: 'From $4,500 setup + $799/month',
    color: 'green',
    metrics: {
      'Review time': '90% reduction',
      'Risk detection': '95% accuracy',
      'Contract processing': '50x faster'
    }
  },
  {
    name: 'MedRecords AI',
    description: 'Healthcare-focused document processing that handles medical records, insurance forms, and patient data with full HIPAA compliance.',
    icon: DocumentTextIcon,
    features: [
      'Medical terminology recognition',
      'Insurance form processing',
      'Patient data extraction',
      'ICD-10 code mapping',
      'EHR system integration',
      'Audit trail and compliance'
    ],
    industries: ['Healthcare', 'Medical Billing', 'Insurance', 'Pharmaceuticals'],
    pricing: 'From $5,000 setup + $899/month',
    color: 'purple',
    metrics: {
      'Processing accuracy': '99.8%',
      'Time savings': '20 hours/day',
      'Error reduction': '95%'
    }
  }
]

const benefits = [
  {
    icon: ClockIcon,
    title: '10x Faster Processing',
    description: 'Process thousands of documents in minutes instead of days, with consistent accuracy and zero fatigue.'
  },
  {
    icon: CurrencyDollarIcon,
    title: '85% Cost Reduction',
    description: 'Eliminate manual data entry costs and reduce processing expenses while improving accuracy and speed.'
  },
  {
    icon: ChartBarIcon,
    title: '99.5% Accuracy',
    description: 'Advanced AI algorithms ensure higher accuracy than manual processing with built-in validation and error detection.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise Compliance',
    description: 'Built-in compliance for HIPAA, SOX, GDPR with complete audit trails and secure data handling.'
  }
]

const processingFlow = [
  {
    step: 1,
    title: 'Document Upload',
    description: 'Drag & drop, email, API, or bulk upload documents in any format',
    icon: CloudArrowUpIcon
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'Advanced OCR and NLP extract and validate all relevant data points',
    icon: EyeIcon
  },
  {
    step: 3,
    title: 'Data Extraction',
    description: 'Structured data output with confidence scores and validation flags',
    icon: DocumentArrowUpIcon
  },
  {
    step: 4,
    title: 'System Integration',
    description: 'Seamless integration with your existing CRM, ERP, or database systems',
    icon: DocumentCheckIcon
  }
]

const documentTypes = [
  { type: 'Invoices & Receipts', accuracy: '99.7%', volume: '10K+/day' },
  { type: 'Contracts & Agreements', accuracy: '99.2%', volume: '5K+/day' },
  { type: 'Medical Records', accuracy: '99.8%', volume: '15K+/day' },
  { type: 'Insurance Forms', accuracy: '99.5%', volume: '8K+/day' },
  { type: 'Tax Documents', accuracy: '99.9%', volume: '12K+/day' },
  { type: 'Legal Briefs', accuracy: '99.1%', volume: '3K+/day' },
  { type: 'Financial Statements', accuracy: '99.6%', volume: '7K+/day' },
  { type: 'HR Documents', accuracy: '99.4%', volume: '6K+/day' }
]

const integrations = [
  { name: 'Salesforce', category: 'CRM' },
  { name: 'SAP', category: 'ERP' },
  { name: 'Oracle', category: 'Database' },
  { name: 'Microsoft 365', category: 'Productivity' },
  { name: 'DocuSign', category: 'E-signature' },
  { name: 'Box', category: 'Storage' },
  { name: 'SharePoint', category: 'Collaboration' },
  { name: 'Workday', category: 'HR' }
]

const complianceFeatures = [
  {
    title: 'HIPAA Compliance',
    description: 'Full healthcare data protection with encrypted processing and secure storage',
    icon: ShieldCheckIcon
  },
  {
    title: 'SOX Compliance',
    description: 'Financial document processing with complete audit trails and controls',
    icon: DocumentCheckIcon
  },
  {
    title: 'GDPR Ready',
    description: 'European data protection compliance with data residency options',
    icon: EyeIcon
  },
  {
    title: 'ISO 27001',
    description: 'Information security management system certification',
    icon: ShieldCheckIcon
  }
]

export default function DocumentProcessingPage() {
  const router = useRouter()
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [solutionsRef, solutionsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [flowRef, flowInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    router.replace('/solutions/backend-automations')
  }, [router])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Document AI • 99.5% Accuracy • 10x Faster Processing
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Document Processing 
                <span className="text-gradient"> That Never Sleeps</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your document workflows with AI that extracts, validates, and processes any document type 
                with enterprise-grade accuracy. <strong className="text-gray-900">Process 10,000+ documents daily with 99.5% accuracy and 85% cost reduction.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group">
                  Start Free Trial
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#solutions" className="btn-outline">
                  View Solutions
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-purple-600">50M+</div>
                  <div className="text-sm text-gray-600">Documents processed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">99.5%</div>
                  <div className="text-sm text-gray-600">Accuracy rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">85%</div>
                  <div className="text-sm text-gray-600">Cost reduction</div>
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
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center">
                  <DocumentTextIcon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Live Processing Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Processing</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {documentTypes.slice(0, 4).map((doc, index) => (
                      <motion.div
                        key={doc.type}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.3 + 1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{doc.type}</div>
                            <div className="text-xs text-gray-500">{doc.volume} processed today</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600">{doc.accuracy}</div>
                          <div className="text-xs text-gray-500">accuracy</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Real-time processing status</span>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>
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
              Why Document Processing AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Eliminate manual data entry and transform your document workflows with intelligent automation
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
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-purple-600" />
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

      {/* Processing Flow */}
      <section ref={flowRef} className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={flowInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process that transforms any document into structured, actionable data
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {processingFlow.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={flowInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white border-4 border-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  {index < processingFlow.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-purple-200 -translate-x-10"></div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Solutions */}
      <section id="solutions" ref={solutionsRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Document Processing Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-specific AI solutions that understand your document types and business requirements
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {documentSolutions.map((solution, index) => (
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
                        <div className={`text-lg font-semibold ${
                          solution.color === 'blue' ? 'text-blue-600' :
                          solution.color === 'green' ? 'text-green-600' :
                          'text-purple-600'
                        }`}>
                          {solution.pricing}
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
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="text-sm text-gray-600 font-medium">Specialized for:</span>
                      {solution.industries.map((industry) => (
                        <span key={industry} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {industry}
                        </span>
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
                        Try Demo
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 bg-gray-50 p-8">
                    <h4 className="font-bold text-gray-900 mb-6">Performance Metrics</h4>
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
                      <h5 className="font-semibold text-gray-900 mb-2">Document Types</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        See all supported document formats
                      </p>
                      <Link 
                        href="/resources/document-types"
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        View Full List →
                      </Link>
                    </div>
                  </div>
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
              Enterprise-Grade Compliance & Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with the highest security standards to handle your most sensitive documents
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {complianceFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-sm"
              >
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Seamless System Integration
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing business systems for automated data flow
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <span className="text-xs font-bold text-gray-600">{integration.name.charAt(0)}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">{integration.name}</div>
                <div className="text-xs text-gray-500">{integration.category}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-purple-600 text-white">
        <div className="max-width container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Eliminate Manual Document Processing?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join hundreds of enterprises already processing millions of documents with 99.5% accuracy. 
              Start your free trial today and see results in 24 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact" className="btn-secondary">
                Start Free Trial
              </Link>
              <Link href="/demo" className="btn-outline border-white text-white hover:bg-white hover:text-purple-600">
                Schedule Demo
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Process 1,000 documents free
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Enterprise support included
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
