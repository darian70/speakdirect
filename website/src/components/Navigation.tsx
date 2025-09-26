'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const solutions = [
  { name: 'AI Phone Agents', href: '/solutions/phone-agents', description: 'Inbound/outbound voice: booking, qualification, support' },
  { name: 'Backend Automations', href: '/solutions/backend-automations', description: 'Low-latency orchestration, CRM/RPA, compliance' },
]

const industries = [
  { name: 'Healthcare', href: '/industries/healthcare' },
  { name: 'Legal Services', href: '/industries/legal' },
  { name: 'Real Estate', href: '/industries/real-estate' },
  { name: 'Financial Services', href: '/industries/financial-services' },
  { name: 'E-commerce', href: '/industries/ecommerce' },
  { name: 'Manufacturing', href: '/industries/manufacturing' },
  { name: 'Professional Services', href: '/industries/professional-services' },
]

const company = [
  { name: 'About Us', href: '/company/about' },
]

const resources = [
  { name: 'Case Studies', href: '/resources/case-studies' },
  { name: 'White Papers', href: '/resources/whitepapers' },
  { name: 'ROI Calculator', href: '/roi-calculator' },
  { name: 'Implementation Guide', href: '/resources/implementation' },
  { name: 'FAQ', href: '/resources/faq' },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm dark:bg-black/90 dark:shadow-sm' 
        : 'bg-white dark:bg-black'
    }`}>
      <nav className="flex items-center justify-between p-6 lg:px-8 max-width container-padding" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">SpeakDirect</span>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SD</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">SpeakDirect</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          <DropdownMenu title="Solutions" items={solutions} />
          <DropdownMenu title="Industries" items={industries} />
          <DropdownMenu title="Company" items={company} />
          <DropdownMenu title="Resources" items={resources} />
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
            onClick={() => {
              window.dispatchEvent(new Event('open-search'))
            }}
            data-analytics="open_search"
          >
            Search /
          </button>
          <Link 
            href="/app" 
            className={`text-sm font-semibold leading-6 transition-colors ${
              isActive('/app') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/agents" 
            className={`text-sm font-semibold leading-6 transition-colors ${
              isActive('/agents') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400'
            }`}
          >
            Agents
          </Link>
          <Link 
            href="/pricing" 
            className={`text-sm font-semibold leading-6 transition-colors ${
              isActive('/pricing') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400'
            }`}
          >
            Pricing
          </Link>
          <Link 
            href="/contact" 
            className={`text-sm font-semibold leading-6 transition-colors ${
              isActive('/contact') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400'
            }`}
          >
            Contact
          </Link>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Link href="/sign-in" className="btn-secondary">Sign in</Link>
          <Link href="/contact" className="btn-primary" data-analytics="cta_click" data-label="nav_get_demo" data-calendly data-calendly-url="https://calendly.com/speakdirect/demo-30min">
            Get Demo
          </Link>
        </div>
      </nav>
      
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-black dark:sm:ring-white/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">SpeakDirect</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SD</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">SpeakDirect</span>
              </div>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <MobileDropdown title="Solutions" items={solutions} onClose={() => setMobileMenuOpen(false)} />
                <MobileDropdown title="Industries" items={industries} onClose={() => setMobileMenuOpen(false)} />
                <MobileDropdown title="Company" items={company} onClose={() => setMobileMenuOpen(false)} />
                <MobileDropdown title="Resources" items={resources} onClose={() => setMobileMenuOpen(false)} />
                <Link
                  href="/app"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/sign-in"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/agents"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Agents
                </Link>
                <Link
                  href="/pricing"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/contact"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
              <div className="py-6">
                <Link
                  href="/contact"
                  className="btn-primary w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Demo
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

function DropdownMenu({ title, items }: { title: string; items: Array<{ name: string; href: string; description?: string }> }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  const isActive = items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))

  return (
    <div className="relative">
      <button
        type="button"
        className={`flex items-center gap-x-1 text-sm font-semibold leading-6 transition-colors ${
          isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {title}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-black dark:ring-white/10"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="p-4">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  <div className="flex-auto">
                    <Link href={item.href} className="block font-semibold text-gray-900 dark:text-gray-100">
                      {item.name}
                      <span className="absolute inset-0" />
                    </Link>
                    {item.description && (
                      <p className="mt-1 text-gray-600 dark:text-gray-400">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileDropdown({ title, items, onClose }: { 
  title: string; 
  items: Array<{ name: string; href: string; description?: string }>; 
  onClose: () => void 
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 space-y-2"
          >
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-white/10"
                onClick={onClose}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
