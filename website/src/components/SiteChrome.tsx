'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'

const SearchDialog = dynamic(() => import('@/components/SearchDialog'), { ssr: false })
const AIChat = dynamic(() => import('@/components/AIChat').then(m => m.AIChat), { ssr: false })

export default function SiteChrome({ children }: { children: any }) {
  const pathname = usePathname()
  const hideChrome = pathname?.startsWith('/omni') || pathname?.startsWith('/speakdirect')

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {!hideChrome && <Navigation />}
        <main id="main-content" role="main" className="flex-grow">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        {!hideChrome && <Footer />}
      </div>
      {!hideChrome && <SearchDialog />}
      {!hideChrome && <AIChat />}
    </>
  )
}
