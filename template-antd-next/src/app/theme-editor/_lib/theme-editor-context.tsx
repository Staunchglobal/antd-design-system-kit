'use client'

import * as React from 'react'
import type { ThemeManifest, TokenFieldValue } from '@/lib/theme/types'

type ThemeEditorState = {
  manifest: ThemeManifest
  /** Current value for every schema field, keyed by token name — always fully populated
   * (inherited defaults included), so every field always has something to render. */
  values: Record<string, TokenFieldValue>
  dirty: boolean
  saving: boolean
  setValue: (name: string, value: TokenFieldValue) => void
  reset: () => void
  save: () => Promise<void>
}

const ThemeEditorContext = React.createContext<ThemeEditorState | null>(null)

function defaultsFromManifest(manifest: ThemeManifest): Record<string, TokenFieldValue> {
  const out: Record<string, TokenFieldValue> = {}
  for (const group of manifest.groups) {
    for (const field of group.fields) out[field.name] = field.value
  }
  return out
}

export function ThemeEditorProvider({
  manifest,
  children,
}: {
  manifest: ThemeManifest
  children: React.ReactNode
}) {
  const baseline = React.useMemo(() => defaultsFromManifest(manifest), [manifest])
  const [values, setValues] = React.useState<Record<string, TokenFieldValue>>(baseline)
  const [saving, setSaving] = React.useState(false)

  const dirty = React.useMemo(
    () => Object.keys(baseline).some((name) => values[name] !== baseline[name]),
    [baseline, values]
  )

  const setValue = React.useCallback((name: string, value: TokenFieldValue) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const reset = React.useCallback(() => setValues(baseline), [baseline])

  const save = React.useCallback(async () => {
    // Only send fields that actually differ from antd's own seed default — keeps
    // theme-config.ts minimal, matching antd's own idiomatic "only override what you need".
    const overrides: Record<string, TokenFieldValue> = {}
    for (const group of manifest.groups) {
      for (const field of group.fields) {
        if (values[field.name] !== field.defaultValue) overrides[field.name] = values[field.name]
      }
    }
    setSaving(true)
    try {
      const res = await fetch('/api/theme/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: overrides }),
      })
      if (!res.ok) throw new Error(await res.text())
    } finally {
      setSaving(false)
    }
  }, [manifest, values])

  const value = React.useMemo<ThemeEditorState>(
    () => ({ manifest, values, dirty, saving, setValue, reset, save }),
    [manifest, values, dirty, saving, setValue, reset, save]
  )

  return <ThemeEditorContext.Provider value={value}>{children}</ThemeEditorContext.Provider>
}

export function useThemeEditor(): ThemeEditorState {
  const ctx = React.useContext(ThemeEditorContext)
  if (!ctx) throw new Error('useThemeEditor must be used inside <ThemeEditorProvider>')
  return ctx
}
