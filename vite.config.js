import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/utils/jsonFormatter.js',
        'src/utils/numberBaseConverter.js',
        'src/utils/httpHeadersParser.js'
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
