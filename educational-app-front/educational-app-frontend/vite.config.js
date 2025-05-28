import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'


export default defineConfig({
  plugins: [react(),
    compression({
      verbose: true,
      disable: false,
      threshold: 1024,
      algorithm: 'gzip',
      ext: '.gz'
    })],
  server: {
    port: 5173
  }
})
