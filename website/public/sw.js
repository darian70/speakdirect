// Service Worker for caching and offline functionality
const CACHE_NAME = 'omniagents-v1'
const urlsToCache = [
  '/',
  '/solutions/phone-agents',
  '/solutions/web-chatbots',
  '/solutions/document-processing',
  '/solutions/workflow-automation',
  '/industries/healthcare',
  '/industries/legal',
  '/industries/ecommerce',
  '/industries/financial-services',
  '/company/about',
  '/company/leadership',
  '/company/careers',
  '/case-studies',
  '/roi-calculator',
  '/contact',
  '/legal/privacy-policy',
  '/legal/terms-of-service',
  '/_next/static/css/',
  '/_next/static/js/',
  '/favicon.ico',
  '/logo.png'
]

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
