const CACHE_NAME = 'loyalty-card-cache-v1.2.2'; // обнови версию при каждом изменении
const urlsToCache = [
    '/index.html',
    '/static/js/bundle.js',
    '/static/js/main.chunk.js',
    '/static/js/0.chunk.js',
    '/manifest.json',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/card-logos/default.png',
];

// Установка и предварительное кэширование
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache:', CACHE_NAME);
            return Promise.all(
                urlsToCache.map(request =>
                    cache.add(request).catch(err =>
                        console.error('Failed to cache:', request, err)
                    )
                )
            );
        })
    );
});

// Обработка fetch-запросов
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const req = event.request;

    event.respondWith(
        caches.match(req).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;

            return fetch(req).then(networkResponse => {
                if (
                    !networkResponse ||
                    networkResponse.status !== 200 ||
                    (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')
                ) {
                    return networkResponse;
                }

                const isImage = req.destination === 'image' ||
                    req.url.match(/\.(png|jpg|jpeg|webp|svg|gif)$/);

                if (isImage || req.url.includes('/static/')) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, responseToCache);
                    });
                }

                return networkResponse;
            }).catch(error => {
                console.warn('Fetch failed:', req.url, error);
                return undefined;
            });
        })
    );
});

// Очистка старых кэшей при активации
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});