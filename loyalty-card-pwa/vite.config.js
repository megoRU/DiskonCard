import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { version } from './package.json'

export default defineConfig({
  define: {
    'import.meta.env.VERSION': JSON.stringify(version)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{html,css,js,ico,png,jpg,gif,svg}"]
      },
      manifest: {
        name: "DiskonCard",
        short_name: "PWA",
        start_url: "/",
        display: 'standalone',
        background_color: "#000000",
        theme_color: "#000000",
        lang: "ru-RU",
        icons: [
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
})