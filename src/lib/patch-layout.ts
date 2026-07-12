import fs from 'node:fs'
import { Project, SyntaxKind } from 'ts-morph'

export type LayoutPatchResult =
  | { action: 'patched' }
  | { action: 'already-present' }
  | { action: 'needs-manual'; reason: string }

const REGISTRY_IMPORT = `import { AntdRegistry } from '@ant-design/nextjs-registry'`
const CONFIG_PROVIDER_IMPORT = `import { ConfigProvider } from 'antd'`
const THEME_CONFIG_IMPORT = `import { themeConfig } from '@/lib/theme/theme-config'`

/**
 * Wraps the single `{children}` expression in layout.tsx with
 * <AntdRegistry><ConfigProvider theme={themeConfig}>{children}</ConfigProvider></AntdRegistry>
 * — the official SSR-safe pattern for Ant Design under the Next.js App Router (AntdRegistry
 * handles the @ant-design/cssinjs style-extraction/flush dance into the RSC stream).
 *
 * Uses ts-morph to find the real `{children}` JsxExpression (not a plain regex, which can't
 * tell a JSX child apart from the `children` identifier in the function's own destructured
 * parameter) and the real last top-level import to anchor new imports to. The edit itself is
 * a plain text splice at the AST-computed positions, preserving the file's existing formatting
 * instead of routing it through ts-morph's printer.
 */
export function patchLayout(filePath: string): LayoutPatchResult {
  if (!fs.existsSync(filePath)) {
    return { action: 'needs-manual', reason: `${filePath} not found.` }
  }

  const project = new Project({ skipAddingFilesFromTsConfig: true, skipFileDependencyResolution: true })
  const sourceFile = project.addSourceFileAtPath(filePath)

  const importDecls = sourceFile.getImportDeclarations()
  const alreadyImported = (specifier: string) => importDecls.some((d) => d.getModuleSpecifierValue() === specifier)
  if (alreadyImported('@ant-design/nextjs-registry')) {
    return { action: 'already-present' }
  }

  const childrenExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.JsxExpression).filter((e) => {
    const expr = e.getExpression()
    return expr?.getKind() === SyntaxKind.Identifier && expr.getText() === 'children'
  })
  if (childrenExpressions.length !== 1) {
    return {
      action: 'needs-manual',
      reason:
        childrenExpressions.length === 0
          ? 'Could not find `{children}` in layout.tsx.'
          : 'layout.tsx renders `{children}` more than once — pick the right spot by hand.',
    }
  }

  if (!importDecls.length) {
    return { action: 'needs-manual', reason: 'Could not find an import line to anchor new imports to.' }
  }

  let src = sourceFile.getFullText()
  const childrenNode = childrenExpressions[0]
  const replacement = [
    '<AntdRegistry>',
    '          <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>',
    '        </AntdRegistry>',
  ].join('\n')
  src = src.slice(0, childrenNode.getStart()) + replacement + src.slice(childrenNode.getEnd())

  const insertAt = importDecls[importDecls.length - 1].getEnd()
  const imports = [REGISTRY_IMPORT, CONFIG_PROVIDER_IMPORT, THEME_CONFIG_IMPORT].join('\n')
  src = src.slice(0, insertAt) + `\n${imports}` + src.slice(insertAt)

  fs.writeFileSync(filePath, src)
  return { action: 'patched' }
}
