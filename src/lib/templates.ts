import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type TemplateRoot = 'template-antd-shared' | 'template-antd-next' | 'template-antd-vite' | 'template-antd-root'

/**
 * Phase 1 resolves templates from local disk next to the CLI's own install — no CDN yet
 * (see tsup.config.ts). Works whether running the built `dist/cli.js` (repo root is one
 * level up) or `src/cli.ts` directly under tsx/ts-node during development (repo root is
 * two levels up from src/lib). CDN-based fetch (SHA-pinned, mirroring the sibling shadcn
 * kit's src/lib/remote.ts) replaces this in Phase 8, once this repo is public and published.
 */
function findRepoRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  let dir = here
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(dir, 'template-antd-shared'))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error(`Could not locate template-antd-* directories starting from ${here}`)
}

const REPO_ROOT = findRepoRoot()

export function templateBaseDir(root: TemplateRoot): string {
  return path.join(REPO_ROOT, root, root === 'template-antd-root' ? '' : 'src')
}

export function readTemplateFile(root: TemplateRoot, relPath: string): string | null {
  const full = path.join(templateBaseDir(root), relPath)
  if (!fs.existsSync(full)) return null
  return fs.readFileSync(full, 'utf8')
}
