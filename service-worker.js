const CACHE_NAME = 'recettes-cache-v1';
const urlsToCache = [
  '/Recette/index.html',
  '/Recette/script.js',
  '/Recette/style.css',
  '/Recette/Recette-1/',
  '/Recette/Recette-2/',
  '/Recette/Recette-3/',
  '/Recette/Recette-4/',
  '/Recette/Recette-5/',
  '/Recette/Recette-6/',
  '/Recette/Recette-7/',
  '/Recette/Recette-8/',
  '/Recette/logo.png',
  '/Recette/logo carré.png',
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


