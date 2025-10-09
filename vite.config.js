import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  colors: {
        'custom-dark-blue': '#073b4c',
      },
  plugins: [react(),tailwindcss()],
})
