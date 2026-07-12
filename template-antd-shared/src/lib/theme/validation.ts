import { GLOBAL_TOKEN_SCHEMA } from './token-schema.generated'
import type { TokenFieldValue } from './types'

const SCHEMA_BY_NAME = new Map(GLOBAL_TOKEN_SCHEMA.map((e) => [e.name, e]))

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
