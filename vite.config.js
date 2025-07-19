import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            workbox: {
                globPatterns: ['**/*']
            },
            includeAssets: [
                "**/*",
            ],
            manifest: {
                name: 'DiskonCard',
                short_name: 'DiskonCard',
                start_url: '/',
                scope: "/",
                display: 'standalone',
                background_color: '#000000',
                theme_color: '#000000',
                lang: 'ru-RU',
                icons: [
                    {
                        src: 'logo192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'icon.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
});