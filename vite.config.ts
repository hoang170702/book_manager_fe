import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/book-store/api': {
        target: 'http://localhost:8091',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8091',
        changeOrigin: true,
      },
    },
  },
})
