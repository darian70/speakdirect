'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: 'By accessing and using SpeakDirect services, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service constitute a legally binding agreement between you and SpeakDirect, Inc.'
  },
  {
    id: 'services',
    title: 'Description of Services',
    content: 'SpeakDirect provides AI automation solutions including but not limited to phone agents, web chatbots, document processing, and workflow automation. Our services are designed to help businesses automate operations, reduce costs, and improve efficiency through artificial intelligence.'
  },
  {
    id: 'user-accounts',
    title: 'User Accounts and Registration',
    content: 'To access certain features of our services, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration.'
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use Policy',
    content: 'You agree to use our services only for lawful purposes and in accordance with these Terms. You may not use our services to transmit harmful, offensive, or illegal content, or to violate any applicable laws or regulations. Prohibited activities include but are not limited to spamming, hacking, or distributing malware.'
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property Rights',
    content: 'All content, features, and functionality of our services are owned by SpeakDirect and are protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive license to use our services for your business purposes only.'
  },
  {
    id: 'data-privacy',
    title: 'Data Privacy and Security',
    content: 'We are committed to protecting your data and privacy. Our collection, use, and protection of your personal information is governed by our Privacy Policy. We implement industry-standard security measures to protect your data, including encryption and access controls.'
  },
  {
    id: 'payment-terms',
    title: 'Payment Terms and Billing',
    content: 'Payment for services is due according to the billing schedule specified in your service agreement. All fees are non-refundable unless otherwise specified. We reserve the right to suspend services for non-payment after appropriate notice.'
  },
  {
    id: 'service-availability',
    title: 'Service Availability and Support',
    content: 'We strive to maintain 99.9% uptime for our services. Scheduled maintenance will be announced in advance. Support is available 24/7 for enterprise customers and during business hours for standard plans. Response times vary by support tier.'
  },
  {
    id: 'limitation-liability',
    title: 'Limitation of Liability',
    content: 'To the maximum extent permitted by law, SpeakDirect shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services. Our total liability shall not exceed the amount paid by you for the services in the twelve months preceding the claim.'
  },
  {
    id: 'termination',
    title: 'Termination',
    content: 'Either party may terminate this agreement with 30 days written notice. We may terminate your access immediately for violation of these terms. Upon termination, you will lose access to our services, but data export options are available during a grace period.'
  },
  {
    id: 'modifications',
    title: 'Modifications to Terms',
    content: 'We reserve the right to modify these Terms of Service at any time. We will provide notice of material changes via email or through our services. Your continued use of our services after such modifications constitutes acceptance of the updated terms.'
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Disputes',
    content: 'These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any disputes arising under these Terms will be resolved through binding arbitration in San Francisco, California, except for claims of intellectual property infringement.'
  }
]

const keyTerms = [
  {
    term: 'Data Retention',
    definition: 'Customer data retained for 90 days after service termination'
  },
  {
    term: 'Support Response Times',
    definition: 'Enterprise: 1 hour, Professional: 4 hours, Standard: 24 hours'
  },
  {
    term: 'Liability Cap',
    definition: 'Limited to 12 months of fees paid for the affected service'
  }
]

export default function TermsOfServicePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-100"></div>
        <div className="relative max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              <ScaleIcon className="w-4 h-4 mr-2" />
              Terms of Service • Legally Binding • Last Updated: January 2024
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Terms of Service
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              These Terms of Service govern your use of SpeakDirect AI automation services. 
              Please read these terms carefully before using our services.
            </p>
            
            <div className="text-sm text-gray-500 mb-8">
              <strong>Effective Date:</strong> January 1, 2024 | <strong>Last Updated:</strong> January 1, 2024
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Terms Summary */}
      <section className="section-padding bg-white border-b border-gray-200">
        <div className="max-width container-padding">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Terms Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {keyTerms.map((item, index) => (
              <motion.div
                key={item.term}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.term}</h3>
                  <p className="text-sm text-gray-600">{item.definition}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section ref={contentRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <Link
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-gray-600 hover:text-indigo-600 py-1"
                    >
                      {section.title}
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">Legal Questions?</h4>
                  <p className="text-sm text-indigo-700 mb-3">
                    Contact our legal team for clarification on these terms.
                  </p>
                  <Link href="/contact" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    Contact Legal →
                  </Link>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                {/* Introduction */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Welcome to SpeakDirect. These Terms of Service ("Terms") govern your use of our website, 
                    AI automation services, and related products and services (collectively, the "Services") 
                    provided by SpeakDirect, Inc. ("SpeakDirect," "we," "our," or "us").
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                        <p className="text-yellow-700 leading-relaxed">
                          By using our Services, you agree to be bound by these Terms. If you do not agree 
                          to these Terms, please do not use our Services. These Terms constitute a legally 
                          binding agreement between you and SpeakDirect.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Main Sections */}
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={contentInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="mb-12"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Legal Department</h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <EnvelopeIcon className="w-5 h-5 mr-2" />
                            <span>SpeakDirectSales@gmail.com</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <PhoneIcon className="w-5 h-5 mr-2" />
                            <span>1-800-666-4241</span>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </motion.div>

                {/* Acknowledgment */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mb-12"
                >
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <CheckCircleIcon className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-indigo-800 mb-2">Acknowledgment</h3>
                        <p className="text-indigo-700 leading-relaxed">
                          By using SpeakDirect services, you acknowledge that you have read, understood, 
                          and agree to be bound by these Terms of Service. These Terms were last updated 
                          on January 1, 2024, and are effective immediately upon posting.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Documents */}
      <section className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Legal Documents</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/legal/privacy-policy" className="card p-6 hover:shadow-lg transition-shadow">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Policy</h3>
              <p className="text-gray-600 text-sm">Learn how we collect, use, and protect your personal information.</p>
            </Link>
            
            <Link href="/contact" className="card p-6 hover:shadow-lg transition-shadow">
              <EnvelopeIcon className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Contact Legal Team</h3>
              <p className="text-gray-600 text-sm">Have questions about our terms? Contact our legal team.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
