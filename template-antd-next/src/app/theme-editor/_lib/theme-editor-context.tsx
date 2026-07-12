'use client'

import * as React from 'react'
import { theme as antdTheme, type ThemeConfig } from 'antd'
import type { AlgorithmChoice, ThemeManifest, TokenFieldValue } from '@/lib/theme/types'
import type { IconKey } from '@/components/icons/icon-map'

type ComponentValues = Record<string, Record<string, TokenFieldValue>>

type ThemeEditorState = {
  manifest: ThemeManifest
  /** Current value for every schema field, keyed by token name — always fully populated
   * (inherited defaults included), so every field always has something to render. */
  values: Record<string, TokenFieldValue>
  /** Only the component token fields the user has actually overridden — absence of a
   * component/field key means "inherit antd's computed default" (see build-manifest.ts). */
  componentValues: ComponentValues
  iconMap: Record<IconKey, string>
  algorithm: AlgorithmChoice[]
  /** Real antd algorithm function(s) for the current selection — pass straight to the
   * live-preview ConfigProvider's `theme.algorithm` prop. */
  resolvedAlgorithm: ThemeConfig['algorithm']
  dirty: boolean
  saving: boolean
  setValue: (name: string, value: TokenFieldValue) => void
  setComponentValue: (component: string, field: string, value: TokenFieldValue) => void
  clearComponentValue: (component: string, field: string) => void
  setIcon: (key: IconKey, value: string) => void
  toggleAlgorithm: (choice: AlgorithmChoice) => void
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

function componentBaselineFromManifest(manifest: ThemeManifest): ComponentValues {
  const out: ComponentValues = {}
  for (const group of manifest.componentGroups) {
    const overridden = group.fields.filter((f) => f.isOverridden)
    if (overridden.length) out[group.component] = Object.fromEntries(overridden.map((f) => [f.name, f.value as TokenFieldValue]))
  }
  return out
}

function sameComponentValues(a: ComponentValues, b: ComponentValues): boolean {
  const componentNames = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const component of componentNames) {
    const fieldsA = a[component] ?? {}
    const fieldsB = b[component] ?? {}
    const fieldNames = new Set([...Object.keys(fieldsA), ...Object.keys(fieldsB)])
    for (const field of fieldNames) {
      if (fieldsA[field] !== fieldsB[field]) return false
    }
  }
  return true
}

const ALGORITHM_FN: Record<AlgorithmChoice, (typeof antdTheme)['darkAlgorithm']> = {
  dark: antdTheme.darkAlgorithm,
  compact: antdTheme.compactAlgorithm,
}

function resolveAlgorithm(choice: AlgorithmChoice[]): ThemeConfig['algorithm'] {
  const fns = choice.map((c) => ALGORITHM_FN[c])
  return fns.length ? fns : undefined
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
  const componentBaseline = React.useMemo(() => componentBaselineFromManifest(manifest), [manifest])
  const [values, setValues] = React.useState<Record<string, TokenFieldValue>>(baseline)
  const [componentValues, setComponentValues] = React.useState<ComponentValues>(componentBaseline)
  const [iconMap, setIconMapState] = React.useState<Record<IconKey, string>>(initialIconMap)
  const [algorithm, setAlgorithm] = React.useState<AlgorithmChoice[]>(manifest.algorithm)
  const [saving, setSaving] = React.useState(false)

  const dirty = React.useMemo(
    () =>
      Object.keys(baseline).some((name) => values[name] !== baseline[name]) ||
      !sameComponentValues(componentValues, componentBaseline) ||
      (Object.keys(iconMap) as IconKey[]).some((key) => iconMap[key] !== initialIconMap[key]) ||
      algorithm.length !== manifest.algorithm.length ||
      algorithm.some((c) => !manifest.algorithm.includes(c)),
    [baseline, values, componentValues, componentBaseline, iconMap, initialIconMap, algorithm, manifest.algorithm]
  )

  const setValue = React.useCallback((name: string, value: TokenFieldValue) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const setComponentValue = React.useCallback((component: string, field: string, value: TokenFieldValue) => {
    setComponentValues((prev) => ({ ...prev, [component]: { ...prev[component], [field]: value } }))
  }, [])

  const clearComponentValue = React.useCallback((component: string, field: string) => {
    setComponentValues((prev) => {
      if (!prev[component]) return prev
      const { [field]: _removed, ...rest } = prev[component]
      const next = { ...prev, [component]: rest }
      if (Object.keys(rest).length === 0) delete next[component]
      return next
    })
  }, [])

  const setIcon = React.useCallback((key: IconKey, value: string) => {
    setIconMapState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleAlgorithm = React.useCallback((choice: AlgorithmChoice) => {
    setAlgorithm((prev) => (prev.includes(choice) ? prev.filter((c) => c !== choice) : [...prev, choice]))
  }, [])

  const reset = React.useCallback(() => {
    setValues(baseline)
    setComponentValues(componentBaseline)
    setIconMapState(initialIconMap)
    setAlgorithm(manifest.algorithm)
  }, [baseline, componentBaseline, initialIconMap, manifest.algorithm])

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
        body: JSON.stringify({ token: overrides, components: componentValues, iconMap, algorithm }),
      })
      if (!res.ok) throw new Error(await res.text())
    } finally {
      setSaving(false)
    }
  }, [manifest, values, componentValues, iconMap, algorithm])

  const resolvedAlgorithm = React.useMemo(() => resolveAlgorithm(algorithm), [algorithm])

  const value = React.useMemo<ThemeEditorState>(
    () => ({
      manifest,
      values,
      componentValues,
      iconMap,
      algorithm,
      resolvedAlgorithm,
      dirty,
      saving,
      setValue,
      setComponentValue,
      clearComponentValue,
      setIcon,
      toggleAlgorithm,
      reset,
      save,
    }),
    [
      manifest,
      values,
      componentValues,
      iconMap,
      algorithm,
      resolvedAlgorithm,
      dirty,
      saving,
      setValue,
      setComponentValue,
      clearComponentValue,
      setIcon,
      toggleAlgorithm,
      reset,
      save,
    ]
  )

  return <ThemeEditorContext.Provider value={value}>{children}</ThemeEditorContext.Provider>
}

export function useThemeEditor(): ThemeEditorState {
  const ctx = React.useContext(ThemeEditorContext)
  if (!ctx) throw new Error('useThemeEditor must be used inside <ThemeEditorProvider>')
  return ctx
}
