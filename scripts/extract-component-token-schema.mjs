#!/usr/bin/env node
/**
 * Regenerates template-antd-shared/src/lib/theme/component-token-schema.generated.ts from
 * antd's own shipped source — no hand-authored field lists, no placeholder defaults. Two real
 * sources are combined, the same overall strategy as scripts/extract-token-schema.mjs:
 *
 *  - `node_modules/antd/es/<dir>/style/{token,index}.d.ts` — each component's own shipped
 *    `ComponentToken` interface, still carrying real JSDoc (`@desc`/`@descEN`), parsed with
 *    ts-morph for field names/labels/descriptions. A handful of components (FloatButton,
 *    AutoComplete, TimePicker, QRCode, ConfigProvider, Watermark, ...) either alias
 *    `ComponentToken` to `object` (no user-settable tokens) or reuse another component's
 *    tokens entirely — both correctly produce no interface to walk and are skipped.
 *  - `node_modules/antd/lib/<dir>/style/{token,index}.js` (the CJS build — antd's `es/` ESM
 *    build uses extensionless internal imports that don't resolve under plain Node ESM
 *    resolution, but the CJS build does) — each component's real `prepareComponentToken` /
 *    `initComponentToken` function, called with `theme.getDesignToken()`'s live default
 *    AliasToken (plus a `calc` helper via `@ant-design/cssinjs-utils`'s `genCalc('js')`, which
 *    several components' prepare functions call internally) to get antd's actual computed
 *    default for every field — the same values antd itself renders with out of the box.
 *
 * `message` and `notification` don't export their `prepareComponentToken` publicly (it's a
 * local, unexported const in both — confirmed by reading the source directly), so their two
 * known fields are computed by mirroring that exact local formula by hand below
 * (MANUAL_COMPUTE) rather than guessing a placeholder. Any field whose computed value comes
 * back `undefined` (e.g. notification's `colorSuccessBg`/`colorErrorBg`/etc., which really are
 * `undefined` in antd's own default — resolved per-notification-type at render time, not a
 * static default) is dropped from the schema entirely rather than faked.
 *
 * `valueType` is derived from the REAL computed value's JS type (not a static .d.ts type-text
 * guess) wherever a default was successfully computed — more accurate, since the runtime shape
 * is ground truth. The `Color`/`Bg`-suffix name heuristic still distinguishes an actual color
 * string from a generic one (e.g. a box-shadow or `linear-gradient(...)` string).
 *
 * Run manually with `npm run build:component-token-schema` after bumping the `antd`
 * devDependency — not run at end-user install time, same pattern as token-schema.generated.ts.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { Project } from 'ts-morph'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const antdEsDir = path.join(root, 'node_modules/antd/es')
const antdLibDir = path.join(root, 'node_modules/antd/lib')
const outPath = path.join(root, 'template-antd-shared/src/lib/theme/component-token-schema.generated.ts')
const require = createRequire(import.meta.url)

/**
 * Mirrors the slugs in src/generated/registry.ts's COMPONENTS keys (kept as a local literal,
 * not imported, so this script stays a standalone Node tool like its siblings — importing a
 * generated .ts file from a maintainer-only .mjs script isn't a pattern used elsewhere here).
 * Re-copy from registry.ts if `npm run build:registry` adds/removes components.
 */
const COMPONENT_SLUGS = [
  'button', 'float-button', 'icon', 'typography', 'divider', 'flex', 'grid', 'layout', 'masonry',
  'space', 'splitter', 'anchor', 'breadcrumb', 'dropdown', 'menu', 'pagination', 'steps', 'tabs',
  'auto-complete', 'cascader', 'checkbox', 'color-picker', 'date-picker', 'form', 'input',
  'input-number', 'mentions', 'radio', 'rate', 'select', 'slider', 'switch', 'time-picker',
  'transfer', 'tree-select', 'upload', 'avatar', 'badge', 'calendar', 'card', 'carousel',
  'collapse', 'descriptions', 'empty', 'image', 'list', 'popover', 'qr-code', 'segmented',
  'statistic', 'table', 'tag', 'timeline', 'tooltip', 'tour', 'tree', 'alert', 'drawer',
  'message', 'modal', 'notification', 'popconfirm', 'progress', 'result', 'skeleton', 'spin',
  'watermark', 'affix', 'app', 'border-beam', 'config-provider', 'util',
]

// The one slug whose antd package directory name doesn't match PascalCase(slug)'s dashed
// source — qr-code has no settable ComponentToken anyway, kept here for documentation.
const DIR_OVERRIDES = { 'qr-code': 'qrcode' }

function pascalCase(slug) {
  return slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')
}

function humanize(slug) {
  return slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ')
}

function isColorField(name) {
  return /Color/.test(name) || /Bg([A-Z]|$)/.test(name) || /^color[A-Z]/.test(name)
}

function valueTypeForComputed(name, value) {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  return isColorField(name) ? 'color-hex' : 'string'
}

// ---- Real computed defaults, via antd's own prepareComponentToken/initComponentToken -------

const { theme } = require('antd')
const { genCalc } = require('@ant-design/cssinjs-utils')
const aliasToken = { ...theme.getDesignToken(), calc: genCalc('js') }

// message/notification's real prepareComponentToken is a local, unexported const — mirrors
// that exact formula (read directly from node_modules/antd/lib/{message,notification}/style/
// index.js) rather than guessing. CONTAINER_MAX_OFFSET is antd's own real constant, not a
// hand-picked number.
const { CONTAINER_MAX_OFFSET } = require('antd/lib/_util/hooks/useZIndex.js')
const MANUAL_COMPUTE = {
  message: (token) => ({
    zIndexPopup: token.zIndexPopupBase + CONTAINER_MAX_OFFSET + 10,
    contentBg: token.colorBgElevated,
  }),
  notification: (token) => ({
    zIndexPopup: token.zIndexPopupBase + CONTAINER_MAX_OFFSET + 50,
    width: 384,
  }),
}

function computeDefaultsFor(slug, dir) {
  if (MANUAL_COMPUTE[slug]) return MANUAL_COMPUTE[slug](aliasToken)

  let mod = null
  for (const file of ['token.js', 'index.js']) {
    const p = path.join(antdLibDir, dir, 'style', file)
    if (fs.existsSync(p)) {
      try {
        mod = require(p)
        break
      } catch {
        // fall through to the next candidate file
      }
    }
  }
  if (!mod) return null

  const fnName =
    ['prepareComponentToken', 'initComponentToken'].find((n) => typeof mod[n] === 'function') ??
    Object.keys(mod).find((k) => /^(prepare|init)[A-Za-z]*ComponentToken$/i.test(k) && typeof mod[k] === 'function')
  if (!fnName) return null

  try {
    return mod[fnName](aliasToken)
  } catch {
    return null
  }
}

// ---- Field catalog, via ts-morph over antd's shipped .d.ts ---------------------------------

const project = new Project({ skipAddingFilesFromTsConfig: true, skipFileDependencyResolution: true })
const groups = []
let droppedNoDefault = 0

for (const slug of [...COMPONENT_SLUGS].sort()) {
  const dir = DIR_OVERRIDES[slug] ?? slug
  const styleDir = path.join(antdEsDir, dir, 'style')
  let dtsPath = null
  for (const candidate of ['token.d.ts', 'index.d.ts']) {
    const p = path.join(styleDir, candidate)
    if (fs.existsSync(p)) { dtsPath = p; break }
  }
  if (!dtsPath) continue

  const sourceFile = project.addSourceFileAtPath(dtsPath)
  const iface = sourceFile.getInterface('ComponentToken')
  if (!iface) {
    project.removeSourceFile(sourceFile)
    continue // e.g. FloatButton's `export type ComponentToken = object` — no user-settable tokens
  }

  const computed = computeDefaultsFor(slug, dir)

  const fields = []
  for (const prop of iface.getType().getProperties()) {
    const decl = prop.getValueDeclaration()
    if (!decl) continue
    const name = prop.getName()

    const jsDocs = typeof decl.getJsDocs === 'function' ? decl.getJsDocs() : []
    const isDeprecated = jsDocs.some((doc) => doc.getTags().some((t) => t.getTagName() === 'deprecated'))
    if (isDeprecated) continue

    const tagText = (tagName) =>
      jsDocs.flatMap((doc) => doc.getTags()).find((t) => t.getTagName() === tagName)?.getCommentText()?.trim()
    const descEN = tagText('descEN')

    const defaultValue = computed ? computed[name] : undefined
    if (defaultValue === undefined || (typeof defaultValue !== 'string' && typeof defaultValue !== 'number' && typeof defaultValue !== 'boolean')) {
      droppedNoDefault++
      continue // no real computed default (uncomputable component, or a field antd itself leaves undefined) — don't fake one
    }

    fields.push({
      name,
      valueType: valueTypeForComputed(name, defaultValue),
      defaultValue,
      label: humanize(name.replace(/([a-z0-9])([A-Z])/g, '$1-$2')),
      description: descEN || undefined,
    })
  }
  project.removeSourceFile(sourceFile)

  if (fields.length === 0) continue
  groups.push({ slug, component: pascalCase(slug), title: humanize(slug), fields })
}

const body = groups
  .map((g) => {
    const fieldLines = g.fields
      .map((f) => {
        const lines = [
          `      { name: ${JSON.stringify(f.name)}, valueType: ${JSON.stringify(f.valueType)}, label: ${JSON.stringify(f.label)},`,
          `        defaultValue: ${JSON.stringify(f.defaultValue)},`,
        ]
        if (f.description) lines.push(`        description: ${JSON.stringify(f.description)} },`)
        else lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, ' },')
        return lines.join('\n')
      })
      .join('\n')
    return `  {
    slug: ${JSON.stringify(g.slug)},
    component: ${JSON.stringify(g.component)},
    title: ${JSON.stringify(g.title)},
    fields: [
${fieldLines}
    ],
  },`
  })
  .join('\n')

const out = `/**
 * Ant Design's per-component token catalog (component name, field name, label, description,
 * and antd's own REAL computed default), generated from each component's own shipped
 * \`ComponentToken\` interface (\`node_modules/antd/es/<dir>/style/{token,index}.d.ts\`) plus its
 * real \`prepareComponentToken\`/\`initComponentToken\` function (\`node_modules/antd/lib/<dir>/
 * style/{token,index}.js\`, called with \`theme.getDesignToken()\`'s default AliasToken) by
 * \`scripts/extract-component-token-schema.mjs\`. Every field here has a real, concrete default
 * — the same value antd itself renders with — never a placeholder; fields antd computes as
 * genuinely \`undefined\` by design are simply not included.
 * Regenerate with \`node scripts/extract-component-token-schema.mjs\` after bumping antd's
 * version — not run at end-user install time, same pattern as token-schema.generated.ts.
 */
export type ComponentTokenValueType = 'color-hex' | 'number' | 'boolean' | 'string'

export type ComponentTokenSchemaEntry = {
  name: string
  valueType: ComponentTokenValueType
  defaultValue: string | number | boolean
  label: string
  description?: string
}

export type ComponentTokenGroup = {
  /** Registry slug, e.g. 'input-number' — matches COMPONENTS keys in src/generated/registry.ts. */
  slug: string
  /** Real Ant Design component name, e.g. 'InputNumber' — the key under theme.components. */
  component: string
  title: string
  fields: ComponentTokenSchemaEntry[]
}

export const COMPONENT_TOKEN_SCHEMA: ComponentTokenGroup[] = [
${body}
]
`

fs.writeFileSync(outPath, out)
const totalFields = groups.reduce((n, g) => n + g.fields.length, 0)
console.log(
  `Wrote ${path.relative(root, outPath)} (${groups.length} components, ${totalFields} fields, ${droppedNoDefault} field(s) dropped — no real computed default)`
)
