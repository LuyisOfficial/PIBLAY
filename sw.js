const CACHE_NAME = 'piblay-v3'; // 🔥 change à chaque update

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './images/logo.png',
  './offline.html'
];

// ================= INSTALL =================
self.addEventListener('install', event => {
  console.log('PIBLAY SW: Install');

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(err => console.error('Cache error:', err))
  );
});

// ================= ACTIVATE =================
self.addEventListener('activate', event => {
  console.log('PIBLAY SW: Activate');

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Delete old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ================= FETCH =================
self.addEventListener('fetch', event => {

  // 🔹 Pages HTML → network first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request)
            .then(res => res || caches.match('./offline.html'));
        })
    );
    return;
  }

  // 🔹 fichiers statiques → cache first
  event.respondWith(
    caches.match(event.request).then(cached => {

      if (cached) return cached;

      return fetch(event.request)
        .then(networkRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkRes.clone());
            return networkRes;
          });
        })
        .catch(() => {
          // fallback image/logo si offline
          if (event.request.destination === 'image') {
            return caches.match('./images/logo.png');
          }
        });

    })
  );
});