import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Relative assets work both on the classic project path and on
  // GitLab's default unique Pages domain after its redirect.
  base: mode === 'gitlab' ? './' : '/',
}))
