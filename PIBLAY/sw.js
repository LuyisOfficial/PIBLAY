const CACHE_NAME = 'piblay-v2'; // incrémente à chaque update

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js', // ✅ corrigé
  '/images/logo.png',
  '/offline.html' // 👉 ajoute cette page
];

// ================= INSTALL =================
self.addEventListener('install', event => {
  console.log('PIBLAY SW: Install');

  self.skipWaiting(); // 🔥 activation immédiate

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ================= ACTIVATE =================
self.addEventListener('activate', event => {
  console.log('PIBLAY SW: Activate');

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Delete old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim(); // 🔥 contrôle immédiat
});

// ================= FETCH =================
self.addEventListener('fetch', event => {

  // 🔹 HTML → network first (toujours frais)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
        .catch(() => {
          return caches.match(event.request)
            .then(res => res || caches.match('/offline.html'));
        })
    );
    return;
  }

  // 🔹 autres fichiers → cache first + update
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request)
        .then(networkRes => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkRes.clone());
          });
          return networkRes;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});