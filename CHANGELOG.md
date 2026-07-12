# Changelog

## 0.1.0

- Phase 1: `antd-design-kit init` scaffolds Ant Design v6 (`antd` + `@ant-design/icons`, plus
  `@ant-design/nextjs-registry` for Next) with `ConfigProvider`/`AntdRegistry` wiring and a
  generated `/design-system` showcase page — expanded to all 72 Ant Design v6.5.0 components.
- Phase 2: a live `/theme-editor` for global seed tokens, generated from antd's own shipped
  `SeedToken` interface (`scripts/extract-token-schema.mjs`), with a dev-only save endpoint
  that regenerates `src/lib/theme/theme-config.ts`.
