import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
          alternative1: resolve(__dirname, 'alternative1/index.html'),
      },
    },
  },
})
