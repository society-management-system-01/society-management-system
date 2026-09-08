import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  base: '/society-management-frontend-2/',

  server: {
    host: true,
    port: 3000,
    open: false
  }
});
