import { describe, expect, it } from 'vitest'
import { sanitizeAlgorithmChoice, sanitizeComponentOverrides, sanitizeIconMap, sanitizeTokenOverrides } from './validation'

describe('sanitizeAlgorithmChoice', () => {
  it('keeps known choices', () => {
    expect(sanitizeAlgorithmChoice(['dark', 'compact'])).toEqual(['dark', 'compact'])
  })

  it('drops unknown values and de-duplicates', () => {
    expect(sanitizeAlgorithmChoice(['dark', 'dark', 'default', 'nonsense'])).toEqual(['dark'])
  })

  it('returns [] for non-array input', () => {
    expect(sanitizeAlgorithmChoice(null)).toEqual([])
    expect(sanitizeAlgorithmChoice('dark')).toEqual([])
    expect(sanitizeAlgorithmChoice(undefined)).toEqual([])
  })
})

describe('sanitizeIconMap', () => {
  it('keeps known keys with valid icon names', () => {
    const out = sanitizeIconMap({ 'button.new': 'PlusOutlined', 'button.download': 'DownloadOutlined' })
    expect(out).toEqual({ 'button.new': 'PlusOutlined', 'button.download': 'DownloadOutlined' })
  })

  it('drops unknown icon keys', () => {
    const out = sanitizeIconMap({ 'button.new': 'PlusOutlined', 'evil.key': 'PlusOutlined' })
    expect(out).toEqual({ 'button.new': 'PlusOutlined' })
  })

  it('drops values that do not match the safe icon-name pattern', () => {
    const out = sanitizeIconMap({ 'button.new': 'plusOutlined' })
    expect(out).toEqual({})
  })

  it('rejects an injection attempt disguised as an icon name', () => {
    const out = sanitizeIconMap({ 'button.new': "PlusOutlined'); require('child_process').execSync('rm -rf /" })
    expect(out).toEqual({})
  })

  it('returns {} for non-object input', () => {
    expect(sanitizeIconMap(null)).toEqual({})
    expect(sanitizeIconMap('nope')).toEqual({})
  })
})

describe('sanitizeTokenOverrides', () => {
  it('keeps a known number token with a finite value', () => {
    expect(sanitizeTokenOverrides({ fontSize: 16 })).toEqual({ fontSize: 16 })
  })

  it('drops a number token given NaN/Infinity', () => {
    expect(sanitizeTokenOverrides({ fontSize: Number.NaN })).toEqual({})
    expect(sanitizeTokenOverrides({ fontSize: Number.POSITIVE_INFINITY })).toEqual({})
  })

  it('drops a number token given the wrong JS type', () => {
    expect(sanitizeTokenOverrides({ fontSize: '16' })).toEqual({})
  })

  it('keeps a known color-hex token as a string', () => {
    expect(sanitizeTokenOverrides({ colorPrimary: '#123456' })).toEqual({ colorPrimary: '#123456' })
  })

  it('keeps an enum token only when the value is a listed option', () => {
    expect(sanitizeTokenOverrides({ lineType: 'dashed' })).toEqual({ lineType: 'dashed' })
    expect(sanitizeTokenOverrides({ lineType: 'squiggly' })).toEqual({})
  })

  it('drops unknown token names entirely', () => {
    expect(sanitizeTokenOverrides({ notARealToken: 'x' })).toEqual({})
  })

  it('returns {} for non-object input', () => {
    expect(sanitizeTokenOverrides(null)).toEqual({})
    expect(sanitizeTokenOverrides(42)).toEqual({})
  })
})

describe('sanitizeComponentOverrides', () => {
  it('keeps a known component with valid field values', () => {
    const out = sanitizeComponentOverrides({ Button: { primaryColor: '#ff0000' } })
    expect(out).toEqual({ Button: { primaryColor: '#ff0000' } })
  })

  it('drops an unknown component name entirely', () => {
    expect(sanitizeComponentOverrides({ NotARealComponent: { x: 1 } })).toEqual({})
  })

  it('drops an unknown field name within a known component', () => {
    const out = sanitizeComponentOverrides({ Button: { notARealField: 1 } })
    expect(out).toEqual({})
  })

  it('drops a field whose value type does not match the schema', () => {
    const out = sanitizeComponentOverrides({ Affix: { zIndexPopup: 'not-a-number' } })
    expect(out).toEqual({})
  })

  it('omits a component entirely once all of its fields are dropped', () => {
    const out = sanitizeComponentOverrides({ Button: { notARealField: 1 }, Affix: { zIndexPopup: 999 } })
    expect(out).toEqual({ Affix: { zIndexPopup: 999 } })
  })

  it('returns {} for non-object input', () => {
    expect(sanitizeComponentOverrides(null)).toEqual({})
    expect(sanitizeComponentOverrides('nope')).toEqual({})
  })

  it('returns {} when a component value is not itself an object', () => {
    expect(sanitizeComponentOverrides({ Button: 'not-an-object' })).toEqual({})
  })
})
