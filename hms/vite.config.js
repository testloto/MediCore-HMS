import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
  port: 3000,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
},
  build: {
    // Increase chunk warning limit — we control splitting manually
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        /**
         * Manual chunk strategy:
         *  - vendor/react   : react + react-dom (most cached, rarely changes)
         *  - vendor/charts  : recharts (large, only needed on dashboard)
         *  - Each page      : its own chunk so only the visited page is loaded
         */
        manualChunks(id) {
          // React core — shared, always cached
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          // Recharts — large, only dashboard uses it
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-')) {
            return 'vendor-charts';
          }
          // All other node_modules in one vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
          // Context / shared utilities — tiny, keep in main
          if (id.includes('/context/') || id.includes('/data/') || id.includes('/utils/')) {
            return 'app-core';
          }
          // Common layout & components
          if (id.includes('/components/')) {
            return 'app-components';
          }
          // Home page sections — each gets its own micro-chunk
          if (id.includes('/pages/home/sections/')) {
            const name = id.split('/sections/')[1].replace('.jsx','').replace('.js','');
            return `home-${name.toLowerCase()}`;
          }
          // Each page module = its own chunk
          const pageMatch = id.match(/\/pages\/([^/]+)\/[^/]+\.(jsx|js)$/);
          if (pageMatch) {
            return `page-${pageMatch[1]}`;
          }
        },
      },
    },
    // Minify aggressively
    minify: 'esbuild',
    // Source maps off in prod for smaller bundles
    sourcemap: false,
    // Enable CSS code-splitting
    cssCodeSplit: true,
  },
  // Optimise dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
});
