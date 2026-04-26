import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    // Fallback API URL baked into the build if .env is not present (e.g. on Cloud Shell)
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://electionsync-backend-596490360825.us-central1.run.app'
    ),
  },
})