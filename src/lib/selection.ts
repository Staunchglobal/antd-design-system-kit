import { COMPONENTS, GROUPS } from '../generated/registry.js'
import type { NavGroup } from '../generated/registry.js'

/**
 * Unlike the shadcn kit's resolveUiClosure (which walks a real uiDeps dependency graph
 * between vendored component source files), there is no dependency graph here at all —
 * every Ant Design component ships from the single `antd` package regardless of what the
 * user picks. `--components` selection only ever affects two things: which `_sections/*`
 * demo files get generated into `/design-system`, and (from Phase 2 on) which per-component
 * token groups appear in `/theme-editor`'s nav. It never changes what gets installed.
 */
export function allComponentSlugs(): string[] {
  return Object.keys(COMPONENTS)
}

/** Nav groups filtered down to only the items the user selected (in registry order). */
export function navGroupsFor(selected: Iterable<string>): NavGroup[] {
  const set = new Set(selected)
  return GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) => set.has(item.slug)),
  })).filter((g) => g.items.length > 0)
}

/** Every _sections/*.tsx demo file needed to render these nav groups. */
export function demoFilesFor(navGroups: NavGroup[]): string[] {
  const files = new Set<string>()
  for (const g of navGroups) {
    for (const item of g.items) files.add(item.demoFile)
  }
  return [...files]
}

/** Which per-component token-editor groups apply to a selection (Phase 2+; unused until then). */
export function tokenGroupIdsFor(selected: Iterable<string>): string[] {
  const ids = new Set<string>()
  for (const slug of selected) {
    const entry = COMPONENTS[slug]
    if (entry) for (const id of entry.tokenGroupIds) ids.add(id)
  }
  return [...ids]
}
