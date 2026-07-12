import fs from 'node:fs'
import { Project, SyntaxKind } from 'ts-morph'

export type MainEntryPatchResult =
  | { action: 'patched' }
  | { action: 'already-present' }
  | { action: 'needs-manual'; reason: string }

const CONFIG_PROVIDER_IMPORT = `import { ConfigProvider } from 'antd'`
const THEME_CONFIG_IMPORT = `import { themeConfig } from './lib/theme/theme-config'`

/**
 * Wraps the JSX argument of the `.render(...)` call in main.tsx with
 * <ConfigProvider theme={themeConfig}>...</ConfigProvider>. Vite is client-rendered only, so
 * no SSR style-extraction registry is needed here (unlike Next's AntdRegistry) — antd's
 * default CSS-in-JS injection at render time is fine as-is.
 *
 * Uses ts-morph to find the real `root.render(...)` call and its JSX argument, rather than a
 * regex — createRoot's render call can span multiple lines and nest a <StrictMode> wrapper.
 * The edit is a plain text splice at the AST-computed position to preserve existing formatting.
 */
export function patchMainEntry(mainEntryPath: string | null): MainEntryPatchResult {
  if (!mainEntryPath || !fs.existsSync(mainEntryPath)) {
    return { action: 'needs-manual', reason: 'Could not find src/main.tsx.' }
  }

  const project = new Project({ skipAddingFilesFromTsConfig: true, skipFileDependencyResolution: true })
  const sourceFile = project.addSourceFileAtPath(mainEntryPath)

  const importDecls = sourceFile.getImportDeclarations()
  const alreadyImported = (specifier: string) => importDecls.some((d) => d.getModuleSpecifierValue() === specifier)
  if (alreadyImported('antd')) {
    return { action: 'already-present' }
  }

  const renderCall = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).find((c) => {
    const expr = c.getExpression()
    return expr.getKind() === SyntaxKind.PropertyAccessExpression && expr.getText().endsWith('.render')
  })
  const jsxArg = renderCall?.getArguments()[0]
  if (!renderCall || !jsxArg) {
    return { action: 'needs-manual', reason: 'Could not find a `<root>.render(<JSX/>)` call in main.tsx.' }
  }

  let src = sourceFile.getFullText()
  const wrapped = `<ConfigProvider theme={themeConfig}>${jsxArg.getText()}</ConfigProvider>`
  src = src.slice(0, jsxArg.getStart()) + wrapped + src.slice(jsxArg.getEnd())

  if (!importDecls.length) {
    return { action: 'needs-manual', reason: 'Could not find an import line to anchor new imports to.' }
  }
  const insertAt = importDecls[importDecls.length - 1].getEnd()
  const imports = [CONFIG_PROVIDER_IMPORT, THEME_CONFIG_IMPORT].join('\n')
  src = src.slice(0, insertAt) + `\n${imports}` + src.slice(insertAt)

  fs.writeFileSync(mainEntryPath, src)
  return { action: 'patched' }
}
