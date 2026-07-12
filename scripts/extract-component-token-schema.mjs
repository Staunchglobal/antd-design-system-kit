#!/usr/bin/env node
/**
 * Regenerates template-antd-shared/src/lib/theme/component-token-schema.generated.ts from
 * antd's own shipped `.d.ts` files — no hand-authored field lists. Each component that
 * exposes a real, settable `ComponentToken` interface ships one at
 * `node_modules/antd/es/<dir>/style/{token,index}.d.ts`, still carrying real JSDoc
 * (`@desc`/`@descEN`) the same way the global `SeedToken` interface does (see
 * scripts/extract-token-schema.mjs). A handful of components (FloatButton, AutoComplete,
 * TimePicker, QRCode, ColorPicker's siblings, ConfigProvider, Watermark) either alias
 * `ComponentToken` to `object` (no user-settable tokens) or reuse another component's
 * tokens entirely — both correctly produce no interface to walk here and are skipped.
 *
 * Unlike global seed tokens, component tokens have no static default value to record — antd
 * computes them at render time from the current seed/alias tokens (see e.g.
 * button/style/token.js's `prepareComponentToken`), so a field with no explicit override is
 * simply shown as "inherits from the global token" rather than trying to capture antd's
 * internal computed default (see plan §2).
 *
 * Run manually with `npm run build:component-token-schema` after bumping the `antd`
 * devDependency — not run at end-user install time, same pattern as token-schema.generated.ts.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Project } from 'ts-morph'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const antdEsDir = path.join(root, 'node_modules/antd/es')
const outPath = path.join(root, 'template-antd-shared/src/lib/theme/component-token-schema.generated.ts')

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

function valueTypeFor(name, tsTypeText) {
  if (tsTypeText === 'boolean') return 'boolean'
  if (tsTypeText === 'number') return 'number'
  if (tsTypeText === 'string') {
    if (/Color/.test(name) || /Bg([A-Z]|$)/.test(name) || /^color[A-Z]/.test(name)) return 'color-hex'
    return 'string'
  }
  return 'string' // number|string unions, CSSProperties<...>-derived types, etc. — freeform text is the safe fallback
}

const project = new Project({ skipAddingFilesFromTsConfig: true, skipFileDependencyResolution: true })
const groups = []

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
    const tsTypeText = decl.getType().getText()

    fields.push({
      name,
      valueType: valueTypeFor(name, tsTypeText),
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
        ]
        if (f.description) lines.push(`        description: ${JSON.stringify(f.description)} },`)
        else lines[0] = lines[0].replace(/,$/, ' },')
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
 * Ant Design's per-component token catalog (component name, field name, label, description),
 * generated from each component's own shipped \`ComponentToken\` interface
 * (\`node_modules/antd/es/<dir>/style/{token,index}.d.ts\`) by
 * \`scripts/extract-component-token-schema.mjs\`. No default value is recorded — unlike global
 * seed tokens, antd computes component tokens at render time from the current seed/alias
 * tokens, so an unset field simply means "inherits the computed default" (see build-manifest.ts).
 * Regenerate with \`node scripts/extract-component-token-schema.mjs\` after bumping antd's
 * version — not run at end-user install time, same pattern as token-schema.generated.ts.
 */
export type ComponentTokenValueType = 'color-hex' | 'number' | 'boolean' | 'string'

export type ComponentTokenSchemaEntry = {
  name: string
  valueType: ComponentTokenValueType
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
console.log(`Wrote ${path.relative(root, outPath)} (${groups.length} components, ${totalFields} fields)`)
