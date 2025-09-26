'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const solutions = [
  { name: 'AI Phone Agents', href: '/solutions/phone-agents' },
  { name: 'Backend Automations', href: '/solutions/backend-automations' },
]

const industries = [
  { name: 'Healthcare', href: '/industries/healthcare' },
  { name: 'Legal Services', href: '/industries/legal' },
  { name: 'Real Estate', href: '/industries/real-estate' },
  { name: 'Financial Services', href: '/industries/financial-services' },
  { name: 'E-commerce', href: '/industries/ecommerce' },
  { name: 'Manufacturing', href: '/industries/manufacturing' },
]

const company = [
  { name: 'About Us', href: '/company/about' },
  { name: 'Console', href: '/app' },
]

const resources = [
  { name: 'Case Studies', href: '/resources/case-studies' },
  { name: 'White Papers', href: '/resources/whitepapers' },
  { name: 'ROI Calculator', href: '/roi-calculator' },
  { name: 'Implementation Guide', href: '/resources/implementation' },
  { name: 'FAQ', href: '/resources/faq' },
]

const legal = [
  { name: 'Privacy Policy', href: '/legal/privacy-policy' },
  { name: 'Terms of Service', href: '/legal/terms-of-service' },
  { name: 'Data Processing Agreement', href: '/legal/dpa' },
  { name: 'Security Overview', href: '/legal/security' },
]

const socialLinks = [
  { name: 'LinkedIn', href: 'https://linkedin.com/company/speakdirect', icon: 'linkedin' },
  { name: 'Twitter', href: 'https://twitter.com/speakdirect', icon: 'twitter' },
  { name: 'GitHub', href: 'https://github.com/speakdirect', icon: 'github' },
  { name: 'YouTube', href: 'https://youtube.com/@speakdirect', icon: 'youtube' },
]

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-width container-padding">
        <div className="section-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SD</span>
                </div>
                <span className="text-2xl font-bold">SpeakDirect</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Transforming businesses with enterprise-grade AI automation solutions. 
                Deploy intelligent agents in days, not months.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="sr-only">{social.name}</span>
                    <SocialIcon icon={social.icon} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Solutions</h3>
              <ul className="space-y-3">
                {solutions.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Industries</h3>
              <ul className="space-y-3">
                {industries.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {company.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    href="/contact" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources & Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-3 mb-6">
                {resources.slice(0, 3).map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <h4 className="text-md font-semibold mb-3 text-gray-200">Legal</h4>
              <ul className="space-y-2">
                {legal.slice(0, 2).map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 SpeakDirect, Inc. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-sm">All systems operational</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">SOC 2 Type II</span>
                <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                <span className="text-gray-400 text-sm">HIPAA Compliant</span>
                <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                <span className="text-gray-400 text-sm">GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-white/10 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Sales Inquiries</h4>
              <p className="text-gray-400 text-sm">SpeakDirectSales@gmail.com</p>
              <p className="text-gray-400 text-sm">1-800-666-4241</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Customer Support</h4>
              <p className="text-gray-400 text-sm">SpeakDirectSales@gmail.com</p>
              <p className="text-gray-400 text-sm">24/7 Enterprise Support</p>
            </div>
            {/* Mailing address intentionally removed */}
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon }: { icon: string }) {
  const iconClass = "w-5 h-5 fill-current"
  
  switch (icon) {
    case 'linkedin':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    case 'github':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    default:
      return null
  }
}
