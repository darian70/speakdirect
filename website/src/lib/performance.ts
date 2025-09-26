// Performance monitoring and optimization utilities

export interface WebVitals {
  name: string
  value: number
  id: string
  delta: number
}

export function reportWebVitals(metric: WebVitals) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric)
  }

  // In production, you would send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      })
    }
  }
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  // Preload critical fonts
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ]

  fontLinks.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    link.onload = () => {
      link.rel = 'stylesheet'
    }
    document.head.appendChild(link)
  })

  // Preload critical images
  const criticalImages = [
    '/hero-bg.jpg',
    '/logo.png'
  ]

  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}

// Optimize third-party scripts
export function loadThirdPartyScript(src: string, async = true, defer = true) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = async
    script.defer = defer
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Memory management for large components
export function createMemoryOptimizedComponent<T>(
  component: T,
  cleanup?: () => void
): T {
  if (typeof window === 'undefined') return component

  // Register cleanup function
  if (cleanup) {
    window.addEventListener('beforeunload', cleanup)
  }

  return component
}

// Debounce utility for performance-sensitive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// Throttle utility for scroll/resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Resource hints for better loading
export function addResourceHints() {
  if (typeof window === 'undefined') return

  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
  ]

  hints.forEach(hint => {
    const link = document.createElement('link')
    link.rel = hint.rel
    link.href = hint.href
    if (hint.crossOrigin) {
      link.crossOrigin = hint.crossOrigin
    }
    document.head.appendChild(link)
  })
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production'
  ) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('SW registered: ', registration)
        }
      })
      .catch(registrationError => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('SW registration failed: ', registrationError)
        }
      })
  }
}
