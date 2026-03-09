import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // SOSTITUISCI 'libera-ecosystem' con il nome reale della repository GitHub Pages
  base: '/libera-ecosystem/',
})
