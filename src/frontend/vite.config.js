import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    sourcemap: false,       // Prevents large .map debug files from entering the build
    minify: 'esbuild',      // Strips whitespace and comments
    cssMinify: true         // Compresses CSS bundles
  }
});