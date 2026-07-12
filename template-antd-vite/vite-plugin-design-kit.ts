import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'
import { googleFonts } from './src/lib/theme/google-fonts.js'
import { GLOBAL_TOKEN_SCHEMA } from './src/lib/theme/token-schema.generated.js'
import { buildGoogleFontsHref, resolveWeights, type GoogleFontRequest } from './src/lib/theme/google-fonts-link.js'
import { defaultIconMap, ICON_KEYS } from './src/components/icons/icon-map.js'
import { serializeIconMap } from './src/components/icons/icon-map-codegen.js'

/**
 * Duplicates (rather than imports) the small pieces of `src/lib/theme/{validation,
 * theme-config-codegen}.ts` this plugin needs — it's loaded directly by vite.config.ts under
 * Vite's `tsconfig.node.json` (real ECMAScript `node16`/`nodenext` module resolution, which
 * requires `.js`-suffixed relative specifiers), while those two files internally import
 * sibling shared files (types.ts, token-schema.generated.ts) using the app's own bundler-mode
 * resolution (no extension) — a chain that breaks under node16. The three imports above are
 * safe to import directly instead: each is a leaf module with zero relative imports of its
 * own, so there's no transitive chain to break either way.
 */
type TokenFieldValue = string | number | boolean
type TokenValueType = 'color-hex' | 'number' | 'font-family' | 'boolean' | 'easing-string' | 'enum'

const SCHEMA_BY_NAME: Record<string, { valueType: TokenValueType; enumOptions?: string[] }> = {
  colorPrimary: { valueType: 'color-hex' },
  colorSuccess: { valueType: 'color-hex' },
  colorWarning: { valueType: 'color-hex' },
  colorError: { valueType: 'color-hex' },
  colorInfo: { valueType: 'color-hex' },
  colorLink: { valueType: 'color-hex' },
  colorTextBase: { valueType: 'color-hex' },
  colorBgBase: { valueType: 'color-hex' },
  fontFamily: { valueType: 'font-family' },
  fontFamilyCode: { valueType: 'font-family' },
  fontSize: { valueType: 'number' },
  lineWidth: { valueType: 'number' },
  lineType: { valueType: 'enum', enumOptions: ['solid', 'dashed', 'dotted', 'double', 'none'] },
  borderRadius: { valueType: 'number' },
  sizeUnit: { valueType: 'number' },
  sizeStep: { valueType: 'number' },
  sizePopupArrow: { valueType: 'number' },
  controlHeight: { valueType: 'number' },
  zIndexBase: { valueType: 'number' },
  zIndexPopupBase: { valueType: 'number' },
  opacityImage: { valueType: 'number' },
  motionUnit: { valueType: 'number' },
  motionBase: { valueType: 'number' },
  motionEaseOutCirc: { valueType: 'easing-string' },
  motionEaseInOutCirc: { valueType: 'easing-string' },
  motionEaseOut: { valueType: 'easing-string' },
  motionEaseInOut: { valueType: 'easing-string' },
  motionEaseOutBack: { valueType: 'easing-string' },
  motionEaseInBack: { valueType: 'easing-string' },
  motionEaseInQuint: { valueType: 'easing-string' },
  motionEaseOutQuint: { valueType: 'easing-string' },
  motion: { valueType: 'boolean' },
  wireframe: { valueType: 'boolean' },
  blue: { valueType: 'color-hex' },
  purple: { valueType: 'color-hex' },
  cyan: { valueType: 'color-hex' },
  green: { valueType: 'color-hex' },
  magenta: { valueType: 'color-hex' },
  red: { valueType: 'color-hex' },
  orange: { valueType: 'color-hex' },
  yellow: { valueType: 'color-hex' },
  volcano: { valueType: 'color-hex' },
  geekblue: { valueType: 'color-hex' },
  gold: { valueType: 'color-hex' },
  lime: { valueType: 'color-hex' },
}

function sanitizeTokenOverrides(input: unknown): Record<string, TokenFieldValue> {
  if (typeof input !== 'object' || input === null) return {}
  const out: Record<string, TokenFieldValue> = {}
  for (const [name, value] of Object.entries(input as Record<string, unknown>)) {
    const schema = SCHEMA_BY_NAME[name]
    if (!schema) continue
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

const DEFAULT_HEADER_COMMENT = `/**
 * Source of truth for Ant Design theming — passed straight to <ConfigProvider theme={...}>.
 * Safe to hand-edit. Save from /theme-editor fully regenerates this file from editor state
 * (preserving this leading comment) rather than surgically patching it — see the sibling
 * shadcn kit's tokens/fonts.css / icon-map.ts for the same accepted "wholesale rewrite on
 * save" tradeoff. \`cssVar: {}\` (Ant Design v6's CSS-variable mode takes an options object,
 * not a boolean) keeps real CSS custom properties available for tooling to read.
 */
`

function isValidIdentifier(name: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)
}

function serializeThemeConfig(existingSource: string | null, token: Record<string, TokenFieldValue>): string {
  const leadingComment = existingSource?.match(/^(\/\*\*[\s\S]*?\*\/\n)/)?.[1] ?? DEFAULT_HEADER_COMMENT
  const tokenEntries = Object.entries(token)
    .map(([name, value]) => `    ${isValidIdentifier(name) ? name : JSON.stringify(name)}: ${JSON.stringify(value)},`)
    .join('\n')
  const tokenBlock = tokenEntries ? `{\n${tokenEntries}\n  }` : '{}'
  return `${leadingComment}import type { ThemeConfig } from 'antd'

export const themeConfig: ThemeConfig = {
  token: ${tokenBlock},
  components: {},
  cssVar: {},
}
`
}

const FONT_TOKEN_NAMES = ['fontFamily', 'fontFamilyCode'] as const
const FONT_MARKER_START = '<!-- THEME_GOOGLE_FONTS_START -->'
const FONT_MARKER_END = '<!-- THEME_GOOGLE_FONTS_END -->'

function extractPrimaryFamily(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const first = value.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '')
  return first || null
}

/** Google Fonts referenced by the CURRENT effective token values (overrides merged over
 * schema defaults) — recomputed from scratch every save, so removing a font override also
 * removes its <link> tags rather than leaving them stale. */
function googleFontsInUse(token: Record<string, TokenFieldValue>): GoogleFontRequest[] {
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
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    `<link rel="stylesheet" href="${href}" />`,
    FONT_MARKER_END,
  ].join('\n    ')
}

/** Patches index.html between marker comments (or inserts them right before </head>). */
function patchIndexHtmlFonts(root: string, fonts: GoogleFontRequest[]): void {
  const indexPath = path.join(root, 'index.html')
  if (!fs.existsSync(indexPath)) return
  let src = fs.readFileSync(indexPath, 'utf8')
  const block = fontLinksBlock(fonts)
  const markerRe = /<!-- THEME_GOOGLE_FONTS_START -->[\s\S]*?<!-- THEME_GOOGLE_FONTS_END -->/
  src = markerRe.test(src) ? src.replace(markerRe, block) : src.replace(/<\/head>/, `    ${block}\n  </head>`)
  fs.writeFileSync(indexPath, src)
}

const SAFE_ICON_NAME_RE = /^[A-Z][A-Za-z0-9]*(Outlined|Filled|TwoTone)$/
const KNOWN_ICON_KEYS = new Set<string>(ICON_KEYS)

function sanitizeIconMap(input: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (typeof input !== 'object' || input === null) return out
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!KNOWN_ICON_KEYS.has(key)) continue
    if (typeof value === 'string' && SAFE_ICON_NAME_RE.test(value)) out[key] = value
  }
  return out
}

function readBody(req: import('node:http').IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/**
 * Dev-server-only middleware standing in for Next's `app/api/theme/save/route.ts` — Vite has
 * no framework routing layer of its own, so the theme editor's Save button POSTs here
 * instead. Only wired via `configureServer`, so it's absent from a production `vite build`.
 */
export function designKit(): Plugin {
  return {
    name: 'design-kit',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/theme/save', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }

        try {
          const raw = await readBody(req)
          const body = raw ? (JSON.parse(raw) as unknown) : {}
          const token =
            typeof body === 'object' && body !== null && 'token' in body
              ? sanitizeTokenOverrides((body as { token: unknown }).token)
              : {}
          const sanitizedIcons =
            typeof body === 'object' && body !== null && 'iconMap' in body
              ? sanitizeIconMap((body as { iconMap: unknown }).iconMap)
              : {}

          const themeConfigPath = path.join(server.config.root, 'src/lib/theme/theme-config.ts')
          const existingSource = fs.existsSync(themeConfigPath) ? fs.readFileSync(themeConfigPath, 'utf8') : null
          fs.writeFileSync(themeConfigPath, serializeThemeConfig(existingSource, token))

          patchIndexHtmlFonts(server.config.root, googleFontsInUse(token))

          const finalIconMap = Object.fromEntries(
            ICON_KEYS.map((key) => [key, sanitizedIcons[key] ?? defaultIconMap[key]])
          )
          const iconMapPath = path.join(server.config.root, 'src/components/icons/icon-map.ts')
          fs.writeFileSync(iconMapPath, serializeIconMap(finalIconMap))

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true, message: `Saved ${Object.keys(token).length} token override(s).` }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, message: err instanceof Error ? err.message : 'Save failed' }))
        }
      })
    },
  }
}
