import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../4tree_build', // <- outside src folder, top-level folder
    emptyOutDir: true,
  }
})
