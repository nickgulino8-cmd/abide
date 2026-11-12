import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// BASE_PATH lets the app live in a subfolder, e.g. GitHub Pages: BASE_PATH=/abide/
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { chunkSizeWarningLimit: 800 },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Abide — Grow closer to Christ',
        short_name: 'Abide',
        description: 'A private, offline Catholic companion for daily Scripture, prayer and building holy habits.',
        theme_color: '#1f3d2f',
        background_color: '#f7f2e8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        categories: ['lifestyle', 'health', 'books'],
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the entire app, including the full offline Douay-Rheims Bible.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
        importScripts: [`${base}sw-notify.js`],
      },
    }),
  ],
});
