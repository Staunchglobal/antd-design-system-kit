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

export type ThemeManifest = {
  version: number
  groups: ThemeTokenGroup[]
}

/** POST body for /api/theme/save — only the fields the user actually overrode. */
export type ThemeSavePayload = {
  token: Record<string, TokenFieldValue>
}
