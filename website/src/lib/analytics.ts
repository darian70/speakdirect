export type AnalyticsEvent = {
  name: string
  params?: Record<string, any>
}

export function track(event: AnalyticsEvent) {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', event.name, event.params || {})
    }
    if (typeof window !== 'undefined' && (window as any).clarity) {
      ;(window as any).clarity('event', event.name)
    }
  } catch {}
}
