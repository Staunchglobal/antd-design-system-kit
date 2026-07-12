import type { ThemeConfig } from 'antd'
import { GLOBAL_TOKEN_SCHEMA } from './token-schema.generated'
import type { ThemeManifest, ThemeTokenField, ThemeTokenGroup, TokenFieldValue } from './types'

/**
 * The "manifest" is computed in-memory by combining the static, committed token schema with
 * the live `theme-config.ts` values — no CSS/file scanning, no subprocess, unlike the sibling
 * shadcn kit's generate-theme-manifest.mjs. `theme-config.ts` is real TypeScript the app
 * already imports at runtime, so this just runs as a plain function.
 */
export function buildThemeManifest(themeConfig: ThemeConfig): ThemeManifest {
  const token = (themeConfig.token ?? {}) as Record<string, TokenFieldValue>
  const byGroup = new Map<string, ThemeTokenField[]>()

  for (const entry of GLOBAL_TOKEN_SCHEMA) {
    const isOverridden = Object.prototype.hasOwnProperty.call(token, entry.name)
    const value = isOverridden ? token[entry.name] : (entry.defaultValue as TokenFieldValue)
    const field: ThemeTokenField = { ...entry, value, isOverridden }
    if (!byGroup.has(entry.group)) byGroup.set(entry.group, [])
    byGroup.get(entry.group)!.push(field)
  }

  const groups: ThemeTokenGroup[] = [...byGroup.entries()].map(([title, fields]) => ({
    id: title.toLowerCase().replace(/\s+/g, '-'),
    title,
    fields,
  }))

  return { version: 1, groups }
}
