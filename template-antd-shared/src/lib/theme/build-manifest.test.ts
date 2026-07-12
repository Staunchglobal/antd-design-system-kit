import { theme } from 'antd'
import { describe, expect, it } from 'vitest'
import { buildThemeManifest } from './build-manifest'

describe('buildThemeManifest', () => {
  it('marks every field as not overridden when theme-config.ts has no token overrides', () => {
    const manifest = buildThemeManifest({ token: {} })
    const allFields = manifest.groups.flatMap((g) => g.fields)
    expect(allFields.length).toBeGreaterThan(0)
    expect(allFields.every((f) => !f.isOverridden)).toBe(true)
  })

  it('reports the schema default as the value for a non-overridden field', () => {
    const manifest = buildThemeManifest({ token: {} })
    const colorPrimary = manifest.groups.flatMap((g) => g.fields).find((f) => f.name === 'colorPrimary')
    expect(colorPrimary?.value).toBe('#1677ff')
  })

  it('marks a field overridden and uses the overridden value when present in theme-config.ts', () => {
    const manifest = buildThemeManifest({ token: { colorPrimary: '#00ff00' } })
    const colorPrimary = manifest.groups.flatMap((g) => g.fields).find((f) => f.name === 'colorPrimary')
    expect(colorPrimary?.isOverridden).toBe(true)
    expect(colorPrimary?.value).toBe('#00ff00')
  })

  it('groups fields by their schema group, deriving a kebab-case id from the title', () => {
    const manifest = buildThemeManifest({ token: {} })
    const colorsGroup = manifest.groups.find((g) => g.title === 'Colors')
    expect(colorsGroup?.id).toBe('colors')
  })

  it('recovers no algorithm choice when theme-config.ts has none set', () => {
    expect(buildThemeManifest({ token: {} }).algorithm).toEqual([])
  })

  it('recovers dark from a single real algorithm function reference', () => {
    expect(buildThemeManifest({ token: {}, algorithm: theme.darkAlgorithm }).algorithm).toEqual(['dark'])
  })

  it('recovers both dark and compact from a composed algorithm array', () => {
    expect(
      buildThemeManifest({ token: {}, algorithm: [theme.darkAlgorithm, theme.compactAlgorithm] }).algorithm
    ).toEqual(['dark', 'compact'])
  })

  it('does not mistake the default algorithm for dark or compact', () => {
    expect(buildThemeManifest({ token: {}, algorithm: theme.defaultAlgorithm }).algorithm).toEqual([])
  })
})

describe('buildThemeManifest componentGroups', () => {
  it('includes a group for every schema component, none overridden by default', () => {
    const manifest = buildThemeManifest({ token: {} })
    expect(manifest.componentGroups.length).toBeGreaterThan(0)
    const button = manifest.componentGroups.find((g) => g.component === 'Button')
    expect(button).toBeDefined()
    expect(button!.fields.every((f) => !f.isOverridden && f.value === undefined)).toBe(true)
  })

  it('marks a field overridden and surfaces its value when set in theme-config.ts', () => {
    const manifest = buildThemeManifest({ token: {}, components: { Button: { primaryColor: '#00ff00' } } })
    const button = manifest.componentGroups.find((g) => g.component === 'Button')!
    const primaryColor = button.fields.find((f) => f.name === 'primaryColor')
    expect(primaryColor?.isOverridden).toBe(true)
    expect(primaryColor?.value).toBe('#00ff00')
  })

  it('leaves other fields on the same component as not overridden', () => {
    const manifest = buildThemeManifest({ token: {}, components: { Button: { primaryColor: '#00ff00' } } })
    const button = manifest.componentGroups.find((g) => g.component === 'Button')!
    const defaultColor = button.fields.find((f) => f.name === 'defaultColor')
    expect(defaultColor?.isOverridden).toBe(false)
    expect(defaultColor?.value).toBeUndefined()
  })
})
