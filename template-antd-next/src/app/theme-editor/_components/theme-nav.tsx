'use client'

import { Button, Space, Typography, message } from 'antd'
import { useThemeEditor } from '@/app/theme-editor/_lib/theme-editor-context'

export function ThemeNav({
  activeGroupId,
  onSelectGroup,
}: {
  activeGroupId: string
  onSelectGroup: (id: string) => void
}) {
  const { manifest, dirty, saving, save, reset } = useThemeEditor()

  const onSave = async () => {
    try {
      await save()
      message.success('Theme saved to src/lib/theme/theme-config.ts')
    } catch {
      message.error('Save failed — see the console for details.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Space>
        <Button type="primary" onClick={onSave} loading={saving} disabled={!dirty}>
          Save
        </Button>
        <Button onClick={reset} disabled={!dirty}>
          Reset
        </Button>
      </Space>
      <nav>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {manifest.groups.map((group) => {
            const active = group.id === activeGroupId
            const overriddenCount = group.fields.filter((f) => f.isOverridden).length
            return (
              <li key={group.id}>
                <button
                  type="button"
                  onClick={() => onSelectGroup(group.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 6,
                    padding: '6px 10px',
                    background: active ? 'rgba(22, 119, 255, 0.1)' : 'transparent',
                    color: active ? '#1677ff' : 'inherit',
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  <span>{group.title}</span>
                  {overriddenCount > 0 ? (
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                      {overriddenCount}
                    </Typography.Text>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
