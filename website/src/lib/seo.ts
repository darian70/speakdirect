import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noIndex?: boolean
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = 'https://speakdirect.ai'
  const defaultImage = `${baseUrl}/og-image.jpg`
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    robots: config.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonical ? `${baseUrl}${config.canonical}` : baseUrl,
      siteName: 'SpeakDirect',
      images: [
        {
          url: config.ogImage || defaultImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [config.ogImage || defaultImage],
      creator: '@speakdirect',
      site: '@speakdirect',
    },
    
    alternates: {
      canonical: config.canonical ? `${baseUrl}${config.canonical}` : baseUrl,
    },
    
    other: {
      'application-name': 'SpeakDirect',
      'apple-mobile-web-app-title': 'SpeakDirect',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-config': '/browserconfig.xml',
      'msapplication-TileColor': '#2563eb',
      'msapplication-tap-highlight': 'no',
      'theme-color': '#2563eb',
    },
  }
}

// Structured Data Schemas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SpeakDirect',
  description: 'Enterprise AI Automation Solutions - AI Phone Agents plus Backend Automations with SOC 2/HIPAA compliance and CRM/RPA integrations.',
  url: 'https://speakdirect.ai',
  logo: 'https://speakdirect.ai/logo.png',
  foundingDate: '2023',
  founders: [
    {
      '@type': 'Person',
      name: 'Sarah Chen',
      jobTitle: 'CEO & Co-Founder'
    },
    {
      '@type': 'Person', 
      name: 'Michael Rodriguez',
      jobTitle: 'CTO & Co-Founder'
    }
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-800-666-4241',
    contactType: 'customer service',
    email: 'SpeakDirectSales@gmail.com',
    availableLanguage: 'English'
  },
  sameAs: [
    'https://linkedin.com/company/speakdirect',
    'https://twitter.com/speakdirect'
  ]
}

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SpeakDirect AI Platform',
  description: 'Enterprise AI automation platform for phone agents, chatbots, document processing, and workflow automation.',
  url: 'https://speakdirect.ai',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web-based',
  offers: {
    '@type': 'Offer',
    price: '2500',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '2500',
      priceCurrency: 'USD',
      billingDuration: 'P1M'
    }
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '127',
    bestRating: '5',
    worstRating: '1'
  }
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Automation Services',
  description: 'Comprehensive AI automation solutions including phone agents, web chatbots, document processing, and workflow automation for enterprises.',
  provider: {
    '@type': 'Organization',
    name: 'SpeakDirect'
  },
  serviceType: 'AI Automation',
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'AI Solutions',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Phone Agents',
          description: '24/7 AI-powered phone agents for customer service, appointment scheduling, and lead qualification.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Chatbots',
          description: 'Intelligent web chatbots for customer support, lead capture, and sales automation.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Document Processing',
          description: 'AI-powered document processing and data extraction with 99.7% accuracy.'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Workflow Automation',
          description: 'End-to-end workflow automation to streamline business operations.'
        }
      }
    ]
  }
}

// SEO Page Configurations
export const seoConfigs = {
  home: {
    title: 'SpeakDirect - AI Phone Agents Platform & Backend Automations',
    description: 'AI Phone Agents that handle inbound/outbound calls plus secure backend automations. Bookings, qualification, and support with SOC 2/HIPAA-grade orchestration. Reduce costs by 75%.',
    keywords: ['AI phone agents', 'voice AI', 'call automation', 'inbound dialer', 'outbound dialer', 'backend automations', 'CRM integration', 'HIPAA', 'SOC 2', 'workflow automation'],
    canonical: '/'
  },
  
  phoneAgents: {
    title: 'AI Phone Agents - 24/7 Customer Service Automation | SpeakDirect',
    description: 'Deploy AI phone agents that handle customer service, appointments & lead qualification 24/7. Reduce call center costs by 75%. HIPAA compliant. Free demo available.',
    keywords: ['AI phone agents', 'automated customer service', 'call center automation', 'AI receptionist', 'phone automation', 'virtual agents'],
    canonical: '/solutions/phone-agents'
  },
  
  webChatbots: {
    title: 'AI Web Chatbots - Intelligent Customer Support & Lead Generation | SpeakDirect',
    description: 'Smart web chatbots that provide instant customer support, capture leads, and boost conversions. 95% accuracy, easy integration. Start your free trial today.',
    keywords: ['AI chatbots', 'web chatbots', 'customer support automation', 'lead generation', 'conversational AI', 'chat automation'],
    canonical: '/solutions/web-chatbots'
  },
  
  documentProcessing: {
    title: 'AI Document Processing - Automated Data Extraction & Processing | SpeakDirect',
    description: 'Process documents 10x faster with AI. 99.7% accuracy, HIPAA compliant, supports all formats. Reduce manual data entry costs by 80%. See demo.',
    keywords: ['AI document processing', 'automated data extraction', 'document automation', 'OCR', 'intelligent document processing', 'data entry automation'],
    canonical: '/solutions/document-processing'
  },
  
  workflowAutomation: {
    title: 'Workflow Automation - Streamline Business Processes with AI | SpeakDirect',
    description: 'Automate complex workflows with AI. Reduce manual tasks by 85%, improve efficiency, and scale operations. Custom workflows for any business process.',
    keywords: ['workflow automation', 'business process automation', 'AI workflows', 'process optimization', 'task automation', 'business automation'],
    canonical: '/solutions/workflow-automation'
  },
  
  backendAutomations: {
    title: 'Backend Automations - Low-Latency Orchestration & Compliance | SpeakDirect',
    description: 'Low-latency backend orchestration with CRM/RPA integrations, data validation, and SOC 2/HIPAA-grade compliance. Build reliable automations that scale.',
    keywords: ['backend automations', 'orchestration', 'RPA', 'CRM integrations', 'data validation', 'audit trails', 'workflow automation'],
    canonical: '/solutions/backend-automations'
  },
  
  healthcare: {
    title: 'Healthcare AI Solutions - HIPAA Compliant Automation | SpeakDirect',
    description: 'HIPAA-compliant AI solutions for healthcare. Patient scheduling, medical records processing, telehealth support. Reduce costs, improve patient care.',
    keywords: ['healthcare AI', 'HIPAA compliant AI', 'medical automation', 'patient scheduling', 'healthcare chatbots', 'medical AI'],
    canonical: '/industries/healthcare'
  },
  
  legal: {
    title: 'Legal AI Solutions - Bar Compliant Automation for Law Firms | SpeakDirect',
    description: 'AI solutions for law firms. Client intake, contract analysis, legal research automation. Bar association compliant. Reduce billable hour costs.',
    keywords: ['legal AI', 'law firm automation', 'legal chatbots', 'contract analysis', 'legal research AI', 'attorney automation'],
    canonical: '/industries/legal'
  },
  
  ecommerce: {
    title: 'E-commerce AI Solutions - Boost Sales & Customer Support | SpeakDirect',
    description: 'AI solutions for e-commerce. Smart chatbots, order automation, customer support. Increase conversions by 35%, reduce cart abandonment.',
    keywords: ['ecommerce AI', 'retail automation', 'shopping chatbots', 'order automation', 'customer support AI', 'sales automation'],
    canonical: '/industries/ecommerce'
  },
  
  financialServices: {
    title: 'Financial Services AI - Compliant Banking & Finance Automation | SpeakDirect',
    description: 'AI solutions for financial services. Compliant with SOX, PCI DSS, FFIEC. Loan processing, fraud detection, customer service automation.',
    keywords: ['financial AI', 'banking automation', 'fintech AI', 'compliance automation', 'loan processing', 'fraud detection AI'],
    canonical: '/industries/financial-services'
  },
  
  caseStudies: {
    title: 'Customer Success Stories - AI Automation Case Studies | SpeakDirect',
    description: 'Real results from AI automation. See how companies saved $50M+ with our solutions. Detailed case studies across healthcare, finance, and more.',
    keywords: ['AI case studies', 'automation success stories', 'ROI case studies', 'customer testimonials', 'AI results', 'business transformation'],
    canonical: '/case-studies'
  },
  
  roiCalculator: {
    title: 'ROI Calculator - Calculate AI Automation Savings | SpeakDirect',
    description: 'Calculate your potential savings with AI automation. Interactive ROI calculator shows real-time results. Most clients see 200-400% ROI.',
    keywords: ['ROI calculator', 'AI savings calculator', 'automation ROI', 'cost savings calculator', 'AI investment calculator'],
    canonical: '/roi-calculator'
  },
  
  contact: {
    title: 'Contact Us - Get Your Free AI Consultation | SpeakDirect',
    description: 'Get a free consultation with our AI experts. Personalized demo, custom pricing, and implementation plan. Response within 2 hours guaranteed.',
    keywords: ['AI consultation', 'contact AI experts', 'free demo', 'AI implementation', 'enterprise AI consultation'],
    canonical: '/contact'
  },
  
  about: {
    title: 'About SpeakDirect - Leading Enterprise AI Automation Company',
    description: 'Learn about SpeakDirect, the leading provider of enterprise AI automation solutions. Founded by AI experts from Google, Microsoft, and Salesforce.',
    keywords: ['about SpeakDirect', 'AI company', 'enterprise automation', 'AI leadership team', 'company history'],
    canonical: '/company/about'
  },
  
}
