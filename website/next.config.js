/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: '',
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
    // Allow importing modules from outside the Next.js project root (used to mount SPA from repo root)
    externalDir: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  
  // Redirects (note: Next.js redirects are not applied when using `output: 'export'`)
  async redirects() {
    return [
      {
        source: '/company/news',
        destination: '/company/about',
        permanent: true,
      },
      {
        source: '/company/leadership',
        destination: '/company/about',
        permanent: true,
      },
    ]
  },
  
  // Security headers
  async headers() {
    // Build CSP dynamically to allow API and analytics hosts from env
    const connectSources = [
      "'self'",
      'https://www.google-analytics.com',
    ];
    const apiBase = process.env.NEXT_PUBLIC_SPEAKDIRECT_API_BASE || process.env.NEXT_PUBLIC_OMNI_API_BASE;
    const phHost = process.env.NEXT_PUBLIC_PH_HOST;
    const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
    if (apiBase) {
      try { connectSources.push(new URL(apiBase).origin); } catch (_) { /* noop */ }
    }
    if (phHost) {
      try { connectSources.push(new URL(phHost).origin); } catch (_) { connectSources.push(phHost); }
    }
    if (sentryDsn) {
      try { connectSources.push(new URL(sentryDsn).origin); } catch (_) { /* noop */ }
    }

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      `connect-src ${connectSources.join(' ')}`,
      "frame-ancestors 'none'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: csp
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
