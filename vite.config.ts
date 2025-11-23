import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import reactSwc from '@vitejs/plugin-react-swc';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: 'localhost',    // FIXED
    port: 8080,
  },

  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.tsx',
        'src/App.tsx',    // include landing page app
      ],
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    reactSwc(),
    tailwindcss(),
    wayfinder({ formVariants: true }),
  ],

  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'resources/js'),     // main app
      '@landing': path.resolve(__dirname, 'src'),   
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
