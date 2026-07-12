# staunch-antd-design-system-kit

CLI that scaffolds Ant Design v6, a design-token theme system, a `/design-system` showcase
page, and a live `/theme-editor` into a Next.js (App Router) or Vite + React + TypeScript
project. Sibling project to
[`staunch-shadcn-design-system-kit`](https://github.com/Staunchglobal/design-system-kit), built
for teams who want Ant Design instead of shadcn/ui.

Unlike the shadcn kit, no component source is vendored into your project — Ant Design ships
as a real npm dependency (`antd` + `@ant-design/icons`), so `init` only needs to install
dependencies, wire `ConfigProvider`, and generate the showcase + theme editor pages.

## Status

**Phase 1:** `init` installs Ant Design, wires SSR (`@ant-design/nextjs-registry` for Next),
and generates `/design-system` covering all 72 Ant Design v6.5.0 components.

**Phase 2:** a live `/theme-editor` for global (seed) design tokens —
color/typography/layout/motion — with a live preview, Save/Reset, and a dev-only save
endpoint (`app/api/theme/save/route.ts` for Next, `vite-plugin-design-kit.ts` middleware for
Vite) that regenerates `src/lib/theme/theme-config.ts`. The token catalog
(`token-schema.generated.ts`) is generated from antd's own shipped `SeedToken` interface +
real default values via `scripts/extract-token-schema.mjs` — not hand-authored.

**Phase 3 (this release):** a searchable Google Fonts picker for `fontFamily`/`fontFamilyCode`
(`google-fonts.ts`, ported from the sibling kit) that patches `<link>` tags into
`layout.tsx`/`index.html` on save, and a small app-level icon-remapping system
(`components/icons/*` — `AppIcon`, an "Icons" theme-editor group) scoped to the couple of
illustrative icons this kit's own generated code uses (antd's *own* internal component icons
aren't vendored source and can't be swapped). Icon lookups go through a generated re-export
file (`icon-reexports.generated.ts`, `scripts/generate-icon-reexports.mjs`), not a namespace
import of `@ant-design/icons` directly — that crashes Next's Turbopack SSR bundler with
`'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible`.

Not yet built: per-component token editing, dark/compact mode, `update`/`remove` commands, a
test suite, and CDN-based distribution (still purely local — this repo isn't pushed to GitHub
yet). See `/home/imran/.claude/plans/squishy-prancing-swan.md` for the full phased build plan.

## Development

```bash
npm install
npm run build:registry      # scans template-antd-next/.../nav.ts + _sections/*.tsx
npm run build:token-schema  # regenerate token-schema.generated.ts after bumping the antd devDependency
npm run build               # tsup -> dist/cli.js
npm run typecheck

# Test against a real scaffolded app (reads templates from local disk, no CDN yet):
node dist/cli.js init --cwd /path/to/your-app
```

## Usage

```bash
node dist/cli.js init --cwd /path/to/your-nextjs-or-vite-app
```

Flags: `--all` (include every component), `--components button,card,form` (explicit list),
`--yes` (skip prompts), `--skip-install`, `--dry-run`, `--pm <npm|pnpm|yarn|bun>`.

Visit `/design-system` for the component showcase and `/theme-editor` for live theme editing
(dev-only — the save endpoint 403s in a production build).
