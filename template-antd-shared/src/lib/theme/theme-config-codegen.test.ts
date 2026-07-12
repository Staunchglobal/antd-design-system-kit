import { describe, expect, it } from 'vitest'
import { serializeThemeConfig } from './theme-config-codegen'

describe('serializeThemeConfig', () => {
  it('emits a default header comment when there is no existing source', () => {
    const out = serializeThemeConfig(null, {})
    expect(out).toContain('Source of truth for Ant Design theming')
    expect(out).toContain('export const themeConfig: ThemeConfig = {')
    expect(out).toContain('algorithm: undefined,')
    expect(out).toContain('cssVar: {},')
  })

  it('preserves a leading doc comment from existing source', () => {
    const existing = '/**\n * My own notes about this file.\n */\nexport const themeConfig = {}\n'
    const out = serializeThemeConfig(existing, {})
    expect(out).toContain('My own notes about this file.')
    expect(out).not.toContain('Source of truth for Ant Design theming')
  })

  it('serializes token overrides as an object literal with unquoted identifier keys', () => {
    const out = serializeThemeConfig(null, { colorPrimary: '#ff0000', fontSize: 16 })
    expect(out).toContain('colorPrimary: "#ff0000",')
    expect(out).toContain('fontSize: 16,')
  })

  it('quotes a token key that is not a valid identifier', () => {
    const out = serializeThemeConfig(null, { 'not-an-identifier': true })
    expect(out).toContain('"not-an-identifier": true,')
  })

  it('escapes a string value that attempts to break out of the literal', () => {
    const out = serializeThemeConfig(null, { fontFamily: "'; require('child_process').execSync('rm -rf /" })
    // JSON.stringify must fully escape the value — the raw apostrophes/parens must not appear unescaped
    expect(out).toContain(JSON.stringify("'; require('child_process').execSync('rm -rf /"))
  })

  it('emits no algorithm import or array when no algorithm is selected', () => {
    const out = serializeThemeConfig(null, {})
    expect(out).not.toContain("import { theme } from 'antd'")
    expect(out).toContain('algorithm: undefined,')
  })

  it('emits a single algorithm expression (not an array) for one choice', () => {
    const out = serializeThemeConfig(null, {}, ['dark'])
    expect(out).toContain("import { theme } from 'antd'")
    expect(out).toContain('algorithm: theme.darkAlgorithm,')
  })

  it('emits an array expression for multiple algorithm choices', () => {
    const out = serializeThemeConfig(null, {}, ['dark', 'compact'])
    expect(out).toContain('algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],')
  })

  it('produces valid-looking empty token block when there are no overrides', () => {
    const out = serializeThemeConfig(null, {})
    expect(out).toContain('token: {},')
  })

  it('emits an empty components block when there are no component overrides', () => {
    const out = serializeThemeConfig(null, {})
    expect(out).toContain('components: {},')
  })

  it('serializes component overrides nested under their component name', () => {
    const out = serializeThemeConfig(null, {}, [], { Button: { primaryColor: '#ff0000', borderRadius: 4 } })
    expect(out).toContain('components: {')
    expect(out).toContain('    Button: {')
    expect(out).toContain('primaryColor: "#ff0000",')
    expect(out).toContain('borderRadius: 4,')
  })

  it('omits a component whose overrides are all empty', () => {
    const out = serializeThemeConfig(null, {}, [], { Button: {} })
    expect(out).toContain('components: {},')
    expect(out).not.toContain('Button')
  })

  it('escapes a component override value that attempts to break out of the literal', () => {
    const payload = "'; require('child_process').execSync('rm -rf /"
    const out = serializeThemeConfig(null, {}, [], { Button: { primaryColor: payload } })
    expect(out).toContain(JSON.stringify(payload))
  })
})
