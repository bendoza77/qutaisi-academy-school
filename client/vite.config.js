import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },

  build: {
    target: 'es2020',
    cssMinify: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Split heavy vendor libs into separate cacheable chunks
        manualChunks(id) {
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three')
          ) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (
            id.includes('node_modules/i18next') ||
            id.includes('node_modules/react-i18next') ||
            id.includes('node_modules/i18next-browser-languagedetector')
          ) {
            return 'vendor-i18n';
          }
          if (
            id.includes('node_modules/react-router-dom') ||
            id.includes('node_modules/@remix-run')
          ) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/')
          ) {
            return 'vendor-react';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (info) => {
          const ext = (info.name ?? '').split('.').pop() ?? '';
          if (/png|jpe?g|gif|svg|webp|avif|ico/.test(ext))
            return 'assets/img/[name]-[hash].[ext]';
          if (/woff2?|ttf|eot/.test(ext))
            return 'assets/fonts/[name]-[hash].[ext]';
          if (ext === 'css')
            return 'assets/css/[name]-[hash].[ext]';
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
