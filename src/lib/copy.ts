import fs from 'node:fs'
import path from 'node:path'
import { fetchTemplateRootText, fetchTemplateText, mapWithConcurrency, type TemplateRoot } from './remote.js'

export type CopyResult = { relPath: string; status: 'written' | 'skipped' | 'missing'; content?: string }

/**
 * Never overwrites a file that already exists — a file the user hand-edited (or that a
 * prior install already wrote) is always left alone and reported back, never clobbered.
 * `content` is included on 'written' results so callers can record a baseline hash for
 * `update`'s drift detection without a second read. Fetches concurrently (capped at 8
 * in-flight) since each file is now a network round-trip, not a local disk read.
 */
export async function copySelectedFiles(
  templateRoot: TemplateRoot,
  destDir: string,
  relPaths: string[],
  dryRun: boolean
): Promise<CopyResult[]> {
  return mapWithConcurrency(relPaths, 8, async (relPath): Promise<CopyResult> => {
    const destPath = path.join(destDir, relPath)
    if (fs.existsSync(destPath)) return { relPath, status: 'skipped' }

    const content = await fetchTemplateText(templateRoot, relPath)
    if (content === null) return { relPath, status: 'missing' }

    if (!dryRun) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true })
      fs.writeFileSync(destPath, content)
    }
    return { relPath, status: 'written', content }
  })
}

/** For the rare file that lives at the project root, not under src/ (e.g. vite-plugin-design-kit.ts). */
export async function copyTemplateRootFile(
  templateRoot: TemplateRoot,
  destRoot: string,
  relPath: string,
  dryRun: boolean
): Promise<CopyResult> {
  const destPath = path.join(destRoot, relPath)
  if (fs.existsSync(destPath)) return { relPath, status: 'skipped' }
  const content = await fetchTemplateRootText(templateRoot, relPath)
  if (content === null) return { relPath, status: 'missing' }
  if (!dryRun) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    fs.writeFileSync(destPath, content)
  }
  return { relPath, status: 'written', content }
}

export function writeGeneratedFile(destDir: string, relPath: string, content: string, dryRun: boolean): void {
  if (dryRun) return
  const destPath = path.join(destDir, relPath)
  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, content)
}

export type SyncResult = {
  relPath: string
  status: 'created' | 'updated' | 'up-to-date' | 'skipped-customized' | 'missing'
  content?: string
}

/**
 * `update`'s file-sync logic: write a managed file if it's missing, leave it alone if its
 * on-disk content already matches the template, and otherwise only overwrite if the file's
 * current hash still matches the baseline recorded at install time (meaning the user hasn't
 * touched it since) — or if `force` is passed. A file whose hash has drifted from the
 * baseline is reported as customized and left untouched.
 */
export async function syncManagedFiles(
  templateRoot: TemplateRoot,
  destDir: string,
  relPaths: string[],
  baselineHashes: Record<string, string>,
  hashFn: (content: string) => string,
  force: boolean,
  dryRun: boolean
): Promise<SyncResult[]> {
  return mapWithConcurrency(relPaths, 8, async (relPath): Promise<SyncResult> => {
    const templateContent = await fetchTemplateText(templateRoot, relPath)
    if (templateContent === null) return { relPath, status: 'missing' }

    const destPath = path.join(destDir, relPath)
    if (!fs.existsSync(destPath)) {
      if (!dryRun) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true })
        fs.writeFileSync(destPath, templateContent)
      }
      return { relPath, status: 'created', content: templateContent }
    }

    const currentContent = fs.readFileSync(destPath, 'utf8')
    if (currentContent === templateContent) {
      return { relPath, status: 'up-to-date', content: templateContent }
    }

    const currentHash = hashFn(currentContent)
    const baselineHash = baselineHashes[relPath]
    if (force || (baselineHash && currentHash === baselineHash)) {
      if (!dryRun) fs.writeFileSync(destPath, templateContent)
      return { relPath, status: 'updated', content: templateContent }
    }
    return { relPath, status: 'skipped-customized' }
  })
}
