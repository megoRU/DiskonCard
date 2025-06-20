const CACHE_NAME = '1.6.9';

const urlsToCache = [
    '/',
    '/index.html',
    '/App.js',
    '/App.css',
    '/index.css',
    '/index.jsx',
    '/utils/localStorage.js',
    '/utils/osDetection.js',
    '/pages/HomePage.css',
    '/pages/HomePage.jsx',
    '/pages/AddCardPage.css',
    '/pages/AddCardPage.jsx',
    '/pages/SettingsPage.css',
    '/pages/SettingsPage.jsx',
    '/manifest.webmanifest',
    '/manifest.json',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/icon.png',
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