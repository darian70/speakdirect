'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useConsent } from './ConsentProvider'

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export function Analytics() {
  const pathname = usePathname()
  const { consent } = useConsent()
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID || ''
  const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID || ''
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || ''

  useEffect(() => {
    if (!consent.analytics || !GA_ID) return
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_ID, {
        page_path: pathname,
      })
    }
  }, [pathname, consent.analytics, GA_ID])

  return (
    <>
      {consent.analytics && (
        <>
          {/* Google Analytics */}
          {GA_ID && <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                ${GA_ID ? `gtag('config', '${GA_ID}', { page_path: window.location.pathname });` : ''}
              `,
            }}
          />
          {/* Hotjar */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${HOTJAR_ID || 0},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
            }}
          />
          {/* Microsoft Clarity */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+"${CLARITY_ID}";
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "CLARITY_ID");
              `,
            }}
          />
        </>
      )}
    </>
  )
}
