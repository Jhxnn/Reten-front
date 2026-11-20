import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// O frontend fala com o backend sempre pela mesma origem (/api).
// Em desenvolvimento, o Vite encaminha as chamadas para o Spring Boot — assim o cookie de
// sessão é first-party e não precisamos de CORS.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.RETEN_API_URL ?? 'http://localhost:8090'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': { target: apiTarget, changeOrigin: false },
      },
    },
  }
})
