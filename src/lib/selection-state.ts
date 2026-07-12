import fs from 'node:fs'
import path from 'node:path'

export type SelectionConfig = {
  version: number
  framework: 'next' | 'vite'
  components: string[]
}

const CONFIG_FILE = 'antd-design-kit.json'

export function configPath(root: string): string {
  return path.join(root, CONFIG_FILE)
}

export function readSelectionConfig(root: string): SelectionConfig | null {
  const file = configPath(root)
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as SelectionConfig
  } catch {
    return null
  }
}

export function writeSelectionConfig(root: string, framework: 'next' | 'vite', components: string[]): void {
  const config: SelectionConfig = { version: 1, framework, components: [...components].sort() }
  fs.writeFileSync(configPath(root), JSON.stringify(config, null, 2) + '\n')
}

/** Prior selection to pre-check in the picker, falling back to none for a brand-new install. */
export function priorSelectionFor(root: string): string[] {
  return readSelectionConfig(root)?.components ?? []
}
