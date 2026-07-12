import type { ThemeConfig } from 'antd'

/**
 * Source of truth for Ant Design theming — passed straight to <ConfigProvider theme={...}>.
 * Safe to hand-edit. Once /theme-editor exists (Phase 2+), Save fully regenerates this file
 * from editor state (preserving this leading comment) rather than surgically patching it —
 * see the sibling shadcn kit's tokens/fonts.css / icon-map.ts for the same accepted
 * "wholesale rewrite on save" tradeoff. `cssVar: {}` (Ant Design v6's CSS-variable mode
 * takes an options object, not a boolean) keeps real CSS custom properties available for
 * tooling (e.g. a future element inspector) to read via getComputedStyle.
 */
export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
  },
  components: {},
  cssVar: {},
}
