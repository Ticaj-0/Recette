const CACHE_NAME = 'recettes-cache-v1';
const urlsToCache = [
  'index.html',
  'script.js',
  'style.css',
  'Recette-1/index.html',
  'Recette-1/script.js',
  'Recette-1/style.css',
  'Recette-2/index.html',
  'Recette-2/script.js',
  'Recette-2/style.css',
  'Recette-3/index.html',
  'Recette-3/script.js',
  'Recette-3/style.css',
  'Recette-4/index.html',
  'Recette-4/script.js',
  'Recette-4/style.css',
  'Recette-5/index.html',
  'Recette-5/script.js',
  'Recette-5/style.css',
  'Recette-6/index.html',
  'Recette-6/script.js',
  'Recette-6/style.css',
  'Recette-7/index.html',
  'Recette-7/script.js',
  'Recette-7/style.css',
  'Recette-8/index.html',
  'Recette-8/script.js',
  'Recette-8/style.css',
];

// Installer le service worker et mettre en cache les ressources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache:', error);
        });
      })
  );
});

// Activer le service worker et nettoyer les anciens caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepter les requêtes et servir les ressources en cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(networkResponse => {
          // Si la ressource est trouvée sur le réseau, la mettre en cache pour les futures requêtes
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(error => {
          console.error('Fetching failed:', error);
          throw error;
        });
      })
  );
});


