const CACHE_NAME = '1.9.9';

const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/main.chunk.js',
    '/static/css/main.chunk.css',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/icon.png',
    '/fonts/inter/Inter-Bold.ttf',
    '/fonts/inter/Inter-Medium.ttf',
    '/fonts/inter/Inter-Regular.ttf',
    '/fonts/inter/Inter-SemiBold.ttf',
    '/manifest.json',
    '/manifest.webmanifest',
    '/image/default.png',
    '/image/iosblack.png',
    '/image/ioswhite.png',
    '/image/dixy.png',
    '/image/fixprice.png',
    '/image/lenta.png',
    '/image/magnit.png',
    '/image/metro.png',
    '/image/x5.png',
    '/image/okey.png',
    '/image/kb.png',
    '/image/ashan.png',
    '/image/vkysvill.png'
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