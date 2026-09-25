/* Offline support: after the first visit, the app opens without a connection.
   Only files from our own site are cached. Calls to Entur and Open-Meteo always go to the network. */
const CACHE = 'vei-v2'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  // Never intercept the worker script. The browser must be able to see a new version.
  if (url.pathname.endsWith('/sw.js')) return

  const cachePromise = caches.open(CACHE)
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cachePromise.then((cache) => cache.put(request, response.clone())).catch(() => undefined)
      }
      return response
    })
    .catch(() => null)

  // Called in the event handler itself, so the update is allowed to finish after we reply.
  event.waitUntil(networkPromise.then(() => undefined))
  event.respondWith(
    cachePromise.then(async (cache) => {
      const cached = await cache.match(request)
      if (cached) return cached
      return (await networkPromise) || (await cache.match('./index.html')) || Response.error()
    }),
  )
})
