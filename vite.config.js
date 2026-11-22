import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Extra hostnames the dev server may be reached through (comma separated)
const allowedHosts = (process.env.VITE_ALLOWED_HOSTS || '')
  .split(',')
  .map(host => host.trim())
  .filter(Boolean);

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts,
  },
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
