/**
 * Regenerates icon-map.ts verbatim as literal source — same "rewrite whole file on save"
 * tradeoff as theme-config.ts (see theme-config-codegen.ts). Pure/zero-import, like that
 * file, so it's safe under both the app's bundler-mode resolution and (if ever imported
 * directly) Vite's stricter tsconfig.node.json.
 */
export function serializeIconMap(iconMap: Record<string, string>): string {
  const entries = Object.entries(iconMap)
    .map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`)
    .join('\n')

  const keyUnion = Object.keys(iconMap)
    .map((k) => JSON.stringify(k))
    .join(' | ')
  const keysArray = Object.keys(iconMap)
    .map((k) => JSON.stringify(k))
    .join(', ')

  return `/**
 * Semantic icon keys -> @ant-design/icons export names. Narrower in scope than the sibling
 * shadcn kit's icon system: antd ships as a real npm package, so its OWN internal component
 * icons (Checkbox's check mark, Switch's handle, etc.) aren't vendored source and can't be
 * swapped here. This registry only covers icon choices OUR generated app-level code makes.
 * Rewritten verbatim by the theme editor's Save — same "regenerate as literal source"
 * tradeoff as theme-config.ts.
 */
export type IconKey = ${keyUnion || 'never'}

export const ICON_KEYS: IconKey[] = [${keysArray}]

export const defaultIconMap: Record<IconKey, string> = {
${entries}
}

export let iconMap: Record<IconKey, string> = { ...defaultIconMap }

export function setIconMap(next: Record<IconKey, string>): void {
  iconMap = next
}
`
}
