'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  GlobeAltIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

const sections = [
  {
    id: 'information-collection',
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'We collect personal information that you voluntarily provide to us when you register for our services, express interest in obtaining information about us or our products, participate in activities on our website, or contact us.'
      },
      {
        subtitle: 'Automatically Collected Information',
        text: 'We automatically collect certain information when you visit, use, or navigate our website. This information includes device and usage information, location data, and other diagnostic data.'
      },
      {
        subtitle: 'Business Information',
        text: 'For enterprise clients, we may collect business-related information including company details, employee information (with consent), and operational data necessary to provide our AI automation services.'
      }
    ]
  },
  {
    id: 'information-use',
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'Service Provision',
        text: 'We use your information to provide, maintain, and improve our AI automation services, process transactions, and communicate with you about your account and services.'
      },
      {
        subtitle: 'Business Operations',
        text: 'We use collected information for business purposes such as data analysis, identifying usage trends, determining the effectiveness of our marketing campaigns, and improving our services.'
      },
      {
        subtitle: 'Legal Compliance',
        text: 'We may use your information to comply with applicable laws, regulations, legal processes, or enforceable governmental requests.'
      }
    ]
  },
  {
    id: 'information-sharing',
    title: 'Information Sharing and Disclosure',
    content: [
      {
        subtitle: 'Service Providers',
        text: 'We may share your information with third-party service providers who perform services on our behalf, such as cloud hosting, data analysis, payment processing, and customer service.'
      },
      {
        subtitle: 'Business Transfers',
        text: 'We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.'
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).'
      }
    ]
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: [
      {
        subtitle: 'Security Measures',
        text: 'We implement appropriate technical and organizational security measures designed to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.'
      },
      {
        subtitle: 'Encryption',
        text: 'All data transmission is encrypted using industry-standard SSL/TLS protocols. Data at rest is encrypted using AES-256 encryption standards.'
      },
      {
        subtitle: 'Access Controls',
        text: 'We maintain strict access controls and regularly audit access to personal information. Only authorized personnel have access to personal data on a need-to-know basis.'
      }
    ]
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: [
      {
        subtitle: 'Retention Period',
        text: 'We retain personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.'
      },
      {
        subtitle: 'Deletion Procedures',
        text: 'When personal information is no longer needed, we securely delete or anonymize it in accordance with our data retention policies and applicable legal requirements.'
      }
    ]
  },
  {
    id: 'your-rights',
    title: 'Your Privacy Rights',
    content: [
      {
        subtitle: 'Access and Portability',
        text: 'You have the right to access, update, or delete your personal information. You may also request a copy of your personal information in a portable format.'
      },
      {
        subtitle: 'Correction and Deletion',
        text: 'You have the right to correct inaccurate personal information and request deletion of your personal information, subject to certain exceptions.'
      },
      {
        subtitle: 'Opt-Out Rights',
        text: 'You may opt out of receiving promotional communications from us by following the instructions in those communications or contacting us directly.'
      }
    ]
  }
]

const complianceStandards = [
  {
    name: 'GDPR',
    description: 'General Data Protection Regulation compliance for EU residents',
    icon: GlobeAltIcon
  },
  {
    name: 'CCPA',
    description: 'California Consumer Privacy Act compliance',
    icon: ShieldCheckIcon
  },
  {
    name: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act for healthcare data',
    icon: UserGroupIcon
  },
  {
    name: 'SOC 2',
    description: 'Service Organization Control 2 Type II certification',
    icon: DocumentTextIcon
  }
]

export default function PrivacyPolicyPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
        <div className="relative max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Privacy Policy • GDPR & CCPA Compliant • Last Updated: January 2024
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Privacy Policy
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Your privacy is important to us. This Privacy Policy explains how SpeakDirect collects, uses, 
              and protects your information when you use our AI automation services.
            </p>
            
            <div className="text-sm text-gray-500 mb-8">
              <strong>Effective Date:</strong> January 1, 2024 | <strong>Last Updated:</strong> January 1, 2024
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="section-padding bg-white border-b border-gray-200">
        <div className="max-width container-padding">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <DocumentTextIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-900">{section.title}</span>
              </Link>
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
                      className="block text-sm text-gray-600 hover:text-blue-600 py-1"
                    >
                      {section.title}
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Questions?</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Contact our privacy team for any questions about this policy.
                  </p>
                  <Link href="/contact" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Contact Us →
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
                    SpeakDirect, Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                    describes how we collect, use, and share information about you when you use our website, AI automation 
                    services, and related products and services (collectively, the "Services").
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    By using our Services, you agree to the collection and use of information in accordance with this policy. 
                    We will not use or share your information with anyone except as described in this Privacy Policy.
                  </p>
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
                    <div className="space-y-6">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.subtitle}</h3>
                          <p className="text-gray-600 leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Compliance Standards */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Compliance Standards</h2>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    We maintain compliance with major privacy regulations and industry standards to ensure 
                    your data is protected according to the highest standards.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {complianceStandards.map((standard, index) => (
                      <div key={standard.name} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <standard.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{standard.name}</h3>
                          <p className="text-sm text-gray-600">{standard.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Privacy Officer</h3>
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

                {/* Updates */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Policy Updates</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                        <p className="text-yellow-700 leading-relaxed">
                          We may update this Privacy Policy from time to time. We will notify you of any changes by 
                          posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage 
                          you to review this Privacy Policy periodically for any changes.
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

      {/* Related Links */}
      <section className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Legal Documents</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/legal/terms-of-service" className="card p-6 hover:shadow-lg transition-shadow">
              <DocumentTextIcon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Terms of Service</h3>
              <p className="text-gray-600 text-sm">Review our terms and conditions for using SpeakDirect services.</p>
            </Link>
            
            <Link href="/contact" className="card p-6 hover:shadow-lg transition-shadow">
              <EnvelopeIcon className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Contact Legal Team</h3>
              <p className="text-gray-600 text-sm">Have questions? Contact our legal and compliance team.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
