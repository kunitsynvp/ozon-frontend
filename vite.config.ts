import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    proxy: {
      '/api': {                          // ← matches /api/health AND /api/ozon/products
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/\/api/, '')
      }
    }
  },
})
