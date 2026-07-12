import path from 'node:path'
import pc from 'picocolors'
import { log } from '../lib/log.js'
import type { ProjectInfo, PackageManager } from '../lib/detect.js'
import { CORE_RUNTIME_DEPENDENCIES, NEXT_ONLY_RUNTIME_DEPENDENCIES, missingDeps, runInstall } from '../lib/deps.js'
import { copySelectedFiles, writeGeneratedFile } from '../lib/copy.js'
import { patchTsconfig } from '../lib/patch-tsconfig.js'
import { patchLayout } from '../lib/patch-layout.js'
import { confirm } from '../lib/confirm.js'
import { pickComponents } from '../lib/prompt-components.js'
import { navGroupsFor, demoFilesFor } from '../lib/selection.js'
import { writeSelectionConfig, priorSelectionFor, recordFileHashes } from '../lib/selection-state.js'
import { ALWAYS_NEXT_FILES, ALWAYS_SHARED_FILES } from '../lib/managed-files.js'
import { generateDesignSystemContent, generateDesignSystemPageShell, generateNavTs } from '../lib/codegen.js'

export type InitOptions = {
  cwd: string
  pm?: PackageManager
  yes: boolean
  skipInstall: boolean
  all?: boolean
  components?: string
  dryRun?: boolean
}

export async function runNextInit(project: ProjectInfo, pm: PackageManager, options: InitOptions) {
  const root = project.root

  if (project.appDirRelative === null) {
    log.error(
      'No App Router directory found (looked for src/app and app). This kit only supports the Next.js App Router.'
    )
    process.exitCode = 1
    return
  }

  const srcDir = project.appDirRelative === 'src/app' ? 'src' : ''
  const destRoot = path.join(root, srcDir)
  const rel = (p: string) => (srcDir ? `${srcDir}/${p}` : p)
  const aliasTarget = srcDir ? './src/*' : './*'
  log.info(`Layout: ${srcDir ? 'src/ directory' : 'no src/ directory (root layout)'}`)

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
  // Flat and selection-independent: every Ant Design component ships from the single
  // `antd` package, so picking more/fewer components never changes what gets installed.
  const existingDeps = {
    ...((project.packageJson.dependencies as Record<string, string>) ?? {}),
    ...((project.packageJson.devDependencies as Record<string, string>) ?? {}),
  }
  const neededRuntime = { ...CORE_RUNTIME_DEPENDENCIES, ...NEXT_ONLY_RUNTIME_DEPENDENCIES }
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
      log.skip('Skipped install — run it yourself before `next dev`.')
    }
  }

  // ---- Copy files -------------------------------------------------------------
  log.title('Files')
  const navGroups = navGroupsFor(selected)
  const sectionFiles = demoFilesFor(navGroups).map((f) => `app/design-system/_sections/${f}`)
  const dryRun = !!options.dryRun

  const nextFixed = copySelectedFiles('template-antd-next', destRoot, ALWAYS_NEXT_FILES, dryRun)
  const nextSections = copySelectedFiles('template-antd-next', destRoot, sectionFiles, dryRun)
  const sharedFixed = copySelectedFiles('template-antd-shared', destRoot, ALWAYS_SHARED_FILES, dryRun)
  const themeConfig = copySelectedFiles('template-antd-shared', destRoot, ['lib/theme/theme-config.ts'], dryRun)

  const results = [...nextFixed, ...nextSections, ...sharedFixed, ...themeConfig]
  for (const r of results) {
    if (r.status === 'written') log[dryRun ? 'info' : 'success'](dryRun ? `Would copy ${rel(r.relPath)}` : rel(r.relPath))
    else if (r.status === 'skipped') log.skip(`${rel(r.relPath)} (already exists — left untouched)`)
    else log.warn(`Missing template file: ${r.relPath}`)
  }

  if (!dryRun) {
    recordFileHashes(
      root,
      results
        .filter((r): r is typeof r & { content: string } => r.status === 'written' && r.content !== undefined)
        .map((r) => ({ relPath: r.relPath, content: r.content }))
    )
  }

  writeGeneratedFile(destRoot, 'app/design-system/_lib/nav.ts', generateNavTs(navGroups), dryRun)
  log.success(`${dryRun ? 'Would generate' : 'Generated'} ${rel('app/design-system/_lib/nav.ts')}`)

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
  log.success(
    `${dryRun ? 'Would generate' : 'Generated'} ${rel('app/design-system/_components/design-system-content.tsx')}`
  )

  writeGeneratedFile(
    destRoot,
    'app/design-system/page.tsx',
    generateDesignSystemPageShell({ contentImport: '@/app/design-system/_components/design-system-content' }),
    dryRun
  )
  log.success(`${dryRun ? 'Would generate' : 'Generated'} ${rel('app/design-system/page.tsx')}`)

  if (dryRun) {
    log.title('Wiring it up')
    log.skip('Skipping config patches (tsconfig.json, layout.tsx) — --dry-run')
    log.title('Done')
    log.info('Dry run — nothing was written. Re-run without --dry-run to actually install.')
    return
  }

  // ---- Patch configs ------------------------------------------------------------
  log.title('Wiring it up')

  const tsconfigResult = patchTsconfig(project.tsconfigPath, aliasTarget)
  if (tsconfigResult === 'added-alias') log.success(`Added "@/*": ["${aliasTarget}"] path alias to tsconfig.json`)
  else if (tsconfigResult === 'created') log.success('Created tsconfig.json')
  else if (tsconfigResult === 'already-present') log.skip('tsconfig.json already has the "@/*" alias')
  else log.warn(`Could not parse tsconfig.json — add "@/*": ["${aliasTarget}"] under compilerOptions.paths by hand`)

  const layoutPath = path.join(destRoot, 'app/layout.tsx')
  const layoutResult = patchLayout(layoutPath)
  if (layoutResult.action === 'patched') {
    log.success(`Wired AntdRegistry + AntdThemeProvider into ${rel('app/layout.tsx')}`)
  } else if (layoutResult.action === 'already-present') {
    log.skip(`${rel('app/layout.tsx')} already wires up AntdRegistry`)
  } else {
    log.warn(`Couldn't auto-wire ${rel('app/layout.tsx')} (${layoutResult.reason})`)
    log.info(
      `Add this yourself:\n  import { AntdRegistry } from '@ant-design/nextjs-registry'\n  import { AntdThemeProvider } from '@/app/theme-provider'\n  …\n  <AntdRegistry><AntdThemeProvider>{children}</AntdThemeProvider></AntdRegistry>`
    )
  }

  writeSelectionConfig(root, 'next', [...selected])

  // ---- Done ------------------------------------------------------------------------
  log.title('Done')
  log.success('Ant Design kit installed.')
  log.info(`Run your dev server, then visit ${pc.bold('/design-system')} and ${pc.bold('/theme-editor')}.`)
  log.info(`Run \`${pc.bold('antd-design-kit init')}\` again any time to add more components.`)
}
