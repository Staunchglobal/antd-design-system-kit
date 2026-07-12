import { defineConfig } from 'tsup'

/**
 * Phase 1 reads templates from local disk (the template-antd- directories next to dist/),
 * not a CDN — CDN-based distribution (SHA-pinned jsdelivr fetch, mirroring the sibling
 * shadcn kit's src/lib/remote.ts) is Phase 8, once this repo is public and has real commits
 * to pin to.
 */
export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
})
