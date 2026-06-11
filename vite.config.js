import { cwd } from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || ''

  if (command === 'build' && mode === 'production') {
    if (!apiBaseUrl) {
      throw new Error('VITE_API_BASE_URL is required for production builds.')
    }

    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(apiBaseUrl)) {
      throw new Error('VITE_API_BASE_URL must not point to localhost for production builds.')
    }
  }

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('react-icons')) return 'icons';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) return 'redux';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react';
            return 'vendor';
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      coverage: {
        reporter: ['text', 'lcov'],
        all: true,
        include: ['src/**/*.{js,jsx}'],
      },
    },
  }
})
