const CACHE_NAME = 'loyalty-card-cache-v2'; // Updated cache name
const urlsToCache = [
  '/',
  '/index.html',
  // These JS paths are likely from CRA. For Vite, they would be different,
  // e.g., /assets/index-XXXX.js. A proper PWA plugin for Vite handles this.
  // We'll keep them for now but they might not be effective for a Vite build.
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/manifest.json', // Added manifest
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  // Card Logos
  '/card-logos/default.png',
  '/card-logos/dixy.png',
  '/card-logos/fixprice.png',
  '/card-logos/lenta.png',
  '/card-logos/magnit.png',
  '/card-logos/metro.png',
  '/card-logos/okey.png',
  '/card-logos/x5.png'
  // Add paths to your main CSS and JS bundles if known and static
  // For Vite, these often include hashes in their names, e.g., '/assets/index.abcdef.js'
  // For a manually written SW without build tool integration, this part is tricky.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        // Use { cache: 'reload' } for items that should always be fresh during install
        // For most app shell files, the default request mode is fine.
        const cachePromises = urlsToCache.map(urlToCache => {
          return cache.add(urlToCache).catch(err => {
            console.error('Failed to cache:', urlToCache, err);
          });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('All specified assets cached successfully.');
      })
      .catch(err => {
        console.error('Cache initialization failed:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        // Not in cache, fetch from network, and cache it for future offline use (cache-on-demand)
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.log('Fetch failed; returning offline page instead.', error);
          // Optionally, return a custom offline fallback page if the request is for an HTML page
          // if (event.request.mode === 'navigate') {
          //   return caches.match('/offline.html'); // You would need to cache an offline.html
          // }
          return undefined; // Or a more specific error response
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Only the new cache
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
