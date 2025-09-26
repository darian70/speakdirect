'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  Cog6ToothIcon, 
  ArrowPathIcon, 
  BoltIcon, 
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline'

const workflowSolutions = [
  {
    name: 'ProcessFlow AI',
    description: 'Intelligent workflow automation that connects your apps, automates repetitive tasks, and optimizes business processes with AI decision-making.',
    icon: Cog6ToothIcon,
    features: [
      'Drag-and-drop workflow builder',
      'AI-powered decision trees',
      '500+ app integrations',
      'Real-time process monitoring',
      'Exception handling and alerts',
      'Performance analytics dashboard'
    ],
    industries: ['Operations', 'HR', 'Finance', 'Marketing'],
    pricing: 'From $2,500 setup + $399/month',
    color: 'blue',
    metrics: {
      'Time savings': '40 hours/week',
      'Error reduction': '95%',
      'ROI': '300%'
    }
  },
  {
    name: 'SmartApproval Pro',
    description: 'Automated approval workflows that route requests intelligently, enforce compliance rules, and accelerate decision-making processes.',
    icon: ClipboardDocumentListIcon,
    features: [
      'Multi-level approval routing',
      'Compliance rule enforcement',
      'Automated notifications',
      'Audit trail and reporting',
      'Mobile approval capabilities',
      'Integration with ERP systems'
    ],
    industries: ['Finance', 'Procurement', 'HR', 'Legal'],
    pricing: 'From $3,500 setup + $499/month',
    color: 'green',
    metrics: {
      'Approval speed': '80% faster',
      'Compliance rate': '99.9%',
      'Process visibility': '100%'
    }
  },
  {
    name: 'DataSync Master',
    description: 'Real-time data synchronization and transformation workflows that keep your systems connected and data consistent across platforms.',
    icon: ArrowPathIcon,
    features: [
      'Real-time data synchronization',
      'Data transformation rules',
      'Error detection and correction',
      'Scheduled batch processing',
      'Data quality monitoring',
      'Custom API integrations'
    ],
    industries: ['E-commerce', 'Manufacturing', 'Healthcare', 'Logistics'],
    pricing: 'From $4,000 setup + $599/month',
    color: 'purple',
    metrics: {
      'Data accuracy': '99.8%',
      'Sync speed': '< 5 seconds',
      'System uptime': '99.9%'
    }
  }
]

const benefits = [
  {
    icon: ClockIcon,
    title: '40+ Hours Saved Weekly',
    description: 'Eliminate repetitive manual tasks and free up your team to focus on high-value strategic work.'
  },
  {
    icon: CurrencyDollarIcon,
    title: '300% ROI Average',
    description: 'Typical customers see 3x return on investment within 6 months through efficiency gains and cost reduction.'
  },
  {
    icon: ChartBarIcon,
    title: '95% Error Reduction',
    description: 'Automated processes eliminate human error and ensure consistent, reliable execution every time.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise Compliance',
    description: 'Built-in audit trails, approval workflows, and compliance controls for regulated industries.'
  }
]

const automationTypes = [
  {
    category: 'Data Processing',
    workflows: [
      'Lead data enrichment and routing',
      'Invoice processing and approval',
      'Customer onboarding automation',
      'Report generation and distribution'
    ],
    icon: ClipboardDocumentListIcon,
    color: 'blue'
  },
  {
    category: 'Communication',
    workflows: [
      'Email marketing sequences',
      'Customer support ticket routing',
      'Meeting scheduling and reminders',
      'Follow-up task creation'
    ],
    icon: BoltIcon,
    color: 'green'
  },
  {
    category: 'Operations',
    workflows: [
      'Inventory management alerts',
      'Quality control processes',
      'Compliance monitoring',
      'Performance tracking'
    ],
    icon: Cog6ToothIcon,
    color: 'purple'
  },
  {
    category: 'Finance',
    workflows: [
      'Expense report processing',
      'Budget approval workflows',
      'Payment processing automation',
      'Financial reporting'
    ],
    icon: CurrencyDollarIcon,
    color: 'orange'
  }
]

const workflowExample = {
  title: 'Live Workflow: Customer Onboarding Automation',
  steps: [
    { id: 1, name: 'New Customer Signup', status: 'completed', time: '2 min ago' },
    { id: 2, name: 'Welcome Email Sent', status: 'completed', time: '1 min ago' },
    { id: 3, name: 'Account Setup', status: 'running', time: 'In progress' },
    { id: 4, name: 'Document Collection', status: 'pending', time: 'Waiting' },
    { id: 5, name: 'Approval Process', status: 'pending', time: 'Waiting' },
    { id: 6, name: 'Account Activation', status: 'pending', time: 'Waiting' }
  ]
}

const integrationCategories = [
  {
    category: 'CRM & Sales',
    tools: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM']
  },
  {
    category: 'Communication',
    tools: ['Slack', 'Microsoft Teams', 'Gmail', 'Outlook']
  },
  {
    category: 'Project Management',
    tools: ['Asana', 'Trello', 'Monday.com', 'Jira']
  },
  {
    category: 'Finance & Accounting',
    tools: ['QuickBooks', 'Xero', 'SAP', 'NetSuite']
  },
  {
    category: 'Marketing',
    tools: ['Mailchimp', 'Marketo', 'Pardot', 'Constant Contact']
  },
  {
    category: 'E-commerce',
    tools: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce']
  }
]

export default function WorkflowAutomationPage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [solutionsRef, solutionsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [typesRef, typesInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-100"></div>
        <div className="relative max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
                <Cog6ToothIcon className="w-4 h-4 mr-2" />
                Backend Automations • 300% ROI • 40+ Hours Saved Weekly
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Backend Automations 
                <span className="text-gradient"> That Scale</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your operations with low-latency backend automations that orchestrate your apps, 
                eliminate manual tasks, and enforce compliance. <strong className="text-gray-900">Save 40+ hours weekly with 300% ROI and 95% error reduction.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group" data-analytics="cta_click" data-label="workflow_hero_start" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                  Start Automation
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#solutions" className="btn-outline">
                  View Solutions
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-orange-600">500+</div>
                  <div className="text-sm text-gray-600">App integrations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">95%</div>
                  <div className="text-sm text-gray-600">Error reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-600">Automated execution</div>
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
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center">
                  <Cog6ToothIcon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{workflowExample.title}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Running</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {workflowExample.steps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 1 }}
                        className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-100' :
                          step.status === 'running' ? 'bg-orange-100' :
                          'bg-gray-100'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          ) : step.status === 'running' ? (
                            <PlayIcon className="w-4 h-4 text-orange-600" />
                          ) : (
                            <PauseIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${
                            step.status === 'completed' ? 'text-green-900' :
                            step.status === 'running' ? 'text-orange-900' :
                            'text-gray-500'
                          }`}>
                            {step.name}
                          </div>
                          <div className="text-xs text-gray-500">{step.time}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          step.status === 'completed' ? 'bg-green-100 text-green-800' :
                          step.status === 'running' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {step.status}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Estimated completion: 5 minutes</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full w-1/2"></div>
                    </div>
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
              Why Backend Automations?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Eliminate bottlenecks, reduce errors, and scale your operations with intelligent automation
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
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-orange-600" />
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

      {/* Automation Types */}
      <section ref={typesRef} className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={typesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Automation Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pre-built workflow templates for common business processes across all departments
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {automationTypes.map((type, index) => (
              <motion.div
                key={type.category}
                initial={{ opacity: 0, y: 30 }}
                animate={typesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  type.color === 'blue' ? 'bg-blue-100' :
                  type.color === 'green' ? 'bg-green-100' :
                  type.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <type.icon className={`w-8 h-8 ${
                    type.color === 'blue' ? 'text-blue-600' :
                    type.color === 'green' ? 'text-green-600' :
                    type.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {type.category}
                </h3>
                
                <ul className="space-y-2">
                  {type.workflows.map((workflow) => (
                    <li key={workflow} className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{workflow}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Solutions */}
      <section id="solutions" ref={solutionsRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Backend Automation Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive automation platforms designed for different business needs and complexity levels
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {workflowSolutions.map((solution, index) => (
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
                      <span className="text-sm text-gray-600 font-medium">Perfect for:</span>
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
                        View Demo
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 bg-gray-50 p-8">
                    <h4 className="font-bold text-gray-900 mb-6">Impact Metrics</h4>
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
                      <h5 className="font-semibold text-gray-900 mb-2">Workflow Builder</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        Try our visual workflow designer
                      </p>
                      <Link 
                        href="/workflow-builder"
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        Launch Builder →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              500+ App Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect all your business tools and create seamless automated workflows
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrationCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.tools.map((tool) => (
                    <div key={tool} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">{tool.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-gray-700">{tool}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don't see your app? We can build custom integrations.</p>
            <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700">
              Request Integration →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-orange-600 text-white">
        <div className="max-width container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Automate Your Backend Workflows?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses saving 40+ hours weekly with intelligent workflow automation. 
              Start with pre-built templates or create custom workflows in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact" className="btn-secondary" data-analytics="cta_click" data-label="workflow_bottom_trial" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                Start Free Trial
              </Link>
              <Link href="/workflow-builder" className="btn-outline border-white text-white hover:bg-white hover:text-orange-600" data-analytics="try_builder_click" data-label="workflow_try_builder">
                Try Workflow Builder
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                30-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                500+ integrations included
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
