'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { createLead } from '@/lib/omni/api'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface ContactForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  industry: string
  employees: string
  interest: string
  budget: string
  timeline: string
  message: string
  source: string
}

const industries = [
  'Healthcare', 'Financial Services', 'E-commerce', 'Legal Services', 
  'Technology', 'Manufacturing', 'Education', 'Real Estate', 'Other'
]

const employeeSizes = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
]

const interests = [
  'AI Phone Agents', 'Web Chatbots', 'Document Processing', 
  'Workflow Automation', 'All Solutions', 'Custom Solution'
]

const budgets = [
  'Under $5K/month', '$5K-$15K/month', '$15K-$50K/month', 
  '$50K-$100K/month', '$100K+/month', 'Need consultation'
]

const timelines = [
  'ASAP (within 30 days)', '1-3 months', '3-6 months', 
  '6-12 months', 'Just exploring', 'Not sure'
]

const contactMethods = [
  {
    icon: PhoneIcon,
    title: 'Phone',
    description: 'Call us for immediate assistance',
    value: '1-800-666-4241',
    action: 'tel:+18006664241'
  },
  {
    icon: EnvelopeIcon,
    title: 'Email',
    description: 'Send us a detailed message',
    value: 'SpeakDirectSales@gmail.com',
    action: 'mailto:SpeakDirectSales@gmail.com'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Live Chat',
    description: 'Chat with our AI assistant',
    value: 'Available 24/7',
    action: '#'
  },
  {
    icon: CalendarIcon,
    title: 'Schedule Demo',
    description: 'Book a personalized demo',
    value: 'Available slots',
    action: '#'
  }
]

// Offices section removed per product requirements

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    employees: '',
    interest: '',
    budget: '',
    timeline: '',
    message: '',
    source: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true })

  const updateField = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required'
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.interest) newErrors.interest = 'Please select your primary interest'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim()
      await createLead({
        name,
        email: formData.email,
        company: formData.company || undefined,
        topic: formData.interest || undefined,
        message: formData.message || undefined,
        source: formData.source || 'contact_page',
      })
      
      setIsSubmitted(true)
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        industry: '',
        employees: '',
        interest: '',
        budget: '',
        timeline: '',
        message: '',
        source: ''
      })
      
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-black dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 dark:bg-white/10 dark:text-white">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              Get In Touch • Fast Response • Expert Consultation
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Let's Transform Your <span className="text-blue-600">Business Together</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Ready to automate your operations and boost efficiency? Our AI experts are here to help. 
              Get a personalized consultation and see how we can transform your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#contact-form" className="btn-primary">
                Get Started Now
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </a>
              <a href="tel:+18006664241" className="btn-secondary">
                Call: 1-800-666-4241
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-padding bg-white border-b border-gray-200">
        <div className="max-width container-padding">
          <div className="grid md:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <a
                  href={method.action}
                  className="block p-6 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors dark:bg-white/10 dark:group-hover:bg-white/15">
                    <method.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {method.description}
                  </p>
                  
                  <p className="text-sm font-medium text-blue-600">
                    {method.value}
                  </p>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section ref={formRef} id="contact-form" className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="card p-8">
                {!isSubmitted ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Get Your Free Consultation
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Tell us about your business and we'll show you how AI can transform your operations.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.firstName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="John"
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.lastName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Smith"
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="john@company.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      {/* Company Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Company *
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => updateField('company', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.company ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Acme Corp"
                          />
                          {errors.company && (
                            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => updateField('jobTitle', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="CEO, CTO, etc."
                          />
                        </div>
                      </div>

                      {/* Business Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Industry
                          </label>
                          <select
                            value={formData.industry}
                            onChange={(e) => updateField('industry', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Industry</option>
                            {industries.map((industry) => (
                              <option key={industry} value={industry}>{industry}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Company Size
                          </label>
                          <select
                            value={formData.employees}
                            onChange={(e) => updateField('employees', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Size</option>
                            {employeeSizes.map((size) => (
                              <option key={size} value={size}>{size} employees</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Primary Interest *
                        </label>
                        <select
                          value={formData.interest}
                          onChange={(e) => updateField('interest', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.interest ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">What interests you most?</option>
                          {interests.map((interest) => (
                            <option key={interest} value={interest}>{interest}</option>
                          ))}
                        </select>
                        {errors.interest && (
                          <p className="text-red-500 text-sm mt-1">{errors.interest}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Budget Range
                          </label>
                          <select
                            value={formData.budget}
                            onChange={(e) => updateField('budget', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Budget</option>
                            {budgets.map((budget) => (
                              <option key={budget} value={budget}>{budget}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Timeline
                          </label>
                          <select
                            value={formData.timeline}
                            onChange={(e) => updateField('timeline', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Timeline</option>
                            {timelines.map((timeline) => (
                              <option key={timeline} value={timeline}>{timeline}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Tell us about your project
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => updateField('message', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describe your current challenges and what you'd like to achieve with AI automation..."
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          <>
                            Get My Free Consultation
                            <ArrowRightIcon className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-white/10">
                      <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Thank You!
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      We've received your information and will contact you within 24 hours. 
                      In the meantime, feel free to explore our case studies or calculate your ROI.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a href="/case-studies" className="btn-primary">
                        View Case Studies
                      </a>
                      <a href="/roi-calculator" className="btn-secondary">
                        Calculate ROI
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contact Info & Offices */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Response Time */}
              <div className="card p-6 bg-blue-50 border-blue-200 dark:bg-white/5 dark:border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <ClockIcon className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-blue-900">
                    Fast Response Guarantee
                  </h3>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  We respond to all inquiries within 2 hours during business hours. 
                  For urgent matters, call us directly at 1-800-666-4241.
                </p>
              </div>

              {/* Why Choose Us */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Why Choose SpeakDirect?
                </h3>
                
                <div className="space-y-4">
                  {[
                    { icon: UserGroupIcon, text: 'Expert team with 50+ years combined experience' },
                    { icon: BuildingOfficeIcon, text: 'Trusted by 500+ companies worldwide' },
                    { icon: CheckCircleIcon, text: '99.9% uptime with 24/7 support' },
                    { icon: GlobeAltIcon, text: 'Enterprise-grade security and compliance' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-white/10">
                        <item.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
