import * as React from 'react'
import type { ThemeManifest, TokenFieldValue } from '@/lib/theme/types'
import type { IconKey } from '@/components/icons/icon-map'

type ThemeEditorState = {
  manifest: ThemeManifest
  /** Current value for every schema field, keyed by token name — always fully populated
   * (inherited defaults included), so every field always has something to render. */
  values: Record<string, TokenFieldValue>
  iconMap: Record<IconKey, string>
  dirty: boolean
  saving: boolean
  setValue: (name: string, value: TokenFieldValue) => void
  setIcon: (key: IconKey, value: string) => void
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
  initialIconMap,
  children,
}: {
  manifest: ThemeManifest
  initialIconMap: Record<IconKey, string>
  children: React.ReactNode
}) {
  const baseline = React.useMemo(() => defaultsFromManifest(manifest), [manifest])
  const [values, setValues] = React.useState<Record<string, TokenFieldValue>>(baseline)
  const [iconMap, setIconMapState] = React.useState<Record<IconKey, string>>(initialIconMap)
  const [saving, setSaving] = React.useState(false)

  const dirty = React.useMemo(
    () =>
      Object.keys(baseline).some((name) => values[name] !== baseline[name]) ||
      (Object.keys(iconMap) as IconKey[]).some((key) => iconMap[key] !== initialIconMap[key]),
    [baseline, values, iconMap, initialIconMap]
  )

  const setValue = React.useCallback((name: string, value: TokenFieldValue) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const setIcon = React.useCallback((key: IconKey, value: string) => {
    setIconMapState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const reset = React.useCallback(() => {
    setValues(baseline)
    setIconMapState(initialIconMap)
  }, [baseline, initialIconMap])

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
        body: JSON.stringify({ token: overrides, iconMap }),
      })
      if (!res.ok) throw new Error(await res.text())
    } finally {
      setSaving(false)
    }
  }, [manifest, values, iconMap])

  const value = React.useMemo<ThemeEditorState>(
    () => ({ manifest, values, iconMap, dirty, saving, setValue, setIcon, reset, save }),
    [manifest, values, iconMap, dirty, saving, setValue, setIcon, reset, save]
  )

  return <ThemeEditorContext.Provider value={value}>{children}</ThemeEditorContext.Provider>
}

export function useThemeEditor(): ThemeEditorState {
  const ctx = React.useContext(ThemeEditorContext)
  if (!ctx) throw new Error('useThemeEditor must be used inside <ThemeEditorProvider>')
  return ctx
}
