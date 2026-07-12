import { Command } from 'commander'
import { init } from './commands/init.js'
import { update } from './commands/update.js'
import type { PackageManager } from './lib/detect.js'

const program = new Command()

program
  .name('antd-design-kit')
  .description(
    'Scaffolds Ant Design v6, a design-token theme system, a /design-system showcase, and a live /theme-editor into a Next.js (App Router) or Vite + React + TypeScript project.'
  )
  .version('0.1.0')

program
  .command('init')
  .description('Install Ant Design and generate the /design-system showcase in this project')
  .option('--cwd <path>', 'run against a different project directory', process.cwd())
  .option('--pm <manager>', 'force a package manager (npm, pnpm, yarn, bun)')
  .option('-y, --yes', 'skip confirmation prompts (implies --all unless --components is given)', false)
  .option('--skip-install', 'skip installing dependencies', false)
  .option('--all', 'include every component in the showcase, skipping the picker', false)
  .option(
    '--components <slugs>',
    'comma-separated component slugs to show (e.g. button,card,form), skipping the picker'
  )
  .option('--dry-run', 'preview what would be installed/changed without writing anything', false)
  .action(async (opts) => {
    await init({
      cwd: opts.cwd,
      pm: opts.pm as PackageManager | undefined,
      yes: !!opts.yes,
      skipInstall: !!opts.skipInstall,
      all: !!opts.all,
      components: opts.components as string | undefined,
      dryRun: !!opts.dryRun,
    })
  })

program
  .command('update')
  .description("Re-sync your currently-installed files to this CLI version's templates (skips anything you've customized)")
  .option('--cwd <path>', 'run against a different project directory', process.cwd())
  .option('-y, --yes', 'skip confirmation prompts', false)
  .option('--force', 'overwrite files that look customized too', false)
  .option('--dry-run', 'preview which files would be updated without writing anything', false)
  .action(async (opts) => {
    await update({
      cwd: opts.cwd,
      yes: !!opts.yes,
      force: !!opts.force,
      dryRun: !!opts.dryRun,
    })
  })

program.parseAsync(process.argv)
