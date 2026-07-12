import { describe, expect, it } from 'vitest'
import { allComponentSlugs, demoFilesFor, navGroupsFor, tokenGroupIdsFor } from './selection'
import { COMPONENTS } from '../generated/registry.js'

describe('allComponentSlugs', () => {
  it('returns every registered component slug', () => {
    const slugs = allComponentSlugs()
    expect(slugs.length).toBe(Object.keys(COMPONENTS).length)
    expect(slugs).toContain('button')
  })
})

describe('navGroupsFor', () => {
  it('filters nav groups down to only the selected slugs', () => {
    const groups = navGroupsFor(['button'])
    const allItems = groups.flatMap((g) => g.items)
    expect(allItems).toHaveLength(1)
    expect(allItems[0].slug).toBe('button')
  })

  it('drops groups that end up with zero items', () => {
    const groups = navGroupsFor(['button'])
    expect(groups.every((g) => g.items.length > 0)).toBe(true)
  })

  it('returns no groups for an empty selection', () => {
    expect(navGroupsFor([])).toEqual([])
  })

  it('ignores slugs that are not real components', () => {
    const groups = navGroupsFor(['button', 'not-a-real-component'])
    const allSlugs = groups.flatMap((g) => g.items.map((i) => i.slug))
    expect(allSlugs).toEqual(['button'])
  })
})

describe('demoFilesFor', () => {
  it('collects every demo file referenced by the given nav groups', () => {
    const groups = navGroupsFor(['button', 'divider'])
    const files = demoFilesFor(groups)
    expect(files).toContain('button.tsx')
    expect(files).toContain('divider.tsx')
  })

  it('de-duplicates demo files shared by multiple nav items', () => {
    const groups = navGroupsFor(allComponentSlugs())
    const files = demoFilesFor(groups)
    expect(new Set(files).size).toBe(files.length)
  })
})

describe('tokenGroupIdsFor', () => {
  it('returns [] when selected components have no token groups', () => {
    expect(tokenGroupIdsFor(['button'])).toEqual([])
  })

  it('ignores slugs that are not real components', () => {
    expect(tokenGroupIdsFor(['not-a-real-component'])).toEqual([])
  })
})
