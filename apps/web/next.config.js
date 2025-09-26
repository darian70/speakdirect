/** @type {import('next').NextConfig} */
const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // Allow Clerk's scripts (prod and dev domains)
      "script-src 'self' 'unsafe-inline' https://*.posthog.com https://cdn.jsdelivr.net https://clerk.com https://*.clerk.services https://*.clerk.dev https://*.accounts.dev",
      "style-src 'self' 'unsafe-inline'",
      // Images from Clerk domains (prod and dev)
      "img-src 'self' data: https://clerk.com https://*.clerk.services https://*.clerk.dev https://*.accounts.dev",
      // Allow XHR/WebSocket to Clerk endpoints (prod and dev)
      "connect-src 'self' https://*.posthog.com https://*.sentry.io https://clerk.com https://*.clerk.services https://*.clerk.dev https://*.accounts.dev",
      // Clerk renders content in iframes for hosted flows (prod and dev)
      "frame-src https://clerk.com https://*.clerk.services https://*.clerk.dev https://*.accounts.dev",
      "frame-ancestors 'none'",
    ].join('; ');
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@agents-sdk': path.resolve(__dirname, '../../packages/agents-sdk/src'),
    };
    return config;
  },
};
module.exports = withSentryConfig(nextConfig, { silent: true });
