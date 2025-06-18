const CACHE_NAME = 'loyalty-card-cache-v1.3.0';
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

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Активация и удаление старых кэшей
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(name => {
                    if (!cacheWhitelist.includes(name)) {
                        return caches.delete(name);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch с Network First для index.html и навигации
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Обновляем кеш index.html при успешном ответе
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put('/index.html', responseClone);
                    });
                    return response;
                })
                .catch(() =>
                    caches.match('/index.html')
                )
        );
        return;
    }

    // Для других запросов: сначала ищем в кеше, потом сеть
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then(cachedResp => {
                if (cachedResp) return cachedResp;
                return fetch(event.request).then(networkResp => {
                    if (
                        !networkResp ||
                        networkResp.status !== 200 ||
                        (networkResp.type !== 'basic' && networkResp.type !== 'cors')
                    ) {
                        return networkResp;
                    }
                    const responseClone = networkResp.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return networkResp;
                });
            }).catch(() => {
                // fallback если нужно, например для картинок
            })
        );
    }
});
