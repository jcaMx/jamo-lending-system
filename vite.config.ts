import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import reactSwc from '@vitejs/plugin-react-swc';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    reactSwc(),
    tailwindcss(),
    wayfinder({ formVariants: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    outDir: 'public/build',   // 👈 Laravel expects manifest.json here
    manifest: true,           // 👈 generate manifest.json
    emptyOutDir: true,        // clean old files before building
  },
}));
