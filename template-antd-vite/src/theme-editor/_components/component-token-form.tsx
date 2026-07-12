import { Input, InputNumber, Switch, Typography } from 'antd'
import { useThemeEditor } from '@/theme-editor/_lib/theme-editor-context'
import { ColorSelectField, useColorOptions } from './smart-field'
import type { ThemeComponentTokenGroup, ComponentTokenValueType, TokenFieldValue } from '@/lib/theme/types'

function renderControl(
  valueType: ComponentTokenValueType,
  value: TokenFieldValue,
  onChange: (value: TokenFieldValue) => void,
  colorOptions: ReturnType<typeof useColorOptions>
) {
  switch (valueType) {
    case 'color-hex':
      return <ColorSelectField value={typeof value === 'string' ? value : ''} onChange={onChange} colorOptions={colorOptions} />
    case 'number':
      return (
        <InputNumber value={typeof value === 'number' ? value : undefined} onChange={(v) => onChange(v ?? 0)} style={{ width: 160 }} />
      )
    case 'boolean':
      return <Switch checked={!!value} onChange={onChange} />
    case 'string':
    default:
      return (
        <Input
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ maxWidth: 320, fontFamily: 'monospace', fontSize: 12 }}
        />
      )
  }
}

export function ComponentTokenForm({ group }: { group: ThemeComponentTokenGroup }) {
  const { componentValues, setComponentValue } = useThemeEditor()
  const colorOptions = useColorOptions()
  const values = componentValues[group.component] ?? {}

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {group.title}
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
        Overrides <Typography.Text code>theme.components.{group.component}</Typography.Text> — starts from
        antd&apos;s own real computed default for the current global tokens.
      </Typography.Paragraph>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {group.fields.map((field, i) => {
          const value = values[field.name] ?? field.defaultValue
          return (
            <div
              key={field.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                paddingBlock: 12,
                borderTop: i === 0 ? undefined : '1px solid rgba(5, 5, 5, 0.06)',
              }}
            >
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
              {renderControl(field.valueType, value, (v) => setComponentValue(group.component, field.name, v), colorOptions)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
