import { buildThemeManifest } from '@/lib/theme/build-manifest'
import { themeConfig } from '@/lib/theme/theme-config'
import { iconMap } from '@/components/icons/icon-map'
import { ThemeEditorShell } from './_components/theme-editor-shell'

export default function ThemeEditorPage() {
  const manifest = buildThemeManifest(themeConfig)
  return <ThemeEditorShell manifest={manifest} initialIconMap={iconMap} />
}
