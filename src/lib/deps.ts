import { spawnSync } from 'node:child_process'
import { installCommand, type PackageManager } from './detect.js'

/**
 * Unlike the shadcn kit, there is no per-component npm dependency graph here — every Ant
 * Design component ships from the single `antd` package, so the runtime dependency set is
 * flat and selection-independent (picking more/fewer components in `--components` never
 * changes what gets installed, only which showcase/theme-editor sections get generated).
 */
export const CORE_RUNTIME_DEPENDENCIES: Record<string, string> = {
  antd: '^6.5.0',
  '@ant-design/icons': '^6.3.2',
}

/** Only Next's App Router needs SSR style extraction; Vite is client-rendered, no registry needed. */
export const NEXT_ONLY_RUNTIME_DEPENDENCIES: Record<string, string> = {
  '@ant-design/nextjs-registry': '^1.3.0',
}

export function missingDeps(
  map: Record<string, string>,
  existing: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [name, version] of Object.entries(map)) {
    if (!(name in existing)) out[name] = version
  }
  return out
}

export function runInstall(pm: PackageManager, cwd: string, packages: string[], dev: boolean): boolean {
  if (!packages.length) return true
  const versioned = packages
  const { command, args } = installCommand(pm, versioned, dev)
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' })
  return result.status === 0
}
