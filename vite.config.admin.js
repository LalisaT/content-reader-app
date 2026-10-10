import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'admin'),
  publicDir: resolve(__dirname, 'public'),
  cacheDir: resolve(__dirname, 'node_modules/.vite-admin'),
  plugins: [react()],
  server: {
    port: 3100,
    open: false,
    host: true,
    watch: {
      ignored: [
        '**/android/**',
        '**/ios/**',
        '**/dist/**',
        '**/dist-admin/**',
        '**/.firebase/**',
      ],
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist-admin'),
    emptyOutDir: true,
  },
});

