import fs from 'node:fs'
import { IndentationText, Project, QuoteKind, SyntaxKind, type ObjectLiteralExpression } from 'ts-morph'

export type ViteConfigPatchResult =
  | { action: 'patched' }
  | { action: 'already-present' }
  | { action: 'needs-manual'; reason: string }

/**
 * Adds the `"@/*" -> "./src/*"` resolve alias to vite.config.ts's `defineConfig({ ... })`
 * call — tsconfig's `paths` only affects the type-checker/editor, Vite's own bundler needs
 * this separately to actually resolve `@/...` imports at runtime.
 *
 * Uses ts-morph to locate the real defineConfig call and its `resolve.alias` object by AST
 * structure (not a regex), so a multi-line config or one with existing plugins/resolve still
 * works; only bails to a manual snippet for shapes it can't safely reason about.
 */
export function patchViteConfig(filePath: string): ViteConfigPatchResult {
  if (!fs.existsSync(filePath)) {
    return { action: 'needs-manual', reason: `${filePath} not found.` }
  }

  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
    manipulationSettings: { quoteKind: QuoteKind.Single, indentationText: IndentationText.TwoSpaces },
  })
  const sourceFile = project.addSourceFileAtPath(filePath)

  const importDecls = sourceFile.getImportDeclarations()
  const alreadyImported = (specifier: string) => importDecls.some((d) => d.getModuleSpecifierValue() === specifier)

  const defineConfigCall = sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((c) => c.getExpression().getText() === 'defineConfig')
  if (!defineConfigCall) {
    return {
      action: 'needs-manual',
      reason: 'Could not find a `defineConfig(...)` call — add the "@/*" alias in by hand.',
    }
  }

  const arg = defineConfigCall.getArguments()[0]
  if (!arg || arg.getKind() !== SyntaxKind.ObjectLiteralExpression) {
    return {
      action: 'needs-manual',
      reason: 'defineConfig(...) is not called with a plain object literal — add the alias in by hand.',
    }
  }
  const configObject = arg as ObjectLiteralExpression

  const resolveProp = configObject.getProperty('resolve')
  if (resolveProp) {
    const resolveInitializer = resolveProp.asKind(SyntaxKind.PropertyAssignment)?.getInitializer()
    if (resolveInitializer?.getKind() !== SyntaxKind.ObjectLiteralExpression) {
      return { action: 'needs-manual', reason: '`resolve` is not a plain object literal — add the alias by hand.' }
    }
    const resolveObject = resolveInitializer.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    const aliasProp = resolveObject.getProperty('alias')
    if (aliasProp) {
      const aliasInitializer = aliasProp.asKind(SyntaxKind.PropertyAssignment)?.getInitializer()
      if (aliasInitializer?.getKind() !== SyntaxKind.ObjectLiteralExpression) {
        return { action: 'needs-manual', reason: '`resolve.alias` is not a plain object literal — add "@" by hand.' }
      }
      const aliasObject = aliasInitializer.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
      if (aliasObject.getProperty('@') || aliasObject.getProperty("'@'")) {
        return { action: 'already-present' }
      }
      aliasObject.addPropertyAssignment({ name: `'@'`, initializer: `fileURLToPath(new URL('./src', import.meta.url))` })
    } else {
      resolveObject.addPropertyAssignment({
        name: 'alias',
        initializer: `{ '@': fileURLToPath(new URL('./src', import.meta.url)) }`,
      })
    }
  } else {
    const newResolveProp = configObject
      .addPropertyAssignment({ name: 'resolve', initializer: '{}' })
      .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    const newAliasProp = newResolveProp
      .addPropertyAssignment({ name: 'alias', initializer: '{}' })
      .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    newAliasProp.addPropertyAssignment({
      name: `'@'`,
      initializer: `fileURLToPath(new URL('./src', import.meta.url))`,
    })
  }

  let src = sourceFile.getFullText()
  if (!alreadyImported('node:url')) {
    const importLine = `import { fileURLToPath } from 'node:url'`
    if (importDecls.length) {
      const insertAt = importDecls[importDecls.length - 1].getEnd()
      src = src.slice(0, insertAt) + `\n${importLine}` + src.slice(insertAt)
    } else {
      src = `${importLine}\n` + src
    }
  }

  fs.writeFileSync(filePath, src)
  return { action: 'patched' }
}

export const VITE_CONFIG_MANUAL_SNIPPET = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
`
