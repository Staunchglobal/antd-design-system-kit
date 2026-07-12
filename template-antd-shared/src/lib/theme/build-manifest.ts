import { theme, type ThemeConfig } from 'antd'
import { GLOBAL_TOKEN_SCHEMA } from './token-schema.generated'
import { COMPONENT_TOKEN_SCHEMA } from './component-token-schema.generated'
import type {
  AlgorithmChoice,
  ThemeComponentTokenField,
  ThemeComponentTokenGroup,
  ThemeManifest,
  ThemeTokenField,
  ThemeTokenGroup,
  TokenFieldValue,
} from './types'

/**
 * The "manifest" is computed in-memory by combining the static, committed token schema with
 * the live `theme-config.ts` values — no CSS/file scanning, no subprocess, unlike the sibling
 * shadcn kit's generate-theme-manifest.mjs. `theme-config.ts` is real TypeScript the app
 * already imports at runtime, so this just runs as a plain function.
 */
export function buildThemeManifest(themeConfig: ThemeConfig, options?: { componentSlugs?: string[] }): ThemeManifest {
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

  return {
    version: 1,
    groups,
    componentGroups: buildComponentTokenGroups(themeConfig, options?.componentSlugs),
    algorithm: algorithmChoiceFromConfig(themeConfig),
  }
}

function buildComponentTokenGroups(themeConfig: ThemeConfig, componentSlugs?: string[]): ThemeComponentTokenGroup[] {
  const components = (themeConfig.components ?? {}) as Record<string, Record<string, TokenFieldValue> | undefined>
  const allowed = componentSlugs ? new Set(componentSlugs) : null
  const schema = allowed ? COMPONENT_TOKEN_SCHEMA.filter((g) => allowed.has(g.slug)) : COMPONENT_TOKEN_SCHEMA

  return schema.map((group) => {
    const overrides = components[group.component] ?? {}
    const fields: ThemeComponentTokenField[] = group.fields.map((entry) => {
      const isOverridden = Object.prototype.hasOwnProperty.call(overrides, entry.name)
      const value = isOverridden ? overrides[entry.name] : entry.defaultValue
      return { ...entry, value, isOverridden }
    })
    return { id: group.slug, slug: group.slug, component: group.component, title: group.title, fields }
  })
}

/** antd's dark/compact algorithms are real function references, not serializable strings —
 * recover the current selection by identity comparison against `theme-config.ts`'s actual
 * `algorithm` value. */
function algorithmChoiceFromConfig(themeConfig: ThemeConfig): AlgorithmChoice[] {
  const raw = themeConfig.algorithm
  const list = Array.isArray(raw) ? raw : raw ? [raw] : []
  const choice: AlgorithmChoice[] = []
  if (list.includes(theme.darkAlgorithm)) choice.push('dark')
  if (list.includes(theme.compactAlgorithm)) choice.push('compact')
  return choice
}
