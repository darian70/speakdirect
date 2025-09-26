import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  const routes = [
    '',
    '/legal/privacy',
    '/legal/terms',
    '/legal/aup',
    '/legal/dpa',
    '/status',
  ]
  const now = new Date()
  return routes.map((r) => ({ url: `${base}${r || '/'}`, lastModified: now }))
}
