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
  {token,index}.d.ts`) to generate `component-token-schema.generated.ts` (55 components, 582
  fields) — no default value is recorded, since antd computes component tokens at render time
  from the current seed/alias tokens rather than shipping a static default the way seed tokens
  do. `/theme-editor` gains a searchable "Components" nav section; each field defaults to
  "Inherited" with a per-field override toggle, and overrides are saved into `theme-config.ts`'s
  real `components: {...}` block (validated against the schema in `sanitizeComponentOverrides`,
  same allowlist-lookup approach as global token overrides).
