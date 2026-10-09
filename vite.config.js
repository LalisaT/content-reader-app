import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'firebase/app',
      'firebase/firestore',
      '@capacitor/core',
      '@capacitor/app',
      '@capacitor/network',
      '@capacitor/splash-screen',
      '@capacitor/share',
      '@capacitor/local-notifications',
      '@capacitor/push-notifications',
      '@capacitor-community/admob',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
    host: true,
  },
});
