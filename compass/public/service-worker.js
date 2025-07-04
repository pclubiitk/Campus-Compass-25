const STATIC_CACHE = 'campus-compass-static-v1';
const API_CACHE = 'campus-compass-api-v1';

const staticAssets = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  'globals.css',
                           
  '/components/ServiceWorkerRegister.js',
  
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async cache => {
      console.log('Caching static assets and locations...');
      await cache.addAll(staticAssets);
      

      try {
        const res = await fetch('/api/locations');
        const cloned = res.clone();
        cache.put('/locations.json', cloned); 
      } catch (err) {
        console.warn('Failed to fetch locations:', err);
      }
    })
  );
});


self.addEventListener('fetch', event => {
  const { request } = event;

  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/auth')) {
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          return caches.open(API_CACHE).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then(networkResponse => {
        if (
          request.url.startsWith(self.location.origin) &&
          (request.url.endsWith('.js') || request.url.endsWith('.css') || request.url.endsWith('.png'))
        ) {
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      });
    })
  );
});
