import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// O frontend fala com o backend sempre pela mesma origem (/api).
// Em desenvolvimento, o Vite encaminha as chamadas para o Spring Boot — assim o cookie de
// sessão é first-party e não precisamos de CORS. O host é 127.0.0.1 (não localhost) porque
// a Spotify só aceita redirect por IP de loopback, e o cookie precisa estar no mesmo host.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.RETEN_API_URL ?? 'http://localhost:8090'

  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      // Túnel HTTPS do ngrok (usado como redirect URI da Spotify). O Vite recusa hosts desconhecidos.
      allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.dev'],
      proxy: {
        '/api': { target: apiTarget, changeOrigin: false },
      },
    },
  }
})
