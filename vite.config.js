import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/utils/**/*.js',
        'src/pages/FlowMap.jsx',
        'src/pages/flowMapMachine.js',
        'src/pages/ToolGuides.jsx'
      ],
      thresholds: {
        statements: 70,
        branches: 50,
        functions: 80,
        lines: 70,
      }
    }
  }
})
