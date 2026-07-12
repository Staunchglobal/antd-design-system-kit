import { ColorPicker, Input, InputNumber, Select, Switch, Typography } from 'antd'
import type { ThemeTokenField } from '@/lib/theme/types'
import { googleFonts } from '@/lib/theme/google-fonts'

const FALLBACK_STACK: Record<string, string> = {
  fontFamily: 'sans-serif',
  fontFamilyCode: 'monospace',
}

/** Pulls the first font name out of a CSS `font-family` value, e.g. `"Inter", sans-serif` -> `Inter`. */
function extractPrimaryFamily(value: string): string | null {
  const first = value.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '')
  return first || null
}

export function SmartField({
  field,
  value,
  onChange,
}: {
  field: ThemeTokenField
  value: string | number | boolean
  onChange: (value: string | number | boolean) => void
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
      return (
        <ColorPicker
          value={typeof value === 'string' && value ? value : undefined}
          onChangeComplete={(color) => onChange(color.toHexString())}
          showText
          allowClear
        />
      )
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
