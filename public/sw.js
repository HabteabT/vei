/* Offline support: after the first visit, the app opens without a connection.
   Only files from our own site are cached. Calls to Entur and Open-Meteo always go to the network. */
const CACHE = 'vei-v1'

self.addEventListener('install', () => self.skipWaiting())

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
  if (new URL(request.url).origin !== self.location.origin) return

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)
      const cached = await cache.match(request)
      const refresh = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone())
          return response
        })
        .catch(() => null)
      if (cached) {
        event.waitUntil(refresh)
        return cached
      }
      return (await refresh) || (await cache.match('./')) || Response.error()
    })(),
  )
})
