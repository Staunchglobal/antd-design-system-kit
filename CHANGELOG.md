# Changelog

## 0.1.0

- Phase 1: `antd-design-kit init` scaffolds Ant Design v6 (`antd` + `@ant-design/icons`, plus
  `@ant-design/nextjs-registry` for Next) with `ConfigProvider`/`AntdRegistry` wiring and a
  generated `/design-system` showcase page — expanded to all 72 Ant Design v6.5.0 components.
- Phase 2: a live `/theme-editor` for global seed tokens, generated from antd's own shipped
  `SeedToken` interface (`scripts/extract-token-schema.mjs`), with a dev-only save endpoint
  that regenerates `src/lib/theme/theme-config.ts`.
- Phase 3: a searchable Google Fonts picker (patches `<link>` tags into layout.tsx/index.html
  on save) and a scoped app-level icon-remapping system, generated from
  `scripts/generate-icon-reexports.mjs` to work around a Turbopack SSR crash on namespace-
  importing `@ant-design/icons` directly.
- Phase 5: dark/compact mode toggles (antd's algorithm composition), via a new
  `AntdThemeProvider` Client Component wrapper — passing `themeConfig` (which can contain real
  algorithm function references) directly as a prop from the Server Component root layout
  crashes Next's Turbopack build.
- `antd-design-kit update`: re-syncs installed files to the current CLI's templates, tracked
  via a sha256 baseline hash per file (`antd-design-kit.json`) so a hand-edited file is never
  overwritten unless `--force` is passed.
- `antd-design-kit remove <slugs>`: drops components from `/design-system`, deleting their
  demo section and regenerating the nav/page.
- Phase 8: CDN-based template distribution via jsdelivr, pinned to the exact commit SHA the
  CLI was built from (`src/lib/remote.ts`); repo pushed to
  `github.com/Staunchglobal/antd-design-system-kit` (public).
- Test suite: vitest coverage for `validation.ts`, `theme-config-codegen.ts`,
  `build-manifest.ts`, `google-fonts-link.ts`, `selection.ts`, and `selection-state.ts`.
- Phase 4: per-component token editing. `scripts/extract-component-token-schema.mjs` walks each
  component's own shipped `ComponentToken` interface (`node_modules/antd/es/<dir>/style/
  {token,index}.d.ts`) to generate `component-token-schema.generated.ts` (55 components, 574
  fields). `/theme-editor` gains a searchable "Components" nav section; overrides are saved into
  `theme-config.ts`'s real `components: {...}` block (validated against the schema in
  `sanitizeComponentOverrides`, same allowlist-lookup approach as global token overrides).
- Fix: antd v6 deprecation warnings across the `/design-system` demo sections (Space
  direction/split, Steps direction/items.description, Divider/Splitter type/layout, Anchor's
  children-based API, Dropdown.Button, Input/InputNumber addonBefore/addonAfter, Alert message,
  Drawer width, Spin size="default", Statistic valueStyle/Countdown, Timeline items.children/
  dot) — a freshly scaffolded project's showcase now renders with a clean console.
- Rework: per-component token defaults, live preview, and color fields to match the sibling
  shadcn kit's UX. `extract-component-token-schema.mjs` now computes each field's REAL default
  by calling antd's own `prepareComponentToken`/`initComponentToken` function (via the CJS
  `antd/lib` build, since `antd/es`'s extensionless internal imports don't resolve under plain
  Node ESM) against `theme.getDesignToken()`'s live AliasToken — every field always shows a
  concrete value, no "inherited" toggle state. `live-preview.tsx` is now a per-project generated
  file (`generateLivePreview` in `src/lib/codegen.ts`, mirrors `generateNavTs`/
  `generateDesignSystemContent`'s pattern) that mounts the ACTUAL `/design-system` demo for
  whichever component is selected in the nav, falling back to a small fixed preview only for
  global-token-only groups; `theme-editor/page.tsx` (Next) / `ThemeEditorPage.tsx` (Vite) are
  also now generated, baking in the literal selected-component-slug list so
  `buildThemeManifest(themeConfig, { componentSlugs })` only builds nav/preview entries for
  components this project actually has a demo for. Every `color-hex` field (besides the global
  seed colors themselves) now renders as a select of named colors (antd's preset palette + the
  theme's own seed colors, labeled with their live current hex) instead of a bare color picker,
  with a "Custom…" option for anything else.
