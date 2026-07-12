import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'template-antd-shared/**/*.test.ts'],
  },
})
