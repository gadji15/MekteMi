// Simple service worker for offline caching
// In development (localhost), automatically unregister to avoid interfering with Next.js dev server.

const isLocalDev =
  (self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1") &&
  (self.location.port === "3000" || self.location.port === "5173" || self.location.port === "")

if (isLocalDev) {
  self.addEventListener("install", (event) => {
    event.waitUntil(self.skipWaiting())
  })

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      self.registration
        .unregister()
        .then(() =>
          self.clients.matchAll({ type: "window" }).then((clients) => {
            clients.forEach((client) => client.navigate(client.url))
          }),
        )
        .catch(() => {}),
    )
  })

  // Do not add any fetch handlers in dev
} else {
  const CACHE_NAME = "mbektemi-v1"
  const STATIC_ASSETS = [
    "/",
    "/horaires",
    "/inscription",
    "/notifications",
    "/points-interet",
    "/programme",
    "/manifest.json",
    "/icon-192.jpg",
    "/icon-512.jpg",
    "/icon.jpg",
    "/apple-touch-icon.jpg",
  ]

  // Install: pre-cache core assets
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()),
    )
  })

  // Activate: cleanup old caches
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => (k === CACHE_NAME ? undefined : caches.delete(k)))))
        .then(() => self.clients.claim()),
    )
  })

  // Fetch strategy
  self.addEventListener("fetch", (event) => {
    const { request } = event

    // Only handle GET
    if (request.method !== "GET") return

    const url = new URL(request.url)
    const isSameOrigin = self.location.origin === url.origin

    // Static pages/assets: Cache First
    if (isSameOrigin && (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith("/_next/static/"))) {
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) return cached
          return fetch(request)
            .then((res) => {
              const resClone = res.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone)).catch(() => {})
              return res
            })
            .catch(() => cached)
        }),
      )
      return
    }

    // Dynamic/API requests: Network First with fallback to cache
    event.respondWith(
      fetch(request)
        .then((res) => {
          const resClone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone)).catch(() => {})
          return res
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached
            // Optional: offline fallback page could be served here
            return new Response("Vous êtes hors ligne.", { status: 503, statusText: "Service Unavailable" })
          }),
        ),
    )
  })
}