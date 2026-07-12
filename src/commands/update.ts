import fs from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import { log } from '../lib/log.js'
import { detectProject } from '../lib/detect.js'
import { fetchTemplateRootText } from '../lib/remote.js'
import { syncManagedFiles, writeGeneratedFile, type SyncResult } from '../lib/copy.js'
import { readSelectionConfig, recordFileHashes, sha256 } from '../lib/selection-state.js'
import { ALWAYS_SHARED_FILES, ALWAYS_NEXT_FILES, ALWAYS_VITE_FILES } from '../lib/managed-files.js'
import { navGroupsFor, demoFilesFor } from '../lib/selection.js'
import {
  generateDesignSystemContent,
  generateDesignSystemPage,
  generateDesignSystemPageShell,
  generateNavTs,
} from '../lib/codegen.js'

export type UpdateOptions = {
  cwd: string
  yes: boolean
  force: boolean
  dryRun?: boolean
}

function logSyncResults(results: SyncResult[], prefix: (relPath: string) => string, dryRun: boolean): void {
  for (const r of results) {
    switch (r.status) {
      case 'created':
        log[dryRun ? 'info' : 'success'](dryRun ? `Would create ${prefix(r.relPath)}` : `${prefix(r.relPath)} (created)`)
        break
      case 'updated':
        log[dryRun ? 'info' : 'success'](dryRun ? `Would update ${prefix(r.relPath)}` : `${prefix(r.relPath)} (updated)`)
        break
      case 'up-to-date':
        log.skip(`${prefix(r.relPath)} (up to date)`)
        break
      case 'skipped-customized':
        log.warn(`${prefix(r.relPath)} (customized — left untouched, use --force to overwrite)`)
        break
      case 'missing':
        log.warn(`Missing template file: ${r.relPath}`)
        break
    }
  }
}

export async function update(options: UpdateOptions) {
  const root = path.resolve(options.cwd)
  log.title('Ant Design Design System Kit — update')

  if (!fs.existsSync(path.join(root, 'package.json'))) {
    log.error(`No package.json found at ${root}. Run this inside your project.`)
    process.exitCode = 1
    return
  }

  const config = readSelectionConfig(root)
  if (!config) {
    log.error('No antd-design-kit.json found — run `antd-design-kit init` first.')
    process.exitCode = 1
    return
  }

  const project = detectProject(root)
  const dryRun = !!options.dryRun
  const selected = new Set(config.components)
  const navGroups = navGroupsFor(selected)

  if (config.framework === 'next') {
    if (project.appDirRelative === null) {
      log.error('No App Router directory found (looked for src/app and app).')
      process.exitCode = 1
      return
    }
    const srcDir = project.appDirRelative === 'src/app' ? 'src' : ''
    const destRoot = path.join(root, srcDir)
    const rel = (p: string) => (srcDir ? `${srcDir}/${p}` : p)
    const sectionFiles = demoFilesFor(navGroups).map((f) => `app/design-system/_sections/${f}`)

    log.title('Files')
    const [nextFixed, nextSections, sharedFixed] = await Promise.all([
      syncManagedFiles('template-antd-next', destRoot, ALWAYS_NEXT_FILES, config.fileHashes, sha256, options.force, dryRun),
      syncManagedFiles('template-antd-next', destRoot, sectionFiles, config.fileHashes, sha256, options.force, dryRun),
      syncManagedFiles('template-antd-shared', destRoot, ALWAYS_SHARED_FILES, config.fileHashes, sha256, options.force, dryRun),
    ])

    const allResults = [...nextFixed, ...nextSections, ...sharedFixed]
    logSyncResults(allResults, rel, dryRun)

    if (!dryRun) {
      writeGeneratedFile(destRoot, 'app/design-system/_lib/nav.ts', generateNavTs(navGroups), dryRun)
      writeGeneratedFile(
        destRoot,
        'app/design-system/_components/design-system-content.tsx',
        generateDesignSystemContent({
          navGroups,
          importBase: '@/app/design-system',
          sidebarImport: '@/app/design-system/_components/sidebar-nav',
        }),
        dryRun
      )
      writeGeneratedFile(
        destRoot,
        'app/design-system/page.tsx',
        generateDesignSystemPageShell({ contentImport: '@/app/design-system/_components/design-system-content' }),
        dryRun
      )
      log.success('Regenerated nav.ts, design-system-content.tsx, and page.tsx.')

      recordFileHashes(
        root,
        allResults
          .filter((r) => (r.status === 'created' || r.status === 'updated') && r.content !== undefined)
          .map((r) => ({ relPath: r.relPath, content: r.content! }))
      )
    }

    const customizedCount = allResults.filter((r) => r.status === 'skipped-customized').length
    log.title('Done')
    if (dryRun) {
      log.info('Dry run — nothing was written.')
    } else {
      log.success('Update complete.')
      if (customizedCount) {
        log.warn(`${customizedCount} file(s) look customized and were left untouched — re-run with ${pc.bold('--force')} to overwrite them too.`)
      }
    }
    return
  }

  // ---- Vite ----------------------------------------------------------------------
  if (!project.hasSrcDir) {
    log.error('No `src/` directory found.')
    process.exitCode = 1
    return
  }
  const destRoot = path.join(root, 'src')
  const sectionFiles = demoFilesFor(navGroups).map((f) => `design-system/_sections/${f}`)

  log.title('Files')
  const [viteFixed, viteSections, sharedFixed] = await Promise.all([
    syncManagedFiles('template-antd-vite', destRoot, ALWAYS_VITE_FILES, config.fileHashes, sha256, options.force, dryRun),
    syncManagedFiles('template-antd-vite', destRoot, sectionFiles, config.fileHashes, sha256, options.force, dryRun),
    syncManagedFiles('template-antd-shared', destRoot, ALWAYS_SHARED_FILES, config.fileHashes, sha256, options.force, dryRun),
  ])

  const allResults = [...viteFixed, ...viteSections, ...sharedFixed]
  logSyncResults(allResults, (p) => `src/${p}`, dryRun)

  // vite-plugin-design-kit.ts lives at the project root, not under src/ — synced by hand
  // rather than through syncManagedFiles, which assumes a single destDir for all relPaths.
  const pluginRelPath = 'vite-plugin-design-kit.ts'
  const pluginTemplateContent = await fetchTemplateRootText('template-antd-vite', pluginRelPath)
  const pluginDestPath = path.join(root, pluginRelPath)
  let pluginResult: SyncResult | null = null
  if (pluginTemplateContent === null) {
    log.warn(`Missing template file: ${pluginRelPath}`)
  } else if (!fs.existsSync(pluginDestPath)) {
    if (!dryRun) fs.writeFileSync(pluginDestPath, pluginTemplateContent)
    pluginResult = { relPath: pluginRelPath, status: 'created', content: pluginTemplateContent }
    log[dryRun ? 'info' : 'success'](dryRun ? `Would create ${pluginRelPath}` : `${pluginRelPath} (created)`)
  } else {
    const current = fs.readFileSync(pluginDestPath, 'utf8')
    if (current === pluginTemplateContent) {
      log.skip(`${pluginRelPath} (up to date)`)
    } else {
      const baseline = config.fileHashes[pluginRelPath]
      if (options.force || (baseline && sha256(current) === baseline)) {
        if (!dryRun) fs.writeFileSync(pluginDestPath, pluginTemplateContent)
        pluginResult = { relPath: pluginRelPath, status: 'updated', content: pluginTemplateContent }
        log[dryRun ? 'info' : 'success'](dryRun ? `Would update ${pluginRelPath}` : `${pluginRelPath} (updated)`)
      } else {
        log.warn(`${pluginRelPath} (customized — left untouched, use --force to overwrite)`)
      }
    }
  }

  if (!dryRun) {
    writeGeneratedFile(destRoot, 'design-system/_lib/nav.ts', generateNavTs(navGroups), dryRun)
    writeGeneratedFile(
      destRoot,
      'design-system/DesignSystemPage.tsx',
      generateDesignSystemPage({
        navGroups,
        importBase: '@/design-system',
        sidebarImport: '@/design-system/_components/sidebar-nav',
      }),
      dryRun
    )
    log.success('Regenerated nav.ts and DesignSystemPage.tsx.')

    recordFileHashes(
      root,
      [...allResults, ...(pluginResult ? [pluginResult] : [])]
        .filter((r) => (r.status === 'created' || r.status === 'updated') && r.content !== undefined)
        .map((r) => ({ relPath: r.relPath, content: r.content! }))
    )
  }

  const customizedCount = allResults.filter((r) => r.status === 'skipped-customized').length
  log.title('Done')
  if (dryRun) {
    log.info('Dry run — nothing was written.')
  } else {
    log.success('Update complete.')
    if (customizedCount) {
      log.warn(`${customizedCount} file(s) look customized and were left untouched — re-run with ${pc.bold('--force')} to overwrite them too.`)
    }
  }
}
