import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { sanitizeTokenOverrides, sanitizeIconMap } from '@/lib/theme/validation'
import { serializeThemeConfig } from '@/lib/theme/theme-config-codegen'
import { GLOBAL_TOKEN_SCHEMA } from '@/lib/theme/token-schema.generated'
import { googleFonts } from '@/lib/theme/google-fonts'
import { buildGoogleFontsHref, resolveWeights, type GoogleFontRequest } from '@/lib/theme/google-fonts-link'
import { defaultIconMap, ICON_KEYS, type IconKey } from '@/components/icons/icon-map'
import { serializeIconMap } from '@/components/icons/icon-map-codegen'

export const runtime = 'nodejs'

const FONT_TOKEN_NAMES = ['fontFamily', 'fontFamilyCode'] as const
const FONT_MARKER_START = '{/* THEME_GOOGLE_FONTS_START */}'
const FONT_MARKER_END = '{/* THEME_GOOGLE_FONTS_END */}'

/** Works whether this app uses a src/ layout or not. */
function srcPrefix(): string {
  return fs.existsSync(path.join(process.cwd(), 'src')) ? 'src/' : ''
}

function extractPrimaryFamily(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const first = value.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '')
  return first || null
}

/** Google Fonts referenced by the CURRENT effective token values (overrides merged over
 * schema defaults) — recomputed from scratch every save, so removing a font override also
 * removes its <link> tags rather than leaving them stale. */
function googleFontsInUse(token: Record<string, unknown>): GoogleFontRequest[] {
  const out: GoogleFontRequest[] = []
  const seen = new Set<string>()
  for (const name of FONT_TOKEN_NAMES) {
    const schemaDefault = GLOBAL_TOKEN_SCHEMA.find((e) => e.name === name)?.defaultValue
    const effective = name in token ? token[name] : schemaDefault
    const family = extractPrimaryFamily(effective)
    if (!family || seen.has(family)) continue
    const entry = googleFonts.find((f) => f.family === family)
    if (!entry) continue
    seen.add(family)
    out.push({ family, weights: resolveWeights(entry.weights) })
  }
  return out
}

function fontLinksBlock(fonts: GoogleFontRequest[]): string {
  if (!fonts.length) return `${FONT_MARKER_START}${FONT_MARKER_END}`
  const href = buildGoogleFontsHref(fonts)
  return [
    FONT_MARKER_START,
    '<link rel="preconnect" href="https://fonts.googleapis.com" />',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />',
    `<link rel="stylesheet" href="${href}" precedence="default" />`,
    FONT_MARKER_END,
  ].join('\n        ')
}

/** Patches layout.tsx between marker comments (or inserts them right after <html ...>) — a
 * `<link rel="stylesheet">` needs `precedence` to be hoisted by React 19; a literal CSS
 * `@import` can't be used here since layout.tsx is nested deep in the app's import chain and
 * `@import` must be a stylesheet's first rule. */
function patchLayoutFonts(fonts: GoogleFontRequest[]): void {
  const layoutPath = path.join(process.cwd(), `${srcPrefix()}app/layout.tsx`)
  if (!fs.existsSync(layoutPath)) return
  let src = fs.readFileSync(layoutPath, 'utf8')
  const block = fontLinksBlock(fonts)
  const markerRe = /\{\/\* THEME_GOOGLE_FONTS_START \*\/\}[\s\S]*?\{\/\* THEME_GOOGLE_FONTS_END \*\/\}/
  src = markerRe.test(src) ? src.replace(markerRe, block) : src.replace(/(<html[^>]*>)/, `$1\n        ${block}`)
  fs.writeFileSync(layoutPath, src)
}

/** Works whether this app uses a src/ layout or not. */
function themeConfigPath(): string {
  return path.join(process.cwd(), `${srcPrefix()}lib/theme/theme-config.ts`)
}

function iconMapPath(): string {
  return path.join(process.cwd(), `${srcPrefix()}components/icons/icon-map.ts`)
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, message: 'Theme editing is disabled in production.' }, { status: 403 })
  }

  const body = (await request.json()) as unknown
  const token =
    typeof body === 'object' && body !== null && 'token' in body
      ? sanitizeTokenOverrides((body as { token: unknown }).token)
      : {}
  const sanitizedIcons: Partial<Record<IconKey, string>> =
    typeof body === 'object' && body !== null && 'iconMap' in body
      ? sanitizeIconMap((body as { iconMap: unknown }).iconMap)
      : {}

  const filePath = themeConfigPath()
  const existingSource = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null
  fs.writeFileSync(filePath, serializeThemeConfig(existingSource, token))

  patchLayoutFonts(googleFontsInUse(token))

  const finalIconMap = Object.fromEntries(
    ICON_KEYS.map((key) => [key, sanitizedIcons[key] ?? defaultIconMap[key]])
  ) as Record<string, string>
  fs.writeFileSync(iconMapPath(), serializeIconMap(finalIconMap))

  return NextResponse.json({ ok: true, message: `Saved ${Object.keys(token).length} token override(s).` })
}
