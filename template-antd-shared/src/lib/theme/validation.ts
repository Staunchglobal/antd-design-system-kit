import { GLOBAL_TOKEN_SCHEMA } from './token-schema.generated'
import type { TokenFieldValue } from './types'
import { ICON_KEYS, type IconKey } from '../../components/icons/icon-map'

const SCHEMA_BY_NAME = new Map(GLOBAL_TOKEN_SCHEMA.map((e) => [e.name, e]))

/** Every real @ant-design/icons export follows this naming convention — a charset allowlist
 * is enough here since, unlike token values, an icon name never gets embedded as free text;
 * it's always written as a literal object value via JSON.stringify (icon-map-codegen.ts). */
const SAFE_ICON_NAME_RE = /^[A-Z][A-Za-z0-9]*(Outlined|Filled|TwoTone)$/
const KNOWN_ICON_KEYS = new Set<string>(ICON_KEYS)

export function sanitizeIconMap(input: unknown): Record<IconKey, string> {
  const out = {} as Record<IconKey, string>
  if (typeof input !== 'object' || input === null) return out
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!KNOWN_ICON_KEYS.has(key)) continue // unknown icon key — silently dropped, not an error
    if (typeof value === 'string' && SAFE_ICON_NAME_RE.test(value)) out[key as IconKey] = value
  }
  return out
}

/**
 * Save writes values via `JSON.stringify` (see theme-config-codegen.ts), not raw string
 * interpolation, so there's no CSS/JS-literal breakout risk the way the sibling shadcn kit's
 * `isSafeCssValue` had to guard against — JSON.stringify already escapes quotes/backticks/
 * `${...}` correctly. What's left to validate is correctness: reject token names that aren't
 * on the known schema (an actual allowlist lookup, not just a charset regex — the full set of
 * legal keys is statically known here) and reject values whose JS type doesn't match what
 * that token expects.
 */
export function sanitizeTokenOverrides(input: unknown): Record<string, TokenFieldValue> {
  if (typeof input !== 'object' || input === null) return {}
  const out: Record<string, TokenFieldValue> = {}

  for (const [name, value] of Object.entries(input as Record<string, unknown>)) {
    const schema = SCHEMA_BY_NAME.get(name)
    if (!schema) continue // unknown token name — silently dropped, not an error

    switch (schema.valueType) {
      case 'number':
        if (typeof value === 'number' && Number.isFinite(value)) out[name] = value
        break
      case 'boolean':
        if (typeof value === 'boolean') out[name] = value
        break
      case 'enum':
        if (typeof value === 'string' && schema.enumOptions?.includes(value)) out[name] = value
        break
      case 'color-hex':
      case 'font-family':
      case 'easing-string':
        if (typeof value === 'string') out[name] = value
        break
    }
  }

  return out
}
