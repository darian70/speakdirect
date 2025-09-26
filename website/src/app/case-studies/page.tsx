'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  ChartBarIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  PhoneIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const caseStudies = [
  {
    id: 'techcorp-phone-agents',
    company: 'TechCorp Solutions',
    industry: 'Technology Services',
    size: '5,000+ employees',
    solution: 'AI Phone Agents',
    challenge: 'TechCorp was struggling with high customer service costs and long wait times. Their 200-person call center was overwhelmed with 50,000+ monthly calls, leading to 40% customer churn and $2.3M annual staffing costs.',
    implementation: 'Deployed 24/7 AI phone agents handling tier-1 support, appointment scheduling, and basic troubleshooting. Integrated with existing CRM and ticketing systems for seamless handoffs to human agents when needed.',
    results: {
      costSavings: '$1.8M annually',
      efficiency: '75% reduction in wait times',
      satisfaction: '92% customer satisfaction',
      volume: '80% of calls handled by AI'
    },
    metrics: [
      { label: 'Cost Reduction', value: '78%', description: 'Annual customer service costs' },
      { label: 'Response Time', value: '< 10 sec', description: 'Average call answer time' },
      { label: 'Resolution Rate', value: '85%', description: 'First-call resolution' },
      { label: 'Availability', value: '24/7', description: 'Customer service hours' }
    ],
    testimonial: {
      quote: "SpeakDirect transformed our customer service operations. We've reduced costs by 78% while dramatically improving customer satisfaction. The AI agents handle complex queries with remarkable accuracy.",
      author: "Sarah Mitchell",
      title: "VP of Customer Operations",
      image: "/testimonials/sarah-mitchell.jpg"
    },
    timeline: [
      { phase: 'Discovery & Planning', duration: '2 weeks', description: 'Requirements gathering and system analysis' },
      { phase: 'Integration Setup', duration: '3 weeks', description: 'CRM integration and AI training' },
      { phase: 'Pilot Testing', duration: '2 weeks', description: 'Limited deployment with 100 daily calls' },
      { phase: 'Full Deployment', duration: '1 week', description: 'Complete rollout across all channels' }
    ],
    icon: PhoneIcon,
    color: 'blue'
  },
  {
    id: 'healthplus-document-processing',
    company: 'HealthPlus Medical Group',
    industry: 'Healthcare',
    size: '2,500+ employees',
    solution: 'Document Processing AI',
    challenge: 'HealthPlus processed 10,000+ patient forms monthly, requiring 15 FTE staff for data entry. Manual processing led to 3-day delays, compliance risks, and $900K annual processing costs.',
    implementation: 'Implemented AI-powered document processing for patient intake forms, insurance claims, and medical records. HIPAA-compliant system with 99.7% accuracy and real-time processing capabilities.',
    results: {
      costSavings: '$720K annually',
      efficiency: '95% faster processing',
      accuracy: '99.7% data accuracy',
      compliance: '100% HIPAA compliance'
    },
    metrics: [
      { label: 'Processing Speed', value: '95%', description: 'Faster than manual entry' },
      { label: 'Accuracy Rate', value: '99.7%', description: 'Data extraction accuracy' },
      { label: 'Cost Savings', value: '$720K', description: 'Annual operational savings' },
      { label: 'Staff Reallocation', value: '12 FTE', description: 'Reassigned to patient care' }
    ],
    testimonial: {
      quote: "The document processing AI has revolutionized our operations. We've eliminated processing delays and our staff can now focus on patient care instead of data entry. The ROI was immediate.",
      author: "Dr. Michael Chen",
      title: "Chief Medical Officer",
      image: "/testimonials/michael-chen.jpg"
    },
    timeline: [
      { phase: 'HIPAA Compliance Review', duration: '1 week', description: 'Security and compliance assessment' },
      { phase: 'System Integration', duration: '4 weeks', description: 'EHR integration and AI training' },
      { phase: 'Pilot Testing', duration: '2 weeks', description: 'Limited deployment with select forms' },
      { phase: 'Full Deployment', duration: '2 weeks', description: 'Complete rollout across all departments' }
    ],
    icon: DocumentTextIcon,
    color: 'green'
  },
  {
    id: 'retailmax-chatbots',
    company: 'RetailMax E-commerce',
    industry: 'E-commerce',
    size: '1,200+ employees',
    solution: 'Web Chatbots & Workflow Automation',
    challenge: 'RetailMax faced 60% cart abandonment, slow customer support response times, and manual order processing bottlenecks. Customer inquiries took 24+ hours to resolve, impacting sales and satisfaction.',
    implementation: 'Deployed intelligent chatbots for customer support, order tracking, and product recommendations. Automated order processing workflows and integrated with inventory management systems.',
    results: {
      salesIncrease: '$3.2M additional revenue',
      conversion: '35% higher conversion rate',
      support: '90% faster response times',
      automation: '85% order processing automated'
    },
    metrics: [
      { label: 'Revenue Increase', value: '$3.2M', description: 'Additional annual revenue' },
      { label: 'Conversion Rate', value: '+35%', description: 'Improvement in sales conversion' },
      { label: 'Response Time', value: '< 30 sec', description: 'Average customer query response' },
      { label: 'Cart Recovery', value: '42%', description: 'Abandoned cart recovery rate' }
    ],
    testimonial: {
      quote: "Our conversion rates skyrocketed after implementing SpeakDirect's chatbots. The AI handles customer queries instantly and the automated workflows have streamlined our entire operation.",
      author: "Jennifer Park",
      title: "Head of E-commerce",
      image: "/testimonials/jennifer-park.jpg"
    },
    timeline: [
      { phase: 'Platform Integration', duration: '2 weeks', description: 'Shopify and CRM integration setup' },
      { phase: 'Chatbot Training', duration: '3 weeks', description: 'Product catalog and FAQ training' },
      { phase: 'Workflow Automation', duration: '2 weeks', description: 'Order processing automation setup' },
      { phase: 'Launch & Optimization', duration: '1 week', description: 'Go-live and performance tuning' }
    ],
    icon: ShoppingCartIcon,
    color: 'purple'
  },
  {
    id: 'financefirst-compliance',
    company: 'FinanceFirst Credit Union',
    industry: 'Financial Services',
    size: '800+ employees',
    solution: 'Compliance & Customer Service AI',
    challenge: 'FinanceFirst struggled with regulatory compliance monitoring, loan processing delays, and member service bottlenecks. Manual compliance checks took 5+ days and cost $500K annually.',
    implementation: 'Implemented AI-powered compliance monitoring, automated loan processing workflows, and 24/7 member service chatbots. Full integration with core banking systems and regulatory reporting.',
    results: {
      compliance: '99.9% compliance rate',
      processing: '80% faster loan approvals',
      satisfaction: '94% member satisfaction',
      savings: '$420K annual savings'
    },
    metrics: [
      { label: 'Compliance Rate', value: '99.9%', description: 'Regulatory compliance accuracy' },
      { label: 'Loan Processing', value: '80%', description: 'Faster approval times' },
      { label: 'Member Satisfaction', value: '94%', description: 'Service satisfaction score' },
      { label: 'Cost Reduction', value: '$420K', description: 'Annual operational savings' }
    ],
    testimonial: {
      quote: "The AI compliance monitoring has been a game-changer. We've eliminated manual errors and our loan processing is now industry-leading. Members love the instant service.",
      author: "David Rodriguez",
      title: "Chief Operations Officer",
      image: "/testimonials/david-rodriguez.jpg"
    },
    timeline: [
      { phase: 'Regulatory Assessment', duration: '2 weeks', description: 'Compliance requirements analysis' },
      { phase: 'Core System Integration', duration: '4 weeks', description: 'Banking system integration' },
      { phase: 'AI Training & Testing', duration: '3 weeks', description: 'Compliance rules and testing' },
      { phase: 'Phased Rollout', duration: '2 weeks', description: 'Department-by-department deployment' }
    ],
    icon: BuildingOfficeIcon,
    color: 'emerald'
  }
]

const industryStats = [
  { industry: 'Healthcare', savings: '$2.1M', clients: '50+', satisfaction: '96%' },
  { industry: 'Financial Services', savings: '$1.8M', clients: '35+', satisfaction: '94%' },
  { industry: 'E-commerce', savings: '$2.7M', clients: '75+', satisfaction: '93%' },
  { industry: 'Technology', savings: '$3.2M', clients: '60+', satisfaction: '95%' }
]

export default function CaseStudiesPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [studiesRef, studiesInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              <TrophyIcon className="w-4 h-4 mr-2" />
              Customer Success Stories • Proven Results • Real Impact
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Customer <span className="text-indigo-600">Success Stories</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Discover how leading organizations across industries have transformed their operations 
              and achieved remarkable ROI with our AI automation solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/contact" className="btn-primary">
                Start Your Success Story
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/roi-calculator" className="btn-secondary">
                Calculate Your ROI
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industry Stats */}
      <section ref={statsRef} className="section-padding bg-white border-b border-gray-200">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Across Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI solutions deliver consistent results across diverse industries
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {industryStats.map((stat, index) => (
              <motion.div
                key={stat.industry}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {stat.industry}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {stat.savings}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Annual Savings</div>
                  </div>
                  
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {stat.clients}
                    </div>
                    <div className="text-sm text-gray-600">Active Clients</div>
                  </div>
                  
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {stat.satisfaction}
                    </div>
                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section ref={studiesRef} className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={studiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Detailed Case Studies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              In-depth analysis of how our AI solutions transformed business operations
            </p>
          </motion.div>
          
          <div className="space-y-20">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                animate={studiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card p-8 lg:p-12"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      study.color === 'blue' ? 'bg-blue-100' :
                      study.color === 'green' ? 'bg-green-100' :
                      study.color === 'purple' ? 'bg-purple-100' :
                      'bg-emerald-100'
                    }`}>
                      <study.icon className={`w-8 h-8 ${
                        study.color === 'blue' ? 'text-blue-600' :
                        study.color === 'green' ? 'text-green-600' :
                        study.color === 'purple' ? 'text-purple-600' :
                        'text-emerald-600'
                      }`} />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {study.company}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{study.industry}</span>
                        <span>•</span>
                        <span>{study.size}</span>
                        <span>•</span>
                        <span className="font-medium text-indigo-600">{study.solution}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">The Challenge</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Our Solution</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {study.implementation}
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">Key Results</h4>
                  <div className="grid md:grid-cols-4 gap-6">
                    {study.metrics.map((metric, metricIndex) => (
                      <div key={metric.label} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className={`text-2xl font-bold mb-1 ${
                          study.color === 'blue' ? 'text-blue-600' :
                          study.color === 'green' ? 'text-green-600' :
                          study.color === 'purple' ? 'text-purple-600' :
                          'text-emerald-600'
                        }`}>
                          {metric.value}
                        </div>
                        <div className="font-semibold text-gray-900 text-sm mb-1">
                          {metric.label}
                        </div>
                        <div className="text-xs text-gray-600">
                          {metric.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Implementation Timeline */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">Implementation Timeline</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    {study.timeline.map((phase, phaseIndex) => (
                      <div key={phase.phase} className="relative">
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            study.color === 'blue' ? 'bg-blue-600' :
                            study.color === 'green' ? 'bg-green-600' :
                            study.color === 'purple' ? 'bg-purple-600' :
                            'bg-emerald-600'
                          }`}>
                            {phaseIndex + 1}
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900 text-sm">
                              {phase.phase}
                            </div>
                            <div className="text-xs text-gray-600">
                              {phase.duration}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed ml-11">
                          {phase.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <UserGroupIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
                        "{study.testimonial.quote}"
                      </blockquote>
                      
                      <div>
                        <div className="font-semibold text-gray-900">
                          {study.testimonial.author}
                        </div>
                        <div className="text-sm text-gray-600">
                          {study.testimonial.title}
                        </div>
                        <div className="text-sm font-medium text-indigo-600">
                          {study.company}
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

      {/* Success Metrics Summary */}
      <section className="section-padding bg-white">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Aggregate Success Metrics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combined results across all our customer implementations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Total Cost Savings', value: '$50M+', description: 'Cumulative annual savings across all clients', icon: CurrencyDollarIcon },
              { label: 'Efficiency Improvement', value: '73%', description: 'Average operational efficiency gain', icon: ChartBarIcon },
              { label: 'Customer Satisfaction', value: '94.5%', description: 'Average satisfaction score improvement', icon: HeartIcon },
              { label: 'Implementation Speed', value: '6 weeks', description: 'Average time to full deployment', icon: ClockIcon }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="w-6 h-6 text-indigo-600" />
                </div>
                
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {metric.value}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">
                  {metric.label}
                </h3>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {metric.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-width container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join hundreds of companies that have transformed their operations with our AI solutions. 
            Let's discuss how we can help you achieve similar results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-white">
              Schedule Strategy Session
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/roi-calculator" className="btn-outline-white">
              Calculate Your Potential ROI
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
