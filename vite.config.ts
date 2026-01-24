import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/minesweeper/',
  build: {
    outDir: 'dist/minesweeper',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
      },
    },
  },
})
