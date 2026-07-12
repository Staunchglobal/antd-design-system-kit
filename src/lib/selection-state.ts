import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export type SelectionConfig = {
  version: number
  framework: 'next' | 'vite'
  components: string[]
  /** sha256 of each managed file's content as of the last time this CLI wrote it — `update`
   * only overwrites a file if its current on-disk hash still matches this baseline (meaning
   * the user hasn't touched it since), or if --force is passed. Keyed by the path relative to
   * the project's src/ (or root, for framework-root files like vite-plugin-design-kit.ts). */
  fileHashes: Record<string, string>
}

const CONFIG_FILE = 'antd-design-kit.json'

export function configPath(root: string): string {
  return path.join(root, CONFIG_FILE)
}

export function readSelectionConfig(root: string): SelectionConfig | null {
  const file = configPath(root)
  if (!fs.existsSync(file)) return null
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as Partial<SelectionConfig>
    return {
      version: parsed.version ?? 1,
      framework: parsed.framework ?? 'next',
      components: parsed.components ?? [],
      fileHashes: parsed.fileHashes ?? {},
    }
  } catch {
    return null
  }
}

function writeConfig(root: string, config: SelectionConfig): void {
  fs.writeFileSync(configPath(root), JSON.stringify(config, null, 2) + '\n')
}

export function writeSelectionConfig(root: string, framework: 'next' | 'vite', components: string[]): void {
  const existing = readSelectionConfig(root)
  writeConfig(root, {
    version: 1,
    framework,
    components: [...components].sort(),
    fileHashes: existing?.fileHashes ?? {},
  })
}

/** Prior selection to pre-check in the picker, falling back to none for a brand-new install. */
export function priorSelectionFor(root: string): string[] {
  return readSelectionConfig(root)?.components ?? []
}

export function sha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex')
}

/** Records the baseline hash for each freshly-written file so a later `update` can tell
 * whether the user has since hand-edited it. Merges into whatever hashes already exist. */
export function recordFileHashes(root: string, entries: { relPath: string; content: string }[]): void {
  if (!entries.length) return
  const config = readSelectionConfig(root) ?? { version: 1, framework: 'next' as const, components: [], fileHashes: {} }
  for (const { relPath, content } of entries) config.fileHashes[relPath] = sha256(content)
  writeConfig(root, config)
}
