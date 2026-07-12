import fs from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import { log } from '../lib/log.js'
import { detectProject, detectPackageManager } from '../lib/detect.js'
import { runNextInit, type InitOptions } from './init-next.js'
import { runViteInit } from './init-vite.js'

export type { InitOptions } from './init-next.js'

export async function init(options: InitOptions) {
  const root = path.resolve(options.cwd)
  log.title('Ant Design Design System Kit')

  if (!fs.existsSync(path.join(root, 'package.json'))) {
    log.error(`No package.json found at ${root}. Run this inside your project.`)
    process.exitCode = 1
    return
  }

  const project = detectProject(root)

  if (!project.framework) {
    log.error(
      'Could not find a "next" or "vite" dependency in package.json — this kit supports Next.js (App Router) and Vite + React projects.'
    )
    process.exitCode = 1
    return
  }

  if (!project.hasTypeScriptDependency || !project.hasTsconfig) {
    log.error(
      'This kit requires a TypeScript project (a "typescript" dependency and a tsconfig). Set up TypeScript first, then re-run.'
    )
    process.exitCode = 1
    return
  }

  const pm = options.pm ?? detectPackageManager(root)
  log.info(`Framework: ${pc.bold(project.framework)}`)
  log.info(`Package manager: ${pc.bold(pm)}`)
  log.info(`Project root: ${pc.bold(root)}`)

  if (project.framework === 'next') {
    await runNextInit(project, pm, options)
  } else {
    await runViteInit(project, pm, options)
  }
}
