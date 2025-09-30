"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { usePlan } from '../../lib/plan'
import { hasFeature } from '@shared/plans'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

type NavItem = { label: string; href: string; requires?: { feature?: 'channels.voice' | 'channels.sms' | 'analytics.advanced' | 'security.sso' } }

const nav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Calls', href: '/calls' },
  { label: 'Agents', href: '/agents' },
  { label: 'Technicians', href: '/console/technicians', requires: { feature: 'channels.voice' } },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Settings', href: '/settings' },
  { label: 'Billing', href: '/billing' },
]

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { plan, planId } = ((): { plan: ReturnType<typeof usePlan>['plan']; planId: ReturnType<typeof usePlan>['planId'] } => {
    const hook = usePlan()
    return { plan: hook.plan, planId: hook.planId }
  })()

  // Ensure the tenant exists in the backend (maps Clerk org/user -> Tenant row)
  useEffect(() => {
    fetch('/api/tenants/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500" />
            <span className="text-sm font-semibold text-white/90">SpeakDirect Console</span>
            <span className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] bg-white/10 text-white/70">{plan.name} plan</span>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            {nav
              .filter((n) => !n.requires?.feature || hasFeature(planId, n.requires.feature))
              .map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`text-xs px-2 py-1 rounded-lg border border-transparent ${pathname === n.href ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:border-white/20'}`}
                >
                  {n.label}
                </Link>
              ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="text-xs text-white/50">v0.1</div>
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: 'h-7 w-7' } }} />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="text-xs text-white/80 hover:text-white">Sign in</Link>
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
