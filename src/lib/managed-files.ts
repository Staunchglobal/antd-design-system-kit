/**
 * Files installed regardless of component selection — shared between `init` (which copies
 * them) and `update` (which needs the exact same list to know what it's allowed to resync).
 * Far shorter than the shadcn kit's equivalent: there's no vendored component source, icon
 * system, or theme-editor chrome yet (those land in Phases 2-3). Nothing is truly
 * framework-agnostic yet either — showcase.tsx/sidebar-nav.tsx are hand-maintained
 * byte-identical copies per framework (same precedent as the shadcn kit's own nav/showcase
 * primitives), not a shared template root, since the design-system route itself lives under
 * a different path per framework (`app/design-system` vs `design-system`).
 */
export const ALWAYS_SHARED_FILES: string[] = []

export const ALWAYS_NEXT_FILES: string[] = [
  'app/design-system/_lib/showcase.tsx',
  'app/design-system/_components/sidebar-nav.tsx',
]

export const ALWAYS_VITE_FILES: string[] = [
  'design-system/_lib/showcase.tsx',
  'design-system/_components/sidebar-nav.tsx',
]
