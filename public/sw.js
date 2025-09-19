// A minimal service worker for offline caching of the app shell and basic routes

const CACHE_NAME = 'mbektemi-cache-v1'
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/icon-192.jpg',
  '/icon-512.jpg',
  '/apple-touch-icon.jpg',
]

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve())))
    ).then(() => self.clients.claim())
  )
})

// Fetch: network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // Only handle GET
  if (request.method !== 'GET') return

  // For navigation requests (HTML pages): network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() => caches.match(request).then((res) => res || caches.match('/')))
    )
    return
  }

  // For same-origin static assets: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return response
        })
      })
    )
  }
})