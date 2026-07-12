/**
 * Semantic icon keys -> @ant-design/icons export names. Narrower in scope than the sibling
 * shadcn kit's icon system: antd ships as a real npm package, so its OWN internal component
 * icons (Checkbox's check mark, Switch's handle, etc.) aren't vendored source and can't be
 * swapped here. This registry only covers icon choices OUR generated app-level code makes —
 * currently just the two illustrative icons in the Button showcase demo. Rewritten verbatim
 * by the theme editor's Save (see api/theme/save/route.ts's writeIconMap) — same "regenerate
 * as literal source" tradeoff as theme-config.ts.
 */
export type IconKey = 'button.new' | 'button.download'

export const ICON_KEYS: IconKey[] = ['button.new', 'button.download']

export const defaultIconMap: Record<IconKey, string> = {
  'button.new': 'PlusOutlined',
  'button.download': 'DownloadOutlined',
}

export let iconMap: Record<IconKey, string> = { ...defaultIconMap }

export function setIconMap(next: Record<IconKey, string>): void {
  iconMap = next
}
