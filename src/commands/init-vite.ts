import path from 'node:path'
import pc from 'picocolors'
import { log } from '../lib/log.js'
import type { ProjectInfo, PackageManager } from '../lib/detect.js'
import { CORE_RUNTIME_DEPENDENCIES, missingDeps, runInstall } from '../lib/deps.js'
import { copySelectedFiles, copyTemplateRootFile, writeGeneratedFile } from '../lib/copy.js'
import { patchTsconfig } from '../lib/patch-tsconfig.js'
import { patchMainEntry } from '../lib/patch-main-entry.js'
import { patchViteConfig, VITE_CONFIG_MANUAL_SNIPPET } from '../lib/patch-vite-config.js'
import { confirm } from '../lib/confirm.js'
import { pickComponents } from '../lib/prompt-components.js'
import { navGroupsFor, demoFilesFor } from '../lib/selection.js'
import { writeSelectionConfig, priorSelectionFor, recordFileHashes } from '../lib/selection-state.js'
import { ALWAYS_SHARED_FILES, ALWAYS_VITE_FILES } from '../lib/managed-files.js'
import { generateDesignSystemPage, generateNavTs } from '../lib/codegen.js'
import type { InitOptions } from './init-next.js'

export async function runViteInit(project: ProjectInfo, pm: PackageManager, options: InitOptions) {
  const root = project.root

  if (!project.hasSrcDir) {
    log.error('No `src/` directory found. This kit expects the standard `create-vite` layout (src/main.tsx, …).')
    process.exitCode = 1
    return
  }

  // ---- Which components? ------------------------------------------------------
  log.title('Components')
  const prior = priorSelectionFor(root)
  const picked = await pickComponents(prior, options)
  const selected = new Set([...picked, ...prior])
  if (!selected.size) {
    log.warn('No components selected — /design-system will be generated empty.')
  } else {
    log.info(`Showcase sections for: ${[...selected].sort().join(', ')}`)
  }

  // ---- Dependencies -------------------------------------------------------
  const existingDeps = {
    ...((project.packageJson.dependencies as Record<string, string>) ?? {}),
    ...((project.packageJson.devDependencies as Record<string, string>) ?? {}),
  }
  const neededRuntime = { ...CORE_RUNTIME_DEPENDENCIES }
  const runtimeToInstall = missingDeps(neededRuntime, existingDeps)

  log.title('Dependencies')
  if (!Object.keys(runtimeToInstall).length) {
    log.success('Everything already installed.')
  } else {
    log.info(`Will install: ${Object.keys(runtimeToInstall).join(', ')}`)
    if (options.dryRun) {
      log.skip('Skipping install (--dry-run).')
    } else if (options.skipInstall) {
      log.skip('Skipping install (--skip-install).')
    } else if (await confirm('Install these now?', options.yes)) {
      const ok = runInstall(pm, root, Object.keys(runtimeToInstall), false)
      if (!ok) {
        log.error('Dependency install failed.')
        process.exitCode = 1
        return
      }
      log.success('Dependencies installed.')
    } else {
      log.skip('Skipped install — run it yourself before `vite dev`.')
    }
  }

  // ---- Copy files -------------------------------------------------------------
  log.title('Files')
  const navGroups = navGroupsFor(selected)
  const sectionFiles = demoFilesFor(navGroups).map((f) => `design-system/_sections/${f}`)
  const dryRun = !!options.dryRun
  const destRoot = path.join(root, 'src')

  const viteFixed = copySelectedFiles('template-antd-vite', destRoot, ALWAYS_VITE_FILES, dryRun)
  const viteSections = copySelectedFiles('template-antd-vite', destRoot, sectionFiles, dryRun)
  const sharedFixed = copySelectedFiles('template-antd-shared', destRoot, ALWAYS_SHARED_FILES, dryRun)
  const themeConfig = copySelectedFiles('template-antd-shared', destRoot, ['lib/theme/theme-config.ts'], dryRun)
  const pluginFile = copyTemplateRootFile('template-antd-vite', root, 'vite-plugin-design-kit.ts', dryRun)

  const results = [...viteFixed, ...viteSections, ...sharedFixed, ...themeConfig]
  for (const r of results) {
    if (r.status === 'written') log[dryRun ? 'info' : 'success'](dryRun ? `Would copy src/${r.relPath}` : `src/${r.relPath}`)
    else if (r.status === 'skipped') log.skip(`src/${r.relPath} (already exists — left untouched)`)
    else log.warn(`Missing template file: ${r.relPath}`)
  }
  if (pluginFile.status === 'written') log[dryRun ? 'info' : 'success'](dryRun ? `Would copy ${pluginFile.relPath}` : pluginFile.relPath)
  else if (pluginFile.status === 'skipped') log.skip(`${pluginFile.relPath} (already exists — left untouched)`)
  else log.warn(`Missing template file: ${pluginFile.relPath}`)

  if (!dryRun) {
    recordFileHashes(
      root,
      [...results, pluginFile]
        .filter((r): r is typeof r & { content: string } => r.status === 'written' && r.content !== undefined)
        .map((r) => ({ relPath: r.relPath, content: r.content }))
    )
  }

  writeGeneratedFile(destRoot, 'design-system/_lib/nav.ts', generateNavTs(navGroups), dryRun)
  log.success(`${dryRun ? 'Would generate' : 'Generated'} src/design-system/_lib/nav.ts`)

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
  log.success(`${dryRun ? 'Would generate' : 'Generated'} src/design-system/DesignSystemPage.tsx`)

  if (dryRun) {
    log.title('Wiring it up')
    log.skip('Skipping config patches (tsconfig.json, main entry) — --dry-run')
    log.title('Done')
    log.info('Dry run — nothing was written. Re-run without --dry-run to actually install.')
    return
  }

  // ---- Patch configs ------------------------------------------------------------
  log.title('Wiring it up')

  const mainEntryResult = patchMainEntry(project.mainEntryPath)
  if (mainEntryResult.action === 'patched') {
    log.success(`Wired ConfigProvider into ${path.basename(project.mainEntryPath!)}`)
  } else if (mainEntryResult.action === 'already-present') {
    log.skip('Entry file already wires up ConfigProvider')
  } else {
    log.warn(`Couldn't auto-wire main.tsx (${mainEntryResult.reason})`)
    log.info(
      `Add this yourself:\n  import { ConfigProvider } from 'antd'\n  import { themeConfig } from './lib/theme/theme-config'\n  …\n  <ConfigProvider theme={themeConfig}><App /></ConfigProvider>`
    )
  }

  const tsconfigResult = patchTsconfig(project.tsconfigPath)
  if (tsconfigResult === 'added-alias') log.success(`Added "@/*" path alias to ${path.basename(project.tsconfigPath)}`)
  else if (tsconfigResult === 'already-present') log.skip(`${path.basename(project.tsconfigPath)} already has the "@/*" alias`)
  else if (tsconfigResult === 'created') log.success('Created tsconfig.json')
  else log.warn(`Could not parse ${path.basename(project.tsconfigPath)} — add "@/*": ["./src/*"] by hand`)

  if (project.viteConfigPath) {
    const viteConfigResult = patchViteConfig(project.viteConfigPath)
    if (viteConfigResult.action === 'patched')
      log.success('Added the "@" resolve alias + designKit() theme-save plugin to vite.config.ts')
    else if (viteConfigResult.action === 'already-present') log.skip('vite.config.ts already wired up')
    else {
      log.warn(`Couldn't auto-wire vite.config.ts (${viteConfigResult.reason})`)
      log.info(`Merge this in by hand:\n${VITE_CONFIG_MANUAL_SNIPPET}`)
    }
  } else {
    log.warn('Could not find vite.config.{ts,js,mts} — add the "@" resolve alias + designKit() plugin by hand.')
    log.info(`Reference:\n${VITE_CONFIG_MANUAL_SNIPPET}`)
  }

  writeSelectionConfig(root, 'vite', [...selected])

  // ---- Done ------------------------------------------------------------------------
  log.title('Manual step: mount the pages')
  log.info(
    'Vite has no built-in router, so wire these up yourself — e.g. with react-router-dom:\n' +
      `  import DesignSystemPage from '@/design-system/DesignSystemPage'\n` +
      `  import ThemeEditorPage from '@/theme-editor/ThemeEditorPage'\n` +
      '  …\n' +
      '  <Route path="/design-system" element={<DesignSystemPage />} />\n' +
      '  <Route path="/theme-editor" element={<ThemeEditorPage />} />'
  )

  log.title('Done')
  log.success('Ant Design kit installed.')
  log.info(`Run your dev server, then visit whatever route you mounted ${pc.bold('DesignSystemPage')} at.`)
  log.info(`Run \`${pc.bold('antd-design-kit init')}\` again any time to add more components.`)
}
