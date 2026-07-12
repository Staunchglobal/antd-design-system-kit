/**
 * Zero-import leaf module (deliberately no relative imports of its own — see Phase 2's
 * tsconfig.node.json lesson in vite-plugin-design-kit.ts) so it's safe to import directly
 * from that Vite dev-middleware plugin as well as from the Next API route.
 */
export type GoogleFontRequest = { family: string; weights: number[] }

const DEFAULT_WEIGHTS = [400, 500, 600, 700]

/** Weights actually requested for a font: the common defaults, narrowed to what the font
 * really ships, falling back to whatever it does ship if none of the defaults are available. */
export function resolveWeights(availableWeights: number[]): number[] {
  const intersected = DEFAULT_WEIGHTS.filter((w) => availableWeights.includes(w))
  return intersected.length ? intersected : availableWeights.slice(0, 1)
}

export function buildGoogleFontsHref(fonts: GoogleFontRequest[]): string {
  const params = fonts
    .map((f) => `family=${encodeURIComponent(f.family).replace(/%20/g, '+')}:wght@${f.weights.join(';')}`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}
