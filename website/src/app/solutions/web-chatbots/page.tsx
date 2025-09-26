'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { 
  ChatBubbleLeftRightIcon, 
  GlobeAltIcon, 
  ShoppingCartIcon, 
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BoltIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const webChatbots = [
  {
    name: 'ConversaBot Pro',
    description: 'Advanced conversational AI for websites that engages visitors, answers questions, and converts leads with intelligent routing.',
    icon: ChatBubbleLeftRightIcon,
    features: [
      'Natural language understanding (NLU)',
      'Multi-language support (25+ languages)',
      'CRM integration (HubSpot, Salesforce)',
      'Lead scoring and qualification',
      'Seamless human handoff',
      'Custom branding and styling'
    ],
    industries: ['E-commerce', 'SaaS', 'Professional Services', 'Healthcare'],
    pricing: 'From $1,500 setup + $199/month',
    color: 'blue',
    metrics: {
      'Lead conversion': '3.5x increase',
      'Response time': '< 1 second',
      'Customer satisfaction': '4.9/5'
    }
  },
  {
    name: 'ShopAssist AI',
    description: 'E-commerce specialized chatbot that guides customers through product selection, handles orders, and provides personalized recommendations.',
    icon: ShoppingCartIcon,
    features: [
      'Product recommendation engine',
      'Inventory integration',
      'Order tracking and status',
      'Abandoned cart recovery',
      'Personalized shopping experience',
      'Payment processing assistance'
    ],
    industries: ['E-commerce', 'Retail', 'Fashion', 'Electronics'],
    pricing: 'From $2,500 setup + $299/month',
    color: 'green',
    metrics: {
      'Sales increase': '25%',
      'Cart abandonment': '40% reduction',
      'Support tickets': '60% reduction'
    }
  },
  {
    name: 'EduBot Scholar',
    description: 'Educational chatbot that assists students with course information, enrollment, and academic support with 24/7 availability.',
    icon: AcademicCapIcon,
    features: [
      'Course catalog integration',
      'Enrollment assistance',
      'Academic calendar sync',
      'Student portal integration',
      'Multilingual support',
      'Learning resource recommendations'
    ],
    industries: ['Education', 'Training', 'Universities', 'Online Learning'],
    pricing: 'From $2,000 setup + $249/month',
    color: 'purple',
    metrics: {
      'Enrollment rate': '30% increase',
      'Student satisfaction': '4.8/5',
      'Support efficiency': '5x improvement'
    }
  }
]

const benefits = [
  {
    icon: BoltIcon,
    title: 'Instant Responses',
    description: 'Engage visitors immediately with sub-second response times, preventing bounce and increasing engagement rates.'
  },
  {
    icon: UserGroupIcon,
    title: 'Scale Conversations',
    description: 'Handle unlimited concurrent conversations without additional staff, scaling your customer support infinitely.'
  },
  {
    icon: ChartBarIcon,
    title: 'Boost Conversions',
    description: 'Guide visitors through your sales funnel with personalized conversations that convert 3x better than forms.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise Ready',
    description: 'GDPR compliant, SOC 2 certified, with advanced security features and comprehensive audit trails.'
  }
]

const chatExample = {
  title: 'Live Chat Example: E-commerce Product Assistance',
  messages: [
    { speaker: 'Visitor', message: "I'm looking for a laptop for graphic design work" },
    { speaker: 'AI Bot', message: "I'd be happy to help you find the perfect laptop for graphic design! What's your budget range and do you have any brand preferences?" },
    { speaker: 'Visitor', message: "Around $2000-3000, preferably something powerful" },
    { speaker: 'AI Bot', message: "Perfect! For graphic design in that range, I recommend our MacBook Pro 16\" or the Dell XPS 15. Both have excellent displays and powerful processors. Would you like to see the specs?" },
    { speaker: 'Visitor', message: "Yes, show me the MacBook Pro details" },
    { speaker: 'AI Bot', message: "Great choice! The MacBook Pro 16\" features an M3 Pro chip, 18GB RAM, 512GB SSD, and a stunning Liquid Retina XDR display. It's $2,499 and currently has free shipping. Would you like me to add it to your cart?" }
  ]
}

const features = [
  {
    icon: SparklesIcon,
    title: 'AI-Powered Intelligence',
    description: 'Advanced NLP and machine learning algorithms that understand context, intent, and sentiment for natural conversations.',
    details: [
      'Context-aware responses',
      'Sentiment analysis',
      'Intent recognition',
      'Learning from interactions'
    ]
  },
  {
    icon: GlobeAltIcon,
    title: 'Omnichannel Integration',
    description: 'Seamlessly integrate across your website, mobile app, social media, and messaging platforms for unified customer experience.',
    details: [
      'Website widget',
      'Mobile app SDK',
      'Facebook Messenger',
      'WhatsApp Business API'
    ]
  },
  {
    icon: ChartBarIcon,
    title: 'Advanced Analytics',
    description: 'Comprehensive insights into customer interactions, conversion paths, and performance metrics with real-time dashboards.',
    details: [
      'Conversation analytics',
      'Conversion tracking',
      'Performance metrics',
      'Custom reporting'
    ]
  },
  {
    icon: ClockIcon,
    title: '24/7 Availability',
    description: 'Never miss a customer inquiry with round-the-clock availability that maintains consistent service quality.',
    details: [
      'Always online',
      'Consistent responses',
      'Global time zone support',
      'Holiday coverage'
    ]
  }
]

const integrations = [
  { name: 'Shopify', logo: '/logos/shopify.svg' },
  { name: 'WooCommerce', logo: '/logos/woocommerce.svg' },
  { name: 'HubSpot', logo: '/logos/hubspot.svg' },
  { name: 'Salesforce', logo: '/logos/salesforce.svg' },
  { name: 'Zendesk', logo: '/logos/zendesk.svg' },
  { name: 'Intercom', logo: '/logos/intercom.svg' },
  { name: 'Slack', logo: '/logos/slack.svg' },
  { name: 'WordPress', logo: '/logos/wordpress.svg' }
]

export default function WebChatbotsPage() {
  const router = useRouter()
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [chatbotsRef, chatbotsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    router.replace('/solutions/phone-agents')
  }, [router])

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
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                Web Chatbots • Instant Engagement • 3x Higher Conversions
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Web Chatbots That 
                <span className="text-gradient"> Convert Visitors</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your website into a conversion machine with AI chatbots that engage visitors instantly, 
                answer questions intelligently, and guide them to purchase. <strong className="text-gray-900">Increase conversions by 350% and reduce support costs by 80%.</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact" className="btn-primary group">
                  See Live Demo
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#solutions" className="btn-outline">
                  Browse Solutions
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-green-600">1M+</div>
                  <div className="text-sm text-gray-600">Conversations handled</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">350%</div>
                  <div className="text-sm text-gray-600">Conversion increase</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">&lt; 1s</div>
                  <div className="text-sm text-gray-600">Response time</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Live Chat Session</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Online</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {chatExample.messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.4 + 1 }}
                        className={`flex ${msg.speaker === 'AI Bot' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                          msg.speaker === 'AI Bot' 
                            ? 'bg-gray-100 text-gray-900' 
                            : 'bg-green-500 text-white'
                        }`}>
                          <div className={`text-xs mb-1 ${
                            msg.speaker === 'AI Bot' ? 'text-gray-500' : 'text-white/80'
                          }`}>
                            {msg.speaker}
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Product recommended & added to cart</span>
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
              Why Web Chatbots?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn every website visitor into a potential customer with intelligent, engaging conversations
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
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-green-600" />
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

      {/* Chatbot Solutions */}
      <section id="solutions" ref={chatbotsRef} className="section-padding bg-gray-50">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={chatbotsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Web Chatbot Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built chatbots for every industry and use case, deployed in hours
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {webChatbots.map((chatbot, index) => (
              <motion.div
                key={chatbot.name}
                initial={{ opacity: 0, y: 30 }}
                animate={chatbotsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card overflow-hidden"
              >
                <div className="lg:flex">
                  <div className="lg:w-2/3 p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        chatbot.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        chatbot.color === 'green' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <chatbot.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {chatbot.name}
                        </h3>
                        <div className={`text-lg font-semibold ${
                          chatbot.color === 'blue' ? 'text-blue-600' :
                          chatbot.color === 'green' ? 'text-green-600' :
                          'text-purple-600'
                        }`}>
                          {chatbot.pricing}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {chatbot.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {chatbot.features.map((feature) => (
                        <div key={feature} className="flex items-start space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="text-sm text-gray-600 font-medium">Ideal for:</span>
                      {chatbot.industries.map((industry) => (
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
                        href="#demo"
                        className="btn-outline"
                      >
                        Try Demo
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 bg-gray-50 p-8">
                    <h4 className="font-bold text-gray-900 mb-6">Performance Metrics</h4>
                    <div className="space-y-6">
                      {Object.entries(chatbot.metrics).map(([metric, value]) => (
                        <div key={metric}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">{metric}</span>
                            <span className={`text-2xl font-bold ${
                              chatbot.color === 'blue' ? 'text-blue-600' :
                              chatbot.color === 'green' ? 'text-green-600' :
                              'text-purple-600'
                            }`}>
                              {value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-white rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">Live Preview</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        See {chatbot.name} in action on a demo site
                      </p>
                      <Link 
                        href="/demo"
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        View Demo →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="section-padding bg-white">
        <div className="max-width container-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Advanced Features & Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade features that deliver exceptional user experiences and business results
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex space-x-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center text-sm text-gray-700">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
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
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing tools and platforms for a unified customer experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-600">{integration.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don't see your platform? We integrate with 100+ tools.</p>
            <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700">
              Request Custom Integration →
            </Link>
          </div>
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
              Ready to 3x Your Website Conversions?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses using our Web Chatbots to engage visitors, 
              capture leads, and drive sales 24/7. Setup takes less than 30 minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/contact" className="btn-secondary">
                Start Free Trial
              </Link>
              <Link href="/demo" className="btn-outline border-white text-white hover:bg-white hover:text-green-600">
                Try Interactive Demo
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white/80">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Setup in 30 minutes
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
