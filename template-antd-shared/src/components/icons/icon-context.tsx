'use client'

import * as React from 'react'
import { iconMap as defaultIconMap, type IconKey } from './icon-map'

const IconMapContext = React.createContext<Record<IconKey, string>>(defaultIconMap)

export function IconMapProvider({
  value,
  children,
}: {
  value: Record<IconKey, string>
  children: React.ReactNode
}) {
  return <IconMapContext.Provider value={value}>{children}</IconMapContext.Provider>
}

export function useIconMap(): Record<IconKey, string> {
  return React.useContext(IconMapContext)
}
