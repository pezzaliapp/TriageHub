// TriageHub Service Worker
// Strategy: cache-first per asset statici, network-first per index.html (così gli update arrivano)

const CACHE_VERSION = 'triagehub-v1.3.4';
const CORE_ASSETS = [
  './',
  './index.html',
  './xlsx.full.min.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

// INSTALL: pre-cache degli asset core
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE: pulisci vecchie cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.filter(n => n !== CACHE_VERSION).map(n => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH: strategy per route
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Google Fonts: cache-first con fallback
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(c => c.put(request, copy));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // index.html: network-first per ricevere update
  if (request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname === '/' || url.pathname.endsWith('/TriageHub/')) {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(c => c.put(request, copy));
        }
        return response;
      }).catch(() => caches.match(request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // Tutto il resto: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(c => c.put(request, copy));
        }
        return response;
      });
    })
  );
});
