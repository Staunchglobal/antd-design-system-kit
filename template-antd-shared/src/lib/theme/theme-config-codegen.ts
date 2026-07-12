import type { AlgorithmChoice, TokenFieldValue } from './types'

const DEFAULT_HEADER_COMMENT = `/**
 * Source of truth for Ant Design theming — passed straight to <ConfigProvider theme={...}>.
 * Safe to hand-edit. Save from /theme-editor fully regenerates this file from editor state
 * (preserving this leading comment) rather than surgically patching it — see the sibling
 * shadcn kit's tokens/fonts.css / icon-map.ts for the same accepted "wholesale rewrite on
 * save" tradeoff. \`cssVar: {}\` (Ant Design v6's CSS-variable mode takes an options object,
 * not a boolean) keeps real CSS custom properties available for tooling to read.
 */
`

const ALGORITHM_EXPR: Record<AlgorithmChoice, string> = {
  dark: 'theme.darkAlgorithm',
  compact: 'theme.compactAlgorithm',
}

/**
 * Full regenerate, not ts-morph AST surgery — deliberately different from the shadcn kit's
 * file-surgery approach (see plan §3b). `theme-config.ts` is a single, fully CLI-owned file
 * with nothing else legitimately living in it, so a full deterministic object-literal print
 * (via JSON.stringify, which also means every value is correctly escaped — no CSS/JS-literal
 * breakout risk) is simpler and lower-risk than surgical patching. The one concession to "don't
 * clobber the user": the file's leading doc-comment block is preserved across regenerates if
 * present, so hand-added notes there survive — editing *inside* the object literal itself
 * will not (documented in the header comment above).
 *
 * Pure (no `fs`) so this file stays safe to also live under the Vite app's `src/` — its own
 * `writeThemeConfig` wrapper is duplicated locally in the Next API route and the Vite plugin
 * instead, since only those two Node-side contexts need the actual file I/O.
 *
 * `algorithm` can't be serialized via JSON.stringify like the token values — antd's
 * dark/compact algorithms are real function references (`theme.darkAlgorithm`), not
 * serializable data — so this emits actual code (`import { theme } from 'antd'` + an
 * `algorithm: [theme.darkAlgorithm, ...]` expression) only when at least one is selected.
 */
export function serializeThemeConfig(
  existingSource: string | null,
  token: Record<string, TokenFieldValue>,
  algorithm: AlgorithmChoice[] = []
): string {
  const leadingComment = existingSource?.match(/^(\/\*\*[\s\S]*?\*\/\n)/)?.[1] ?? DEFAULT_HEADER_COMMENT

  const tokenEntries = Object.entries(token)
    .map(([name, value]) => `    ${isValidIdentifier(name) ? name : JSON.stringify(name)}: ${JSON.stringify(value)},`)
    .join('\n')

  const tokenBlock = tokenEntries ? `{\n${tokenEntries}\n  }` : '{}'

  const algorithmExprs = algorithm.map((a) => ALGORITHM_EXPR[a])
  const algorithmLine =
    algorithmExprs.length === 0
      ? 'undefined'
      : algorithmExprs.length === 1
        ? algorithmExprs[0]
        : `[${algorithmExprs.join(', ')}]`
  const themeImport = algorithmExprs.length > 0 ? `import { theme } from 'antd'\n` : ''

  return `${leadingComment}import type { ThemeConfig } from 'antd'
${themeImport}
export const themeConfig: ThemeConfig = {
  token: ${tokenBlock},
  components: {},
  algorithm: ${algorithmLine},
  cssVar: {},
}
`
}

function isValidIdentifier(name: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)
}
