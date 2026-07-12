/**
 * Source of truth for Ant Design theming — passed straight to <ConfigProvider theme={...}>.
 * Safe to hand-edit. Save from /theme-editor fully regenerates this file from editor state
 * (preserving this leading comment) rather than surgically patching it — see the sibling
 * shadcn kit's tokens/fonts.css / icon-map.ts for the same accepted "wholesale rewrite on
 * save" tradeoff. `cssVar: {}` (Ant Design v6's CSS-variable mode takes an options object,
 * not a boolean) keeps real CSS custom properties available for tooling to read.
 */
import type { ThemeConfig } from 'antd'

export const themeConfig: ThemeConfig = {
  token: {},
  components: {},
  cssVar: {},
}
