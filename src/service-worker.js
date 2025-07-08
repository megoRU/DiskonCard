import { precacheAndRoute } from 'workbox-precaching';

// Автоматически подставляемый список файлов сборки
precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = '2.0.2';

const urlsToCache = [
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
    '/image/vkysvill.png',
];

// Установка: кэшируем дополнительные ресурсы (не входящие в __WB_MANIFEST)
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

// Активация: очищаем старые кэши
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

// Перехват запросов
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            return (response || fetch(event.request).catch(() => {
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                })
            );
        })
    );
});