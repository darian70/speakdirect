import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/SiteChrome'
import { Analytics } from '@/components/Analytics'
import StructuredData from '@/components/StructuredData'
import ObservabilityInit from '@/components/ObservabilityInit'
import { preloadCriticalResources, addResourceHints, registerServiceWorker } from '@/lib/performance'
import { ConsentProvider } from '@/components/ConsentProvider'
import ConsentBanner from '@/components/ConsentBanner'
import Events from '@/components/Events'
import CalendlyWidget from '@/components/calendly/CalendlyWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'SpeakDirect - AI Phone Agents Platform & Backend Automations',
    template: '%s | SpeakDirect'
  },
  description: 'AI Phone Agents that handle inbound/outbound calls plus secure backend automations. Bookings, qualification, and support with SOC 2/HIPAA-grade orchestration.',
  keywords: ['AI phone agents', 'voice AI', 'call automation', 'inbound dialer', 'outbound dialer', 'backend automations', 'workflow automation', 'HIPAA', 'SOC 2', 'CRM integration'],
  authors: [{ name: 'SpeakDirect' }],
  creator: 'SpeakDirect',
  publisher: 'SpeakDirect',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://speakdirect.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://speakdirect.ai',
    title: 'SpeakDirect - AI Phone Agents Platform & Backend Automations',
    description: 'AI Phone Agents for bookings, qualification, and support plus secure backend automations with SOC 2/HIPAA-grade orchestration.',
    siteName: 'SpeakDirect',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SpeakDirect - Enterprise AI Automation Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpeakDirect - AI Phone Agents Platform & Backend Automations',
    description: 'AI Phone Agents + Backend Automations for enterprise.',
    images: ['/og-image.jpg'],
    creator: '@speakdirect',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-token',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:p-3 focus:rounded focus:shadow z-[1000]"
        >
          Skip to content
        </a>
        <StructuredData schema="organization" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (${preloadCriticalResources.toString()})();
              (${addResourceHints.toString()})();
              (${registerServiceWorker.toString()})();
            `
          }}
        />
        <ConsentProvider>
          <SiteChrome>
            {children}
          </SiteChrome>
          <ObservabilityInit />
          <Analytics />
          <CalendlyWidget />
          <Events />
          <ConsentBanner />
        </ConsentProvider>
      </body>
    </html>
  )
}
