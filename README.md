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

**Phase 5 (this release):** an "Appearance" theme-editor group toggling antd's dark/compact
algorithms (composable, like antd's own `[darkAlgorithm, compactAlgorithm]` array), recovered
across reloads by identity-comparing `theme-config.ts`'s current `algorithm` value against the
real `theme.darkAlgorithm`/`theme.compactAlgorithm` function references.

**CLI completeness (this release):** `update` re-syncs already-installed files to the current
CLI's templates — writes anything missing, leaves anything already up to date, and only
overwrites a hand-edited file if `--force` is passed (tracked via a sha256 baseline hash
recorded at install/update time in `antd-design-kit.json`). `remove` drops one or more
components from `/design-system` (deletes their demo section, regenerates the nav/page,
updates `antd-design-kit.json`) — since components aren't vendored source here, there's no
dependency-closure or npm-uninstall concern the way the sibling shadcn kit's `remove` has.

**Phase 4 (this release):** per-component token editing — a searchable "Components" list in
`/theme-editor` (55 components, 582 fields, generated from each component's own shipped
`ComponentToken` interface via `scripts/extract-component-token-schema.mjs`) where every field
defaults to "Inherited" (antd computes it internally from the current global tokens; there's no
static default to show) with a per-field override toggle. Overrides live in `theme-config.ts`'s
real `components: {...}` block and flow into the live preview exactly like global tokens do.

**CDN distribution (this release):** templates are fetched live from
`github.com/Staunchglobal/antd-design-system-kit` via jsdelivr, pinned to the exact commit SHA
that was `HEAD` when the CLI was built (`src/lib/remote.ts`, injected by `tsup.config.ts` —
the build refuses to run from an unpushed commit). `DESIGN_KIT_LOCAL_TEMPLATES` is a
maintainer-only escape hatch for iterating on templates without a push-and-wait loop.

**Test suite (this release):** vitest coverage for the security/correctness-critical pieces —
`validation.ts` (`sanitizeTokenOverrides`/`sanitizeIconMap`/`sanitizeAlgorithmChoice`, including
an injection-attempt case), `theme-config-codegen.ts` (`serializeThemeConfig`'s comment
preservation and escaping), `build-manifest.ts` (schema/value merge, algorithm recovery by
function-identity), `google-fonts-link.ts`, and the CLI's own `selection.ts`/`selection-state.ts`
(including the sha256 file-hash tracking `update` relies on). Run with `npm run test`.

Not yet built: the element Inspector (Phase 9 of the original plan). See
`/home/imran/.claude/plans/squishy-prancing-swan.md` for the full phased build plan.

## Development

```bash
npm install
npm run build:registry      # scans template-antd-next/.../nav.ts + _sections/*.tsx
npm run build:token-schema  # regenerate token-schema.generated.ts after bumping the antd devDependency
npm run build:component-token-schema  # regenerate component-token-schema.generated.ts after bumping antd
npm run build               # tsup -> dist/cli.js (refuses to build from an unpushed HEAD)
npm run typecheck

# Test against real templates fetched from the pinned commit on GitHub:
node dist/cli.js init --cwd /path/to/your-app

# Iterate on template changes locally without pushing first:
DESIGN_KIT_LOCAL_TEMPLATES=$(pwd) node dist/cli.js init --cwd /path/to/your-app
```

## Usage

```bash
node dist/cli.js init --cwd /path/to/your-nextjs-or-vite-app
```

Flags: `--all` (include every component), `--components button,card,form` (explicit list),
`--yes` (skip prompts), `--skip-install`, `--dry-run`, `--pm <npm|pnpm|yarn|bun>`.

Visit `/design-system` for the component showcase and `/theme-editor` for live theme editing
(dev-only — the save endpoint 403s in a production build).

```bash
node dist/cli.js update --cwd /path/to/your-app          # sync in new CLI changes
node dist/cli.js update --cwd /path/to/your-app --force   # also overwrite customized files
node dist/cli.js update --cwd /path/to/your-app --dry-run # preview only

node dist/cli.js remove --cwd /path/to/your-app card,tag  # drop components from /design-system
```
