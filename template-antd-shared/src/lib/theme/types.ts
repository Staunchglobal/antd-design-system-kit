import type { TokenSchemaEntry, TokenValueType } from './token-schema.generated'
import type { ComponentTokenSchemaEntry, ComponentTokenValueType } from './component-token-schema.generated'

export type { TokenSchemaEntry, TokenValueType, ComponentTokenSchemaEntry, ComponentTokenValueType }

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

export type ThemeComponentTokenField = ComponentTokenSchemaEntry & {
  /** Always a real, concrete value — antd's own computed default when not overridden, or the
   * user's override. Every field is always editable with a starting value, same as global
   * seed tokens; there's no "inherited/unset" display state. */
  value: TokenFieldValue
  /** true if this field's value differs from antd's own computed default (i.e. it would
   * actually be written into theme-config.ts on Save). */
  isOverridden: boolean
}

export type ThemeComponentTokenGroup = {
  id: string
  slug: string
  component: string
  title: string
  fields: ThemeComponentTokenField[]
}

/** Composable with antd's own `[darkAlgorithm, compactAlgorithm]` pattern — no `.dark` CSS
 * class the way the sibling shadcn kit does dark mode; this is 100% algorithm-driven. */
export type AlgorithmChoice = 'dark' | 'compact'

export type ThemeManifest = {
  version: number
  groups: ThemeTokenGroup[]
  componentGroups: ThemeComponentTokenGroup[]
  algorithm: AlgorithmChoice[]
}

/** POST body for /api/theme/save — only the fields the user actually overrode. */
export type ThemeSavePayload = {
  token: Record<string, TokenFieldValue>
  components: Record<string, Record<string, TokenFieldValue>>
  algorithm: AlgorithmChoice[]
}
