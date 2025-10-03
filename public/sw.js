const CACHE_NAME = 'pwa-next-v2';

const PRECACHE_URLS = [
  '/',
  '/room',
  '/reception',
  '/gallery',
  '/offline.html'
];

// INSTALL : on met en cache les fichiers essentiels
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// ACTIVATE : on nettoie les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// FETCH : stratégie réseau + fallback offline
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Navigation (pages HTML)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Pour les assets (CSS, JS, images) → cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
