import fs from 'node:fs'
import path from 'node:path'

export type TemplateRoot = 'template-antd-shared' | 'template-antd-next' | 'template-antd-vite' | 'template-antd-root'

export const TEMPLATES_REPO = 'Staunchglobal/antd-design-system-kit'

/**
 * Injected at build time by tsup.config.ts's `define`, pinned to the exact commit SHA that
 * was HEAD when the CLI was built — never a branch like `main`. Pinning to an immutable SHA
 * is what makes a given CLI version reproducible (same install, same bytes, forever) and
 * lets jsdelivr serve without branch-alias cache-propagation delay. Falls back to `main`
 * only when running unbuilt (`src/cli.ts` directly under a dev runner, or a test).
 */
declare const __TEMPLATES_REF__: string
export const TEMPLATES_REF = typeof __TEMPLATES_REF__ !== 'undefined' ? __TEMPLATES_REF__ : 'main'

const CDN_PREFIX = `https://cdn.jsdelivr.net/gh/${TEMPLATES_REPO}@${TEMPLATES_REF}/`

/** `atRoot: true` for the rare file that lives at the template root itself, not under its
 * src/ subfolder (e.g. template-antd-vite/vite-plugin-design-kit.ts). */
function cdnBaseFor(root: TemplateRoot, atRoot: boolean): string {
  const base = root === 'template-antd-root' || atRoot ? root : `${root}/src`
  return `${CDN_PREFIX}${base}/`
}

export function remoteUrl(root: TemplateRoot, relPath: string, atRoot = false): string {
  return `${cdnBaseFor(root, atRoot)}${relPath}`.replace(/([^:])\/\/+/g, '$1/')
}

/**
 * Maintainer-only escape hatch: point `DESIGN_KIT_LOCAL_TEMPLATES` at a local checkout of
 * this repo to iterate on template changes without a push-and-wait-for-jsdelivr-cache loop.
 * Shadows per-file — a local file wins over the CDN if present at the mapped path, so a
 * partial local checkout (just the files you're actively editing) works fine. Never set by
 * end users.
 */
function localShadowPath(root: TemplateRoot, relPath: string, atRoot: boolean): string | null {
  const localRoot = process.env.DESIGN_KIT_LOCAL_TEMPLATES
  if (!localRoot) return null
  const base = root === 'template-antd-root' || atRoot ? root : `${root}/src`
  return path.join(localRoot, base, relPath)
}

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status === 404) return res
      lastErr = new Error(`HTTP ${res.status} ${res.statusText}`)
    } catch (err) {
      lastErr = err
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 300 * 2 ** i))
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr))
}

/** Returns null for a real 404 (file doesn't exist at this ref — not retried), throws after
 * exhausting retries for network errors/5xx. */
export async function fetchTemplateText(root: TemplateRoot, relPath: string, atRoot = false): Promise<string | null> {
  const shadow = localShadowPath(root, relPath, atRoot)
  if (shadow && fs.existsSync(shadow)) return fs.readFileSync(shadow, 'utf8')

  const url = remoteUrl(root, relPath, atRoot)
  try {
    const res = await fetchWithRetry(url)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    return await res.text()
  } catch (err) {
    throw new Error(
      `Failed to fetch ${relPath} from ${TEMPLATES_REPO}@${TEMPLATES_REF}: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

export async function fetchRequiredTemplateText(root: TemplateRoot, relPath: string): Promise<string> {
  const content = await fetchTemplateText(root, relPath)
  if (content === null) throw new Error(`Required template file not found: ${root}/${relPath}`)
  return content
}

/** For the rare file that lives at the template root itself, not under its src/ subfolder. */
export async function fetchTemplateRootText(root: TemplateRoot, relPath: string): Promise<string | null> {
  return fetchTemplateText(root, relPath, true)
}

/** Caps concurrent fetches rather than firing them all at once or running fully serial. */
export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}
