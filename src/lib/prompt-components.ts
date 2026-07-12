import prompts from 'prompts'
import { GROUPS, COMPONENTS } from '../generated/registry.js'
import { log } from './log.js'

export type ComponentPickOptions = {
  yes: boolean
  all?: boolean
  components?: string
}

/**
 * Resolves which component slugs the user wants shown in /design-system (and, from Phase 2
 * on, editable in /theme-editor). No dependency closure to resolve — unlike the shadcn kit,
 * picking one component never needs to pull another one in.
 */
export async function pickComponents(prior: string[], options: ComponentPickOptions): Promise<string[]> {
  const known = new Set(Object.keys(COMPONENTS))

  if (options.components) {
    const requested = options.components
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const invalid = requested.filter((s) => !known.has(s))
    if (invalid.length) {
      log.warn(`Unknown component slug(s), ignoring: ${invalid.join(', ')}`)
    }
    return requested.filter((s) => known.has(s))
  }

  if (options.all || options.yes) {
    return [...known]
  }

  const priorSet = new Set(prior)
  const choices = GROUPS.flatMap((g) =>
    g.items.map((item) => ({
      title: `${g.title} › ${item.label}`,
      value: item.slug,
      selected: priorSet.has(item.slug),
    }))
  )

  log.info('Type to search/filter, Space to toggle, Return to confirm.')
  const res = await prompts({
    type: 'autocompleteMultiselect',
    name: 'components',
    message: 'Which Ant Design components do you want in /design-system?',
    choices,
    hint: '- Space to select, Return to submit, type to filter',
    instructions: false,
    limit: 15,
  })

  return Array.isArray(res.components) ? res.components : []
}
