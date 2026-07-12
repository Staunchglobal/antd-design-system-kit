import { Typography } from 'antd'
import { useThemeEditor } from '@/theme-editor/_lib/theme-editor-context'
import { SmartField } from './smart-field'

export function VariableForm({ activeGroupId }: { activeGroupId: string }) {
  const { manifest, values, setValue } = useThemeEditor()
  const group = manifest.groups.find((g) => g.id === activeGroupId)

  if (!group) {
    return <Typography.Text type="secondary">Select a group from the left.</Typography.Text>
  }

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {group.title}
      </Typography.Title>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {group.fields.map((field, i) => (
          <div key={field.name} style={{ borderTop: i === 0 ? undefined : '1px solid rgba(5, 5, 5, 0.06)' }}>
            <SmartField field={field} value={values[field.name]} onChange={(v) => setValue(field.name, v)} />
          </div>
        ))}
      </div>
    </div>
  )
}
