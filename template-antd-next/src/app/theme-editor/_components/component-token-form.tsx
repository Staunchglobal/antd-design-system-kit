'use client'

import { ColorPicker, Input, InputNumber, Switch, Typography } from 'antd'
import { useThemeEditor } from '@/app/theme-editor/_lib/theme-editor-context'
import type { ThemeComponentTokenGroup, ComponentTokenValueType, TokenFieldValue } from '@/lib/theme/types'

const DEFAULT_FOR_TYPE: Record<ComponentTokenValueType, TokenFieldValue> = {
  'color-hex': '#1677ff',
  number: 0,
  boolean: false,
  string: '',
}

function renderControl(
  valueType: ComponentTokenValueType,
  value: TokenFieldValue,
  onChange: (value: TokenFieldValue) => void
) {
  switch (valueType) {
    case 'color-hex':
      return (
        <ColorPicker
          value={typeof value === 'string' && value ? value : undefined}
          onChangeComplete={(color) => onChange(color.toHexString())}
          showText
        />
      )
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
  const { componentValues, setComponentValue, clearComponentValue } = useThemeEditor()
  const overrides = componentValues[group.component] ?? {}

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {group.title}
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
        Overrides <Typography.Text code>theme.components.{group.component}</Typography.Text> — fields left off
        inherit antd&apos;s own computed default for the current global tokens.
      </Typography.Paragraph>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {group.fields.map((field, i) => {
          const isOverridden = Object.prototype.hasOwnProperty.call(overrides, field.name)
          const value = overrides[field.name]
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <Typography.Text strong>{field.label}</Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>
                    {field.name}
                  </Typography.Text>
                </div>
                <Switch
                  size="small"
                  checked={isOverridden}
                  onChange={(checked) =>
                    checked
                      ? setComponentValue(group.component, field.name, DEFAULT_FOR_TYPE[field.valueType])
                      : clearComponentValue(group.component, field.name)
                  }
                />
              </div>
              {field.description ? (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {field.description}
                </Typography.Text>
              ) : null}
              {isOverridden ? (
                renderControl(field.valueType, value as TokenFieldValue, (v) => setComponentValue(group.component, field.name, v))
              ) : (
                <Typography.Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>
                  Inherited
                </Typography.Text>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
