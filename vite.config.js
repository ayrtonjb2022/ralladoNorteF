import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(), // ✅ No es necesario ponerlo como array dentro de []
  ],
  server: {
    port: 5174 // 👈 Cambiás el puerto aquí
  }
})
