import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    host:"0.0.0.0",
    fs:{
      strict:false
    },
    proxy:{
      '/api':"http://localhost:5000"
    }
  },
  plugins: [react()],
})
