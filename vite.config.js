import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base matches the repo name so the build works on GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/sorting-visualizer/',
})
