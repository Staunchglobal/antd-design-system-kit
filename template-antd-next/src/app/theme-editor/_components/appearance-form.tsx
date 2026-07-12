'use client'

import { Switch, Typography } from 'antd'
import { useThemeEditor } from '@/app/theme-editor/_lib/theme-editor-context'
import type { AlgorithmChoice } from '@/lib/theme/types'

const ROWS: { key: AlgorithmChoice; label: string; description: string }[] = [
  {
    key: 'dark',
    label: 'Dark mode',
    description: 'Applies antd’s theme.darkAlgorithm — derives a dark palette from your seed tokens.',
  },
  {
    key: 'compact',
    label: 'Compact mode',
    description: 'Applies antd’s theme.compactAlgorithm — tighter control heights and spacing.',
  },
]

export function AppearanceForm() {
  const { algorithm, toggleAlgorithm } = useThemeEditor()

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Appearance
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
        Composable, like antd&apos;s own <Typography.Text code>[darkAlgorithm, compactAlgorithm]</Typography.Text>{' '}
        array — toggle either or both.
      </Typography.Paragraph>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {ROWS.map((row, i) => (
          <div
            key={row.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              paddingBlock: 12,
              borderTop: i === 0 ? undefined : '1px solid rgba(5, 5, 5, 0.06)',
            }}
          >
            <div>
              <Typography.Text strong>{row.label}</Typography.Text>
              <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
                {row.description}
              </Typography.Paragraph>
            </div>
            <Switch checked={algorithm.includes(row.key)} onChange={() => toggleAlgorithm(row.key)} />
          </div>
        ))}
      </div>
    </div>
  )
}
