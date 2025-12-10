import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Get base path from environment variable (set by GitLab CI)
// For local development, use '/' (root)
// For GitLab Pages with branch prefix, use '/branch-name/'
// Ensure base path always starts with '/' and ends with '/' (unless it's root)
const envBase = process.env.VITE_BASE_PATH || '/';
const base = envBase === '/' ? '/' : envBase.endsWith('/') ? envBase : `${envBase}/`;

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './node_modules/@patternfly/react-core/dist/styles/assets'),
    },
  },
});



