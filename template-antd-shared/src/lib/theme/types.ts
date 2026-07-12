import type { TokenSchemaEntry, TokenValueType } from './token-schema.generated'

export type { TokenSchemaEntry, TokenValueType }

export type TokenFieldValue = string | number | boolean

export type ThemeTokenField = TokenSchemaEntry & {
  value: TokenFieldValue
  /** true if this field's value differs from antd's own seed-token default (i.e. it would
   * actually be written into theme-config.ts on Save) — false means "inherited". */
  isOverridden: boolean
}

export type ThemeTokenGroup = {
  id: string
  title: string
  fields: ThemeTokenField[]
}

/** Composable with antd's own `[darkAlgorithm, compactAlgorithm]` pattern — no `.dark` CSS
 * class the way the sibling shadcn kit does dark mode; this is 100% algorithm-driven. */
export type AlgorithmChoice = 'dark' | 'compact'

export type ThemeManifest = {
  version: number
  groups: ThemeTokenGroup[]
  algorithm: AlgorithmChoice[]
}

/** POST body for /api/theme/save — only the fields the user actually overrode. */
export type ThemeSavePayload = {
  token: Record<string, TokenFieldValue>
  algorithm: AlgorithmChoice[]
}
