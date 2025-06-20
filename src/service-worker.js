const CACHE_NAME = '1.6.9';

const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/main.chunk.js',
    '/static/css/main.chunk.css',
    '/favicon.ico',
    '/manifest.json',
    '/logo192.png',
    '/logo512.png',
    '/icon.png',
    '/fonts/inter/Inter-Bold.ttf',
    '/fonts/inter/Inter-Medium.ttf',
    '/fonts/inter/Inter-Regular.ttf',
    '/fonts/inter/Inter-SemiBold.ttf',
    '/manifest.webmanifest',
    '/manifest.json',
    '/card-logos/default.png',
    '/card-logos/ios_black.png',
    '/card-logos/ios_white.png',
    '/card-logos/dixy.png',
    '/card-logos/fixprice.png',
    '/card-logos/lenta.png',
    '/card-logos/magnit.png',
    '/card-logos/metro.png',
    '/card-logos/x5.png',
    '/card-logos/okey.png',
];

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