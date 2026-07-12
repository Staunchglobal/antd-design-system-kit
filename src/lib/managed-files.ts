/**
 * Files installed regardless of component selection — shared between `init` (which copies
 * them) and `update` (which needs the exact same list to know what it's allowed to resync).
 * Far shorter than the shadcn kit's equivalent: there's no vendored component source. Both
 * `lib/theme/*` and `components/icons/*` are genuinely framework-agnostic (Phase 2/3) —
 * copied into both frameworks' `src/` at the same relative path. `design-system` files stay
 * hand-maintained per-framework copies (same precedent as the shadcn kit) since that route
 * lives under a different path per framework (`app/design-system` vs `design-system`);
 * `theme-editor`'s _lib/_components are ALSO per-framework copies for the same reason.
 */
export const ALWAYS_SHARED_FILES: string[] = [
  'lib/theme/types.ts',
  'lib/theme/token-schema.generated.ts',
  'lib/theme/component-token-schema.generated.ts',
  'lib/theme/build-manifest.ts',
  'lib/theme/validation.ts',
  'lib/theme/theme-config-codegen.ts',
  'lib/theme/google-fonts.ts',
  'lib/theme/google-fonts-link.ts',
  'components/icons/icon-map.ts',
  'components/icons/icon-map-codegen.ts',
  'components/icons/icon-context.tsx',
  'components/icons/icon-reexports.generated.ts',
  'components/icons/icon.tsx',
]

export const ALWAYS_NEXT_FILES: string[] = [
  'app/theme-provider.tsx',
  'app/design-system/_lib/showcase.tsx',
  'app/design-system/_components/sidebar-nav.tsx',
  'app/theme-editor/page.tsx',
  'app/theme-editor/_lib/theme-editor-context.tsx',
  'app/theme-editor/_components/theme-editor-shell.tsx',
  'app/theme-editor/_components/theme-nav.tsx',
  'app/theme-editor/_components/variable-form.tsx',
  'app/theme-editor/_components/smart-field.tsx',
  'app/theme-editor/_components/icons-form.tsx',
  'app/theme-editor/_components/appearance-form.tsx',
  'app/theme-editor/_components/component-token-form.tsx',
  'app/theme-editor/_components/live-preview.tsx',
  'app/api/theme/save/route.ts',
]

export const ALWAYS_VITE_FILES: string[] = [
  'design-system/_lib/showcase.tsx',
  'design-system/_components/sidebar-nav.tsx',
  'theme-editor/ThemeEditorPage.tsx',
  'theme-editor/_lib/theme-editor-context.tsx',
  'theme-editor/_components/theme-editor-shell.tsx',
  'theme-editor/_components/theme-nav.tsx',
  'theme-editor/_components/variable-form.tsx',
  'theme-editor/_components/smart-field.tsx',
  'theme-editor/_components/icons-form.tsx',
  'theme-editor/_components/appearance-form.tsx',
  'theme-editor/_components/component-token-form.tsx',
  'theme-editor/_components/live-preview.tsx',
]
