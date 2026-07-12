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
