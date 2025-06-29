// vite.config.ts

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Minimal vendor chunking for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion', 'd3', 'lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit for data-heavy apps
    chunkSizeWarningLimit: 1000,
  },
});
