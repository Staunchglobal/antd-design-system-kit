# staunch-antd-design-system-kit

CLI that scaffolds Ant Design v6, a design-token theme system, a `/design-system` showcase
page, and (soon) a live `/theme-editor` into a Next.js (App Router) or Vite + React +
TypeScript project. Sibling project to
[`staunch-shadcn-design-system-kit`](https://github.com/Staunchglobal/design-system-kit), built
for teams who want Ant Design instead of shadcn/ui.

Unlike the shadcn kit, no component source is vendored into your project — Ant Design ships
as a real npm dependency (`antd` + `@ant-design/icons`), so `init` only needs to install
dependencies, wire `ConfigProvider`, and generate the showcase page.

## Status

**Phase 1 (this release):** `init` installs Ant Design, wires SSR (`@ant-design/nextjs-registry`
for Next), and generates `/design-system` covering an initial ~20-component MVP set. There is
no `/theme-editor` yet — `src/lib/theme/theme-config.ts` is hand-edited for now.

See `/home/imran/.claude/plans/squishy-prancing-swan.md` for the full phased build plan.

## Development

```bash
npm install
npm run build:registry   # scans template-antd-next/.../nav.ts + _sections/*.tsx
npm run build            # tsup -> dist/cli.js
npm run typecheck

# Test against a real scaffolded app (reads templates from local disk, no CDN yet):
node dist/cli.js init --cwd /path/to/your-app
```

## Usage

```bash
node dist/cli.js init --cwd /path/to/your-nextjs-or-vite-app
```

Flags: `--all` (include every MVP component), `--components button,card,form` (explicit list),
`--yes` (skip prompts), `--skip-install`, `--dry-run`, `--pm <npm|pnpm|yarn|bun>`.
