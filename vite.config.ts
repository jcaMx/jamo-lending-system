import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import reactSwc from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/index.css',
        'resources/js/app.tsx',
      ],
      refresh: true,
    }),
    reactSwc(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
    },
  },

  esbuild: {
    jsx: 'automatic',
  },

  build: {
    outDir: 'public/build/vite',
    manifest: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-inertia': ['@inertiajs/react'],
          'vendor-ui': ['lucide-react', '@tanstack/react-query'],
        },
      },
    },
  },

  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '127.0.0.1',
      port: 5173,
      protocol: 'ws',
    },
  },
});
