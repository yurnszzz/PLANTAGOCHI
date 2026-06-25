import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.VITE_FIREBASE_API_KEY

  // Determine if we should run in offline mock mode
  const isMockMode = !apiKey || apiKey.includes('your_api_key_here') || env.VITE_USE_MOCK === 'true'

  const alias = {}
  if (isMockMode) {
    console.log('\n\x1b[32m%s\x1b[0m', '🌿 PLANTAGOCHI RUNNING IN OFFLINE / MOCK MODE 🌿')
    console.log('\x1b[36m%s\x1b[0m', '   - Firebase connections are mocked using LocalStorage.')
    console.log('\x1b[36m%s\x1b[0m', '   - Offline User Account: user@example.com (Plant: Cacti Jack)')
    console.log('\x1b[36m%s\x1b[0m', '   - Offline Admin Account: admin@plantagochi.com / admin123')
    console.log('\x1b[36m%s\x1b[0m', '   - No internet or Firebase setup required!\n')

    alias['firebase/app'] = path.resolve(__dirname, './src/lib/firebaseMock.js')
    alias['firebase/auth'] = path.resolve(__dirname, './src/lib/firebaseMock.js')
    alias['firebase/firestore'] = path.resolve(__dirname, './src/lib/firebaseMock.js')
  }

  return {
    plugins: [react()],
    resolve: {
      alias
    }
  }
})
