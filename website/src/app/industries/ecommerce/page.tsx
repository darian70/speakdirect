'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  ShoppingCartIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const ecommerceSolutions = [
  {
    name: 'ShopAssist AI Chatbot',
    description: 'Intelligent shopping assistant that guides customers through product selection, handles orders, and provides personalized recommendations 24/7.',
    icon: ChatBubbleLeftRightIcon,
    features: [
      'Product recommendation engine',
      'Visual product search',
      'Inventory integration',
      'Order tracking and updates',
      'Abandoned cart recovery',
      'Multi-language support'
    ],
    metrics: {
      'Sales increase': '35%',
      'Cart abandonment': '45% reduction',
      'Customer satisfaction': '4.8/5'
    },
    color: 'blue'
  },
  {
    name: 'Order Processing Automation',
    description: 'Streamline order fulfillment with AI that processes orders, manages inventory, and coordinates shipping automatically.',
    icon: Cog6ToothIcon,
    features: [
      'Automated order processing',
      'Inventory management',
      'Shipping coordination',
      'Return processing',
      'Supplier communication',
      'Performance analytics'
    ],
    metrics: {
      'Processing speed': '10x faster',
      'Error reduction': '90%',
      'Cost savings': '60%'
    },
    color: 'green'
  },
  {
    name: 'Customer Support AI',
    description: 'Comprehensive customer service automation that handles inquiries, resolves issues, and escalates complex cases to human agents.',
    icon: HeartIcon,
    features: [
      'Order status inquiries',
      'Return and refund processing',
      'Product information support',
      'Shipping and delivery help',
      'Account management assistance',
      'Escalation to human agents'
    ],
    metrics: {
      'Response time': '< 30 seconds',
      'Resolution rate': '80%',
      'Support cost': '70% reduction'
    },
    color: 'purple'
  }
]

const ecommerceStats = [
  { metric: '35%', description: 'Average sales increase', icon: ChartBarIcon },
  { metric: '45%', description: 'Cart abandonment reduction', icon: ShoppingCartIcon },
  { metric: '80%', description: 'Issue resolution rate', icon: CheckCircleIcon },
  { metric: '24/7', description: 'Customer support availability', icon: ClockIcon },
  { metric: '70%', description: 'Support cost reduction', icon: CurrencyDollarIcon },
  { metric: '4.8/5', description: 'Customer satisfaction score', icon: HeartIcon }
]

const testimonial = {
  quote: "The AI shopping assistant transformed our customer experience. Sales are up 35%, cart abandonment is down significantly, and our customers love the personalized recommendations.",
  author: "Sarah Mitchell",
  title: "E-commerce Director",
  organization: "StyleHub Fashion"
}

export default function EcommercePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [solutionsRef, solutionsInView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-black"></div>
        <div className="relative max-width container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                E-commerce AI • 35% Sales Increase • 45% Less Cart Abandonment
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                E-commerce AI That 
                <span className="text-gradient"> Sells More</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your online store with AI that guides customers to purchase, automates operations, 
                and provides 24/7 support. <strong className="text-gray-900">Increase sales by 35% and reduce cart abandonment by 45%.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group" data-analytics="cta_click" data-label="ecommerce_hero_boost" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                  Boost E-commerce Sales
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#solutions" className="btn-outline">
                  View Solutions
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-green-600">1000+</div>
                  <div className="text-sm text-gray-600">E-commerce stores</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">35%</div>
                  <div className="text-sm text-gray-600">Sales increase</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-600">AI assistance</div>
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
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center">
                  <ShoppingCartIcon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">E-commerce Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Live</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {ecommerceStats.map((stat, index) => (
                      <motion.div
                        key={stat.description}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + 1 }}
                        className="text-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <stat.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">{stat.metric}</div>
                        <div className="text-xs text-gray-600">{stat.description}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Real-time e-commerce metrics</span>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* E-commerce Solutions */}
      <section id="solutions" ref={solutionsRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              E-commerce AI Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI tools designed to maximize sales, optimize operations, and delight customers
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {ecommerceSolutions.map((solution, index) => (
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
                          Platform Agnostic • Easy Integration • Scalable
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
                        Live Demo
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 bg-gray-50 p-8">
                    <h4 className="font-bold text-gray-900 mb-6">E-commerce Metrics</h4>
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
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-green-600 text-white">
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
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <ShoppingCartIcon className="w-8 h-8 text-white" />
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
      <section className="section-padding bg-green-600 text-white">
        <div className="max-width container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Boost Your E-commerce Sales?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join 1000+ e-commerce stores already using our AI solutions to increase sales, 
              reduce cart abandonment, and delight customers. Start your transformation today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact" className="btn-secondary" data-analytics="cta_click" data-label="ecommerce_bottom_trial" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
                Start Free Trial
              </Link>
              <Link href="/demo" className="btn-outline border-white text-white hover:bg-white hover:text-green-600" data-analytics="watch_demo_click" data-label="ecommerce_live_demo">
                See Live Demo
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Platform integration included
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
