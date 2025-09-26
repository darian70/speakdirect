'use client'

import { Dialog } from '@headlessui/react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

const ROUTES: Array<{ title: string; href: string; group: string }> = [
  { title: 'Home', href: '/', group: 'General' },
  { title: 'Solutions', href: '/solutions', group: 'Solutions' },
  { title: 'AI Phone Agents', href: '/solutions/phone-agents', group: 'Solutions' },
  { title: 'Backend Automations', href: '/solutions/backend-automations', group: 'Solutions' },
  { title: 'Industries', href: '/industries', group: 'Industries' },
  { title: 'Healthcare', href: '/industries/healthcare', group: 'Industries' },
  { title: 'Legal Services', href: '/industries/legal', group: 'Industries' },
  { title: 'Financial Services', href: '/industries/financial-services', group: 'Industries' },
  { title: 'E-commerce', href: '/industries/ecommerce', group: 'Industries' },
  { title: 'Manufacturing', href: '/industries/manufacturing', group: 'Industries' },
  { title: 'Real Estate', href: '/industries/real-estate', group: 'Industries' },
  { title: 'Professional Services', href: '/industries/professional-services', group: 'Industries' },
  { title: 'Case Studies', href: '/case-studies', group: 'Resources' },
  { title: 'Resources', href: '/resources', group: 'Resources' },
  { title: 'White Papers', href: '/resources/whitepapers', group: 'Resources' },
  { title: 'Implementation Guide', href: '/resources/implementation', group: 'Resources' },
  { title: 'FAQ', href: '/resources/faq', group: 'Resources' },
  { title: 'ROI Calculator', href: '/roi-calculator', group: 'Resources' },
  { title: 'About Us', href: '/company/about', group: 'Company' },
  { title: 'Security Overview', href: '/legal/security', group: 'Trust' },
  { title: 'Privacy Policy', href: '/legal/privacy-policy', group: 'Trust' },
  { title: 'Terms of Service', href: '/legal/terms-of-service', group: 'Trust' },
  { title: 'Data Processing Agreement', href: '/legal/dpa', group: 'Trust' },
  { title: 'Trust Center', href: '/trust', group: 'Trust' },
]

export default function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    const openHandler = () => setOpen(true)
    const closeHandler = () => setOpen(false)
    window.addEventListener('open-search', openHandler as any)
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    })
    return () => {
      window.removeEventListener('open-search', openHandler as any)
      window.removeEventListener('keydown', closeHandler as any)
    }
  }, [])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return ROUTES
    return ROUTES.filter(r => r.title.toLowerCase().includes(term) || r.href.toLowerCase().includes(term) || r.group.toLowerCase().includes(term))
  }, [q])

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-[200]">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-start justify-center p-4 mt-20">
        <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-xl dark:bg-black dark:border dark:border-white/10">
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search pages… (press / to open)"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:bg-white/5 dark:text-white"
          />
          <div className="mt-3 max-h-80 overflow-auto divide-y divide-gray-100 dark:divide-white/10">
            {results.map((r, i) => (
              <Link key={i} href={r.href} className="block px-3 py-3 hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg" onClick={() => setOpen(false)}>
                <div className="text-sm text-gray-500 dark:text-gray-400">{r.group}</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{r.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{r.href}</div>
              </Link>
            ))}
            {results.length === 0 && (
              <div className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">No results</div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
