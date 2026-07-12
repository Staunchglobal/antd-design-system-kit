'use client'

import * as React from 'react'
import * as Icons from './icon-reexports.generated'
import { iconReexportNames } from './icon-reexports.generated'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useIconMap } from './icon-context'
import type { IconKey } from './icon-map'

type IconsModule = Record<string, React.ComponentType<{ className?: string }>>

/** Every real @ant-design/icons component name (sorted), used to populate the theme editor's
 * icon picker. */
export const antIconNames: string[] = iconReexportNames

/** Indexed via `./icon-reexports.generated` (a plain-ESM re-export of every icon,
 * one binding at a time) rather than `import * as Icons from '@ant-design/icons'` directly —
 * namespace-importing the raw npm CJS package crashes Next's Turbopack SSR bundler with
 * "'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible". See
 * scripts/generate-icon-reexports.mjs for the full explanation. */
const iconsPlain = Icons as unknown as IconsModule

export function AppIcon({
  name,
  overrideMap,
  className,
}: {
  name: IconKey
  overrideMap?: Record<IconKey, string>
  className?: string
}) {
  const contextMap = useIconMap()
  const iconName = (overrideMap ?? contextMap)[name]
  const Icon = iconsPlain[iconName]
  if (!Icon) return <QuestionCircleOutlined className={className} title={`Unknown icon: ${iconName}`} />
  return <Icon className={className} />
}
