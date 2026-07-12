'use client'

import { ConfigProvider } from 'antd'
import { themeConfig } from '@/lib/theme/theme-config'

/**
 * A dedicated Client Component so `theme={themeConfig}` never has to cross the Server-to-
 * Client serialization boundary — layout.tsx (a Server Component) only ever passes `children`
 * to this wrapper, never `themeConfig` itself as a prop. `themeConfig` may contain real
 * function references (`theme.darkAlgorithm`/`theme.compactAlgorithm` for dark/compact mode),
 * and passing an array of such functions as a prop straight from a Server Component crashes
 * Next's Turbopack build with "TypeError: c is not a function" — importing it directly here
 * instead sidesteps RSC serialization for it entirely.
 */
export function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
}
