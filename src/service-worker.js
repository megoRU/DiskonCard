const CACHE_NAME = '1.9.3';

const baseFiles = ['/', '/index.html', '/static/js/main.chunk.js', '/static/css/main.chunk.css'];

// Пример "разворачивания" шаблонов вручную (обычно нужен fs, но тут хардкод для наглядности)
const assetsExpanded = [
    '/favicon.ico',
    '/icon.png',
    '/fonts/inter/Inter-Bold.ttf',
    '/fonts/inter/Inter-Medium.ttf',
    '/fonts/inter/Inter-Regular.ttf',
    '/fonts/inter/Inter-SemiBold.ttf',
    '/manifest.json',
    '/image/default.png',
    '/image/iosblack.png',
    '/image/ioswhite.png',
    '/image/dixy.png',
    '/image/fixprice.png',
    '/image/lenta.png',
    '/image/magnit.png',
    '/image/metro.png',
    '/image/x5.png',
    '/image/okey.png'
];

const urlsToCache = [...baseFiles, ...assetsExpanded, ...assetsExpanded];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});