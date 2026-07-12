import { describe, expect, it } from 'vitest'
import { buildGoogleFontsHref, resolveWeights } from './google-fonts-link'

describe('resolveWeights', () => {
  it('intersects with the common default weights when available', () => {
    expect(resolveWeights([100, 300, 400, 500, 600, 700, 900])).toEqual([400, 500, 600, 700])
  })

  it('falls back to the first available weight when none of the defaults are available', () => {
    expect(resolveWeights([100, 200, 300])).toEqual([100])
  })

  it('returns only the defaults actually present when partially available', () => {
    expect(resolveWeights([400, 900])).toEqual([400])
  })
})

describe('buildGoogleFontsHref', () => {
  it('builds a single-family href with weights joined by semicolons', () => {
    const href = buildGoogleFontsHref([{ family: 'Roboto', weights: [400, 700] }])
    expect(href).toBe('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap')
  })

  it('joins multiple families with &', () => {
    const href = buildGoogleFontsHref([
      { family: 'Roboto', weights: [400] },
      { family: 'Fira Code', weights: [500] },
    ])
    expect(href).toBe(
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400&family=Fira+Code:wght@500&display=swap'
    )
  })

  it('encodes spaces in a family name as +', () => {
    const href = buildGoogleFontsHref([{ family: 'Noto Sans JP', weights: [400] }])
    expect(href).toContain('family=Noto+Sans+JP:wght@400')
  })
})
