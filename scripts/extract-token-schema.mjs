#!/usr/bin/env node
/**
 * Regenerates template-antd-shared/src/lib/theme/token-schema.generated.ts from antd's own
 * shipped source — no guessing, no hand-authored defaults. Two real sources are combined:
 *
 *  - node_modules/antd/es/theme/interface/seeds.d.ts — the `SeedToken` interface (+ its
 *    `PresetColorType` base) still ships real JSDoc (`@nameEN`/`@descEN` tags survive in the
 *    published .d.ts), parsed here with ts-morph (already a CLI dependency) for label/
 *    description text and each property's TS type (string/number/boolean).
 *  - node_modules/antd/es/theme/themes/seed.js — the actual default seed token VALUES antd
 *    ships (colorPrimary: '#1677ff', etc.), imported directly since it's a small,
 *    self-contained ES module with no further imports of its own.
 *
 * Run manually with `npm run build:token-schema` after bumping the `antd` devDependency —
 * not run at end-user install time (the generated file is committed, like google-fonts.ts).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Project } from 'ts-morph'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const antdDir = path.join(root, 'node_modules/antd')
const seedsDtsPath = path.join(antdDir, 'es/theme/interface/seeds.d.ts')
const seedJsPath = path.join(antdDir, 'es/theme/themes/seed.js')
const outPath = path.join(root, 'template-antd-shared/src/lib/theme/token-schema.generated.ts')

const { default: defaultSeedValues } = await import(pathToFileURL(seedJsPath).href)

const project = new Project({ skipAddingFilesFromTsConfig: true, skipFileDependencyResolution: true })
const sourceFile = project.addSourceFileAtPath(seedsDtsPath)
const seedTokenInterface = sourceFile.getInterfaceOrThrow('SeedToken')

// getType().getProperties() walks the `extends PresetColorType` base too, not just SeedToken's
// own members — this is how the preset color palette entries (blue, purple, ...) get included.
const properties = seedTokenInterface.getType().getProperties()

const LINE_TYPE_OPTIONS = ['solid', 'dashed', 'dotted', 'double', 'none']

// A couple of antd's own `@nameEN` doc tags read as full sentences rather than short labels
// (upstream doc-comment inconsistency) — override just those rather than complicating the
// general-purpose tag parser for one-off cases.
const LABEL_OVERRIDES = {
  opacityImage: 'Image Opacity',
}

function humanize(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())
}

function groupFor(name) {
  if (['blue', 'purple', 'cyan', 'green', 'magenta', 'red', 'orange', 'yellow', 'volcano', 'geekblue', 'gold', 'lime'].includes(name)) {
    return 'Preset Colors'
  }
  if (name.startsWith('color')) return 'Colors'
  if (name.startsWith('font')) return 'Typography'
  if (name.startsWith('motion')) return 'Motion'
  if (name === 'wireframe') return 'Behavior'
  return 'Layout'
}

function valueTypeFor(name, tsTypeText) {
  if (tsTypeText === 'boolean') return 'boolean'
  if (name === 'lineType') return 'enum'
  if (name.startsWith('motionEase')) return 'easing-string'
  if (name === 'fontFamily' || name === 'fontFamilyCode') return 'font-family'
  if (tsTypeText === 'number') return 'number'
  return 'color-hex'
}

const entries = []
for (const prop of properties) {
  const decl = prop.getValueDeclaration()
  if (!decl) continue
  const name = prop.getName()

  const jsDocs = typeof decl.getJsDocs === 'function' ? decl.getJsDocs() : []
  const isDeprecated = jsDocs.some((doc) => doc.getTags().some((t) => t.getTagName() === 'deprecated'))
  if (isDeprecated) continue // e.g. PresetColorType's `pink` (superseded by `magenta`)

  const tagText = (tagName) =>
    jsDocs.flatMap((doc) => doc.getTags()).find((t) => t.getTagName() === tagName)?.getCommentText()?.trim()

  const nameEN = tagText('nameEN')
  const descEN = tagText('descEN')
  const tsTypeText = decl.getType().getText()

  const defaultValue = defaultSeedValues[name]
  if (defaultValue === undefined) {
    throw new Error(`No default value found for seed token "${name}" in seed.js — antd's shape may have changed.`)
  }

  const valueType = valueTypeFor(name, tsTypeText)
  const entry = {
    name,
    valueType,
    defaultValue,
    label: LABEL_OVERRIDES[name] || nameEN || humanize(name),
    description: descEN || nameEN || undefined,
    group: groupFor(name),
  }
  if (valueType === 'enum' && name === 'lineType') entry.enumOptions = LINE_TYPE_OPTIONS
  entries.push(entry)
}

const body = entries
  .map((e) => {
    const lines = [
      `  {`,
      `    name: ${JSON.stringify(e.name)},`,
      `    valueType: ${JSON.stringify(e.valueType)},`,
      `    defaultValue: ${JSON.stringify(e.defaultValue)},`,
      `    label: ${JSON.stringify(e.label)},`,
    ]
    if (e.description) lines.push(`    description: ${JSON.stringify(e.description)},`)
    lines.push(`    group: ${JSON.stringify(e.group)},`)
    if (e.enumOptions) lines.push(`    enumOptions: ${JSON.stringify(e.enumOptions)},`)
    lines.push(`  },`)
    return lines.join('\n')
  })
  .join('\n')

const out = `/**
 * Ant Design's global Seed Token catalog (name, default value, label, description, group),
 * generated from antd's own shipped `+ '`SeedToken`' + ` interface + its `+ '`PresetColorType`' + ` base
 * (`+ '`node_modules/antd/es/theme/interface/seeds.d.ts`' + `) and the real default values
 * (`+ '`node_modules/antd/es/theme/themes/seed.js`' + `) by `+ '`scripts/extract-token-schema.mjs`' + `.
 * Regenerate with `+ '`node scripts/extract-token-schema.mjs`' + ` after bumping antd's version —
 * not run at end-user install time, same pattern as google-fonts.ts.
 */
export type TokenValueType =
  | 'color-hex'
  | 'number'
  | 'font-family'
  | 'boolean'
  | 'easing-string'
  | 'enum'

export type TokenSchemaEntry = {
  name: string
  valueType: TokenValueType
  defaultValue: unknown
  label: string
  description?: string
  group: string
  enumOptions?: string[]
}

export const GLOBAL_TOKEN_SCHEMA: TokenSchemaEntry[] = [
${body}
]
`

fs.writeFileSync(outPath, out)
console.log(`Wrote ${path.relative(root, outPath)} (${entries.length} seed tokens)`)
