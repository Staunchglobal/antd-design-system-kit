import fs from 'node:fs'
import path from 'node:path'
import { readTemplateFile, readTemplateRootFile, type TemplateRoot } from './templates.js'

export type CopyResult = { relPath: string; status: 'written' | 'skipped' | 'missing' }

/**
 * Never overwrites a file that already exists — a file the user hand-edited (or that a
 * prior install already wrote) is always left alone and reported back, never clobbered.
 */
export function copySelectedFiles(
  templateRoot: TemplateRoot,
  destDir: string,
  relPaths: string[],
  dryRun: boolean
): CopyResult[] {
  const results: CopyResult[] = []
  for (const relPath of relPaths) {
    const destPath = path.join(destDir, relPath)
    if (fs.existsSync(destPath)) {
      results.push({ relPath, status: 'skipped' })
      continue
    }
    const content = readTemplateFile(templateRoot, relPath)
    if (content === null) {
      results.push({ relPath, status: 'missing' })
      continue
    }
    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true })
      fs.writeFileSync(destPath, content)
    }
    results.push({ relPath, status: 'written' })
  }
  return results
}

/** For the rare file that lives at the project root, not under src/ (e.g. vite-plugin-design-kit.ts). */
export function copyTemplateRootFile(
  templateRoot: TemplateRoot,
  destRoot: string,
  relPath: string,
  dryRun: boolean
): CopyResult {
  const destPath = path.join(destRoot, relPath)
  if (fs.existsSync(destPath)) return { relPath, status: 'skipped' }
  const content = readTemplateRootFile(templateRoot, relPath)
  if (content === null) return { relPath, status: 'missing' }
  if (!dryRun) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    fs.writeFileSync(destPath, content)
  }
  return { relPath, status: 'written' }
}

export function writeGeneratedFile(destDir: string, relPath: string, content: string, dryRun: boolean): void {
  if (dryRun) return
  const destPath = path.join(destDir, relPath)
  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, content)
}
