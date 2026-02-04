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
    outDir: 'public/build',
    manifest: true,
    emptyOutDir: true,
  },
});
