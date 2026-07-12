import { Button, Space, Typography, message } from 'antd'
import { useThemeEditor } from '@/theme-editor/_lib/theme-editor-context'

function NavButton({
  active,
  label,
  badge,
  onClick,
}: {
  active: boolean
  label: string
  badge?: number
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
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
        <span>{label}</span>
        {badge ? (
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            {badge}
          </Typography.Text>
        ) : null}
      </button>
    </li>
  )
}

export function ThemeNav({
  activeGroupId,
  onSelectGroup,
}: {
  activeGroupId: string
  onSelectGroup: (id: string) => void
}) {
  const { manifest, algorithm, dirty, saving, save, reset } = useThemeEditor()

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
          <NavButton
            active={activeGroupId === 'appearance'}
            label="Appearance"
            badge={algorithm.length || undefined}
            onClick={() => onSelectGroup('appearance')}
          />
          {manifest.groups.map((group) => (
            <NavButton
              key={group.id}
              active={group.id === activeGroupId}
              label={group.title}
              badge={group.fields.filter((f) => f.isOverridden).length || undefined}
              onClick={() => onSelectGroup(group.id)}
            />
          ))}
          <NavButton
            active={activeGroupId === 'icons'}
            label="Icons"
            onClick={() => onSelectGroup('icons')}
          />
        </ul>
      </nav>
    </div>
  )
}
