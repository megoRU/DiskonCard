import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version || 'default'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Assuming this file exists for test setup
  },
  // Optional: Define a server port if needed, e.g., 3000
  // server: {
  //   port: 3000,
  // },
  // Optional: Define the public directory if it's not 'public'
  // publicDir: 'public',
});
