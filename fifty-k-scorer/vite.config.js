import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/skills/fifty-k-scorer/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})