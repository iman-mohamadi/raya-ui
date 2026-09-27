import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const app = fileURLToPath(new URL('./app', import.meta.url))

// Component tests run against the plain Vue build, without Nuxt: registry
// components must not depend on Nuxt auto-imports, and this keeps that honest.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': app, '~': app },
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
})
