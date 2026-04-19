import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8082',
          changeOrigin: true,
          // Rewrite Set-Cookie headers so the browser stores them for localhost:3000
          // instead of the backend's own domain (otherwise httpOnly cookie is dropped).
          cookieDomainRewrite: 'localhost',
          cookiePathRewrite: '/',
        },
      },
    },
  }
})
