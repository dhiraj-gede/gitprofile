import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import GIT_CONFIG from './gitprofile.config';
import { createHtmlPlugin } from 'vite-plugin-html';
import { CONFIG } from './configLoader';
import { HACKERRANK_CONFIG } from './config/hackerrankConfig';

// https://vitejs.dev/config/
export default defineConfig({
  base: CONFIG.base,
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          metaTitle: GIT_CONFIG.seo.title,
          metaDescription: GIT_CONFIG.seo.description,
          metaImageURL: GIT_CONFIG.seo.imageURL,
        },
      },
    }),
    ...(GIT_CONFIG.enablePWA
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            workbox: {
              navigateFallback: undefined,
            },
            includeAssets: ['logo.png'],
            manifest: {
              name: 'Portfolio',
              short_name: 'Portfolio',
              description: 'Personal Portfolio',
              icons: [
                {
                  src: 'logo.png',
                  sizes: '64x64 32x32 24x24 16x16 192x192 512x512',
                  type: 'image/png',
                },
              ],
            },
          }),
        ]
      : []),
  ],
  define: {
    GIT_CONFIG: GIT_CONFIG,
    HACKERRANK_CONFIG: HACKERRANK_CONFIG,
  },
});
