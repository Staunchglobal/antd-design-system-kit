import fs from 'node:fs'
import path from 'node:path'
import { log } from '../lib/log.js'
import { confirm } from '../lib/confirm.js'
import { readSelectionConfig, writeSelectionConfig } from '../lib/selection-state.js'
import { allComponentSlugs, navGroupsFor, demoFilesFor } from '../lib/selection.js'
import {
  generateDesignSystemContent,
  generateDesignSystemPage,
  generateDesignSystemPageShell,
  generateLivePreview,
  generateNavTs,
  generateThemeEditorPage,
  generateThemeEditorPageVite,
} from '../lib/codegen.js'
import { writeGeneratedFile } from '../lib/copy.js'

export type RemoveOptions = {
  cwd: string
  yes: boolean
  components: string
  dryRun?: boolean
}

export async function remove(options: RemoveOptions) {
  const root = path.resolve(options.cwd)
  log.title('Ant Design Design System Kit — remove')

  const config = readSelectionConfig(root)
  if (!config) {
    log.error('No antd-design-kit.json found — run `antd-design-kit init` first.')
    process.exitCode = 1
    return
  }

  const known = new Set(allComponentSlugs())
  const requested = options.components
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const unknown = requested.filter((s) => !known.has(s))
  if (unknown.length) log.warn(`Unknown component slug(s), ignoring: ${unknown.join(', ')}`)

  const toRemove = requested.filter((s) => known.has(s) && config.components.includes(s))
  const notInstalled = requested.filter((s) => known.has(s) && !config.components.includes(s))
  if (notInstalled.length) log.info(`Not currently in your showcase, skipping: ${notInstalled.join(', ')}`)

  if (!toRemove.length) {
    log.info('Nothing to remove.')
    return
  }

  log.info(`Will remove from /design-system: ${toRemove.join(', ')}`)
  const dryRun = !!options.dryRun
  if (!dryRun && !(await confirm('Proceed?', options.yes))) {
    log.info('Aborted.')
    return
  }

  const newSelection = config.components.filter((s) => !toRemove.includes(s))
  const navGroups = navGroupsFor(newSelection)

  const destRoot =
    config.framework === 'next'
      ? path.join(root, fs.existsSync(path.join(root, 'src/app')) ? 'src' : '')
      : path.join(root, 'src')
  const sectionsDir =
    config.framework === 'next' ? 'app/design-system/_sections' : 'design-system/_sections'

  log.title('Files')
  for (const slug of toRemove) {
    const sectionPath = path.join(destRoot, sectionsDir, `${slug}.tsx`)
    if (fs.existsSync(sectionPath)) {
      if (!dryRun) fs.unlinkSync(sectionPath)
      log[dryRun ? 'info' : 'success'](
        dryRun ? `Would delete ${path.relative(root, sectionPath)}` : `Deleted ${path.relative(root, sectionPath)}`
      )
    }
  }

  if (dryRun) {
    log.title('Done')
    log.info('Dry run — nothing was written.')
    return
  }

  if (config.framework === 'next') {
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
    writeGeneratedFile(
      destRoot,
      'app/theme-editor/page.tsx',
      generateThemeEditorPage({ componentSlugs: [...newSelection].sort() }),
      dryRun
    )
    writeGeneratedFile(
      destRoot,
      'app/theme-editor/_components/live-preview.tsx',
      generateLivePreview({
        navGroups,
        designSystemImportBase: '@/app/design-system',
        useClient: true,
      }),
      dryRun
    )
  } else {
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
    writeGeneratedFile(
      destRoot,
      'theme-editor/ThemeEditorPage.tsx',
      generateThemeEditorPageVite({ componentSlugs: [...newSelection].sort() }),
      dryRun
    )
    writeGeneratedFile(
      destRoot,
      'theme-editor/_components/live-preview.tsx',
      generateLivePreview({
        navGroups,
        designSystemImportBase: '@/design-system',
        useClient: false,
      }),
      dryRun
    )
  }
  log.success('Regenerated /design-system and /theme-editor.')

  writeSelectionConfig(root, config.framework, newSelection)

  log.title('Done')
  log.success(`Removed: ${toRemove.join(', ')}`)
  if (!newSelection.length) {
    log.warn('/design-system now has no components selected — run `init` again to add some back.')
  }
}
