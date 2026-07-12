import fs from 'node:fs'
import path from 'node:path'

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'
export type Framework = 'next' | 'vite'

export type ProjectInfo = {
  root: string
  packageJsonPath: string
  packageJson: Record<string, unknown>
  hasSrcDir: boolean
  framework: Framework | null
  nextVersion: string | null
  nextMajor: number | null
  viteVersion: string | null
  // Next-only
  appDirRelative: 'src/app' | 'app' | null
  // Vite-only
  viteConfigPath: string | null
  mainEntryPath: string | null
  hasTypeScriptDependency: boolean
  tsconfigPath: string
  hasTsconfig: boolean
}

export function readJson(filePath: string): Record<string, unknown> | null {
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

function firstExisting(root: string, relatives: string[]): string | null {
  for (const rel of relatives) {
    const full = path.join(root, rel)
    if (fs.existsSync(full)) return full
  }
  return null
}

export function parseMajorVersion(range: string | undefined | null): number | null {
  if (!range) return null
  const m = range.match(/(\d+)/)
  return m ? Number(m[1]) : null
}

export function detectProject(root: string): ProjectInfo {
  const packageJsonPath = path.join(root, 'package.json')
  const packageJson = readJson(packageJsonPath) ?? {}
  const deps = {
    ...((packageJson.dependencies as Record<string, string>) ?? {}),
    ...((packageJson.devDependencies as Record<string, string>) ?? {}),
  }

  const hasSrcDir = fs.existsSync(path.join(root, 'src'))
  const srcApp = path.join(root, 'src/app')
  const rootApp = path.join(root, 'app')
  const appDirRelative = fs.existsSync(srcApp) ? 'src/app' : fs.existsSync(rootApp) ? 'app' : null

  const nextVersion = deps.next ?? null
  const viteVersion = deps.vite ?? null
  const framework: Framework | null = nextVersion ? 'next' : viteVersion ? 'vite' : null

  const tsconfigPath =
    firstExisting(root, ['tsconfig.app.json', 'tsconfig.json']) ?? path.join(root, 'tsconfig.json')

  return {
    root,
    packageJsonPath,
    packageJson,
    hasSrcDir,
    framework,
    nextVersion,
    nextMajor: parseMajorVersion(nextVersion),
    viteVersion,
    appDirRelative,
    viteConfigPath: firstExisting(root, ['vite.config.ts', 'vite.config.js', 'vite.config.mts']),
    mainEntryPath: firstExisting(root, ['src/main.tsx', 'src/main.ts', 'src/main.jsx']),
    hasTypeScriptDependency: 'typescript' in deps,
    tsconfigPath,
    hasTsconfig: fs.existsSync(tsconfigPath),
  }
}

/**
 * Walks up from `root` looking for a lockfile — in a monorepo the lockfile lives at the
 * workspace root, not inside the individual app directory `init` is run from.
 */
export function detectPackageManager(root: string): PackageManager {
  let dir = root
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) return 'pnpm'
    if (fs.existsSync(path.join(dir, 'yarn.lock'))) return 'yarn'
    if (fs.existsSync(path.join(dir, 'bun.lockb')) || fs.existsSync(path.join(dir, 'bun.lock'))) return 'bun'
    if (fs.existsSync(path.join(dir, 'package-lock.json'))) return 'npm'
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return 'npm'
}

export function installCommand(
  pm: PackageManager,
  packages: string[],
  dev: boolean
): { command: string; args: string[] } {
  switch (pm) {
    case 'pnpm':
      return { command: 'pnpm', args: ['add', ...(dev ? ['-D'] : []), ...packages] }
    case 'yarn':
      return { command: 'yarn', args: ['add', ...(dev ? ['-D'] : []), ...packages] }
    case 'bun':
      return { command: 'bun', args: ['add', ...(dev ? ['-d'] : []), ...packages] }
    case 'npm':
    default:
      return { command: 'npm', args: ['install', ...(dev ? ['-D'] : []), ...packages] }
  }
}
