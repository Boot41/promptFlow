import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',  // Output build to Django's static directory
    emptyOutDir: true,           // Clear the directory before building
    assetsDir: 'assets'
  },
  base: '/static/'
});