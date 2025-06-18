const CACHE_NAME = 'loyalty-card-cache-v1.1.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/js/main.chunk.js',
    '/static/js/0.chunk.js',
    '/manifest.json',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/card-logos/default.png',
    '/card-logos/dixy.png',
    '/card-logos/fixprice.png',
    '/card-logos/lenta.png',
    '/card-logos/magnit.png',
    '/card-logos/metro.png',
    '/card-logos/okey.png',
    '/card-logos/x5.png'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache:', CACHE_NAME);
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
                if (response) return response;

                return fetch(event.request).then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                }).catch(error => {
                    console.log('Fetch failed; returning fallback.', error);
                    return undefined;
                });
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});