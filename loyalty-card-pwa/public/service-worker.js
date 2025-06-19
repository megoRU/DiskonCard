const CACHE_NAME = '1.4.5';
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
    '/card-logos/ios_black.png',
    '/card-logos/ios_white.png',
];

// Установка: кэшируем файлы
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // сразу переходит в активный режим
});

// Сообщение от клиента
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Активация: удаляем старые кэши
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// Обработка запросов
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put('/index.html', clone);
                    });
                    return response;
                })
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(response => {
                    if (
                        !response || response.status !== 200 ||
                        (response.type !== 'basic' && response.type !== 'cors')
                    ) {
                        return response;
                    }
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                    return response;
                });
            })
        );
    }
});