import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// Simplified Navigation Fallback for SPAs
// This assumes /index.html is precached by precacheAndRoute.
// It ensures that any navigation request that doesn't match a precached asset
// (e.g., /user/profile) still serves /index.html.
const navigationFallbackHandler = async ({ event }) => {
  try {
    // Try to get the requested page from the network first (e.g. if it's a real page on the server)
    // This part is optional; often for SPAs, you immediately go to cache for /index.html
    // const networkResponse = await fetch(event.request);
    // return networkResponse;

    // If network fails or is not preferred for SPA routes, serve /index.html from cache.
    // Ensure '/index.html' is correctly specified in your vite-plugin-pwa manifest.
    const cache = await self.caches.open((self.workbox && self.workbox.core && self.workbox.core.cacheNames.precache) || 'workbox-precache-v2'); // Default workbox precache name might vary
    let response = await cache.match('/index.html', { ignoreSearch: true });
    if (response) return response;

    // If /index.html is not in cache for some reason (shouldn't happen if precached)
    // try to fetch it from the network. This is a last resort.
    return await fetch('/index.html');
  } catch (error) {
    // This catch is for errors during the fetch/cache operations for /index.html itself.
    // If everything fails, you could return a very basic offline HTML page string here,
    // or just let it fail, which might result in a browser error page.
    console.error("Service Worker: Navigation fallback failed.", error);
    // Consider having a minimal offline page as a string or precached asset:
    // return new Response("<h1>Offline</h1><p>Sorry, you're offline and the requested page couldn't be loaded.</p>", { headers: { 'Content-Type': 'text/html' } });
    return new Response('', {status: 503, statusText: 'Service Unavailable'});
  }
};

registerRoute(new NavigationRoute(navigationFallbackHandler));

// Runtime caching for images
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'runtime-images',
    plugins: [
      // new self.workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// Runtime caching for fonts, styles, scripts not in precache
registerRoute(
  ({request}) => request.destination === 'font' || request.destination === 'style' || request.destination === 'script',
  new CacheFirst({
    cacheName: 'runtime-static-resources',
  })
);