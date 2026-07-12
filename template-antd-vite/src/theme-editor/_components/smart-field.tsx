import * as React from 'react'
import { ColorPicker, Input, InputNumber, Select, Switch, Typography } from 'antd'
import type { ThemeTokenField, TokenFieldValue } from '@/lib/theme/types'
import { googleFonts } from '@/lib/theme/google-fonts'
import { useThemeEditor } from '@/theme-editor/_lib/theme-editor-context'

const FALLBACK_STACK: Record<string, string> = {
  fontFamily: 'sans-serif',
  fontFamilyCode: 'monospace',
}

/** Pulls the first font name out of a CSS `font-family` value, e.g. `"Inter", sans-serif` -> `Inter`. */
function extractPrimaryFamily(value: string): string | null {
  const first = value.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '')
  return first || null
}

const PRESET_COLOR_NAMES = [
  'blue', 'purple', 'cyan', 'green', 'magenta', 'red', 'orange', 'yellow', 'volcano', 'geekblue', 'gold', 'lime',
]
const SEED_COLOR_NAMES = ['colorPrimary', 'colorSuccess', 'colorWarning', 'colorError', 'colorInfo', 'colorLink']

function labelForColorName(name: string): string {
  if (name.startsWith('color')) return name.slice('color'.length).replace(/([a-z])([A-Z])/g, '$1 $2')
  return name[0].toUpperCase() + name.slice(1)
}

export type ColorOption = { name: string; label: string; hex: string }

/**
 * Named color choices for the theme editor's color selects — antd's own preset palette plus
 * the theme's own semantic seed colors, labeled with their CURRENT live value (not a frozen
 * schema default), so picking one always copies in what that color actually looks like right
 * now. Shared between global seed-token color fields and per-component color fields.
 */
export function useColorOptions(): ColorOption[] {
  const { values } = useThemeEditor()
  return React.useMemo(() => {
    const names = [...SEED_COLOR_NAMES, ...PRESET_COLOR_NAMES]
    const options: ColorOption[] = []
    for (const name of names) {
      const hex = values[name]
      if (typeof hex === 'string' && hex) options.push({ name, label: labelForColorName(name), hex })
    }
    return options
  }, [values])
}

const CUSTOM_COLOR_VALUE = '__custom__'

/**
 * Every color field is a select of named colors (antd's preset palette + the theme's own
 * semantic seed colors) rather than a bare hex input — picking one copies that color's current
 * value in directly. `theme-config.ts` stores plain literal values, not CSS-variable
 * references, so there's no live link back to the source token the way a CSS `var()` would
 * give; "Custom…" drops into a full color picker for any value not matching a named option.
 */
export function ColorSelectField({
  value,
  onChange,
  colorOptions,
}: {
  value: string
  onChange: (value: string) => void
  colorOptions: ColorOption[]
}) {
  const matched = colorOptions.find((o) => o.hex.toLowerCase() === (value || '').toLowerCase())
  const selectValue = matched ? matched.name : CUSTOM_COLOR_VALUE

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      <Select
        showSearch
        value={selectValue}
        optionFilterProp="label"
        onChange={(next) => {
          if (next === CUSTOM_COLOR_VALUE) return
          const opt = colorOptions.find((o) => o.name === next)
          if (opt) onChange(opt.hex)
        }}
        options={[
          ...colorOptions.map((o) => ({
            value: o.name,
            label: `${o.label} (${o.hex})`,
          })),
          { value: CUSTOM_COLOR_VALUE, label: 'Custom…' },
        ]}
        optionRender={(option) =>
          option.value === CUSTOM_COLOR_VALUE ? (
            <span>Custom…</span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: colorOptions.find((o) => o.name === option.value)?.hex,
                  border: '1px solid rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              />
              <span>{option.label}</span>
            </span>
          )
        }
      />
      {selectValue === CUSTOM_COLOR_VALUE ? (
        <ColorPicker
          value={value || undefined}
          onChangeComplete={(color) => onChange(color.toHexString())}
          showText
          allowClear
        />
      ) : null}
    </div>
  )
}

export function SmartField({
  field,
  value,
  onChange,
}: {
  field: ThemeTokenField
  value: TokenFieldValue
  onChange: (value: TokenFieldValue) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBlock: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <Typography.Text strong>{field.label}</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>
          {field.name}
        </Typography.Text>
      </div>
      {field.description ? (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {field.description}
        </Typography.Text>
      ) : null}
      <div>{renderControl(field, value, onChange)}</div>
    </div>
  )
}

function renderControl(
  field: ThemeTokenField,
  value: string | number | boolean,
  onChange: (value: string | number | boolean) => void
) {
  switch (field.valueType) {
    case 'color-hex':
      return <ColorHexControl name={field.name} value={typeof value === 'string' ? value : ''} onChange={onChange} />
    case 'number':
      return (
        <InputNumber
          value={typeof value === 'number' ? value : undefined}
          onChange={(v) => onChange(v ?? 0)}
          style={{ width: 160 }}
        />
      )
    case 'boolean':
      return <Switch checked={!!value} onChange={onChange} />
    case 'enum':
      return (
        <Select
          value={typeof value === 'string' ? value : undefined}
          onChange={onChange}
          style={{ width: 200 }}
          options={(field.enumOptions ?? []).map((o) => ({ value: o, label: o }))}
        />
      )
    case 'font-family': {
      const stringValue = typeof value === 'string' ? value : ''
      const currentFamily = extractPrimaryFamily(stringValue)
      const fallback = FALLBACK_STACK[field.name] ?? 'sans-serif'
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 480 }}>
          <Select
            showSearch
            allowClear
            placeholder="Search Google Fonts…"
            value={currentFamily && googleFonts.some((f) => f.family === currentFamily) ? currentFamily : undefined}
            onChange={(family) => onChange(family ? `'${family}', ${fallback}` : '')}
            optionFilterProp="label"
            options={googleFonts.map((f) => ({ value: f.family, label: f.family }))}
          />
          <Input.TextArea
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 3 }}
            style={{ fontFamily: 'monospace', fontSize: 12 }}
            placeholder="Full CSS font-family value (auto-filled when you pick a font above)"
          />
        </div>
      )
    }
    case 'easing-string':
    default:
      return (
        <Input.TextArea
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          autoSize={{ minRows: 1, maxRows: 3 }}
          style={{ maxWidth: 480, fontFamily: 'monospace', fontSize: 12 }}
        />
      )
  }
}

/** A seed/preset color field IS itself one of the named options (e.g. editing "Success Color"
 * itself) — showing it as a select-of-itself would be circular, so seed/preset color fields
 * (identified by name) keep the direct color picker, while every OTHER color-hex field
 * (component fields) gets the named select. */
function ColorHexControl({
  name,
  value,
  onChange,
}: {
  name: string
  value: string
  onChange: (value: string) => void
}) {
  const colorOptions = useColorOptions()
  const isSeedOrPresetColor = SEED_COLOR_NAMES.includes(name) || PRESET_COLOR_NAMES.includes(name)
  if (isSeedOrPresetColor) {
    return <ColorPicker value={value || undefined} onChangeComplete={(color) => onChange(color.toHexString())} showText allowClear />
  }
  return <ColorSelectField value={value} onChange={onChange} colorOptions={colorOptions} />
}
