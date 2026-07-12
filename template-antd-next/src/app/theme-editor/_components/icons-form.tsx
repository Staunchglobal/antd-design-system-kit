'use client'

import { Select, Typography } from 'antd'
import { antIconNames, AppIcon } from '@/components/icons/icon'
import { useThemeEditor } from '@/app/theme-editor/_lib/theme-editor-context'
import type { IconKey } from '@/components/icons/icon-map'

const ICON_LABELS: Record<IconKey, string> = {
  'button.new': 'Button — "New" icon',
  'button.download': 'Button — "Download" icon',
}

export function IconsForm() {
  const { iconMap, setIcon } = useThemeEditor()

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Icons
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
        Only app-level icon choices this kit generates are remappable here — Ant Design&apos;s own
        internal component icons (Checkbox, Switch, etc.) ship as compiled npm source and
        can&apos;t be swapped.
      </Typography.Paragraph>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {(Object.keys(iconMap) as IconKey[]).map((key, i) => (
          <div
            key={key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              paddingBlock: 12,
              borderTop: i === 0 ? undefined : '1px solid rgba(5, 5, 5, 0.06)',
            }}
          >
            <Typography.Text strong>{ICON_LABELS[key] ?? key}</Typography.Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  border: '1px solid rgba(5,5,5,0.1)',
                }}
              >
                <AppIcon name={key} overrideMap={iconMap} />
              </div>
              <Select
                showSearch
                value={iconMap[key]}
                onChange={(v) => setIcon(key, v)}
                style={{ width: 260 }}
                options={antIconNames.map((n) => ({ value: n, label: n }))}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
