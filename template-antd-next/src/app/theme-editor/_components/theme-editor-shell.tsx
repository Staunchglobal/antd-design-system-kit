'use client'

import * as React from 'react'
import { ConfigProvider, Divider } from 'antd'
import type { ThemeManifest } from '@/lib/theme/types'
import type { IconKey } from '@/components/icons/icon-map'
import { IconMapProvider } from '@/components/icons/icon-context'
import { ThemeEditorProvider, useThemeEditor } from '@/app/theme-editor/_lib/theme-editor-context'
import { ThemeNav } from './theme-nav'
import { VariableForm } from './variable-form'
import { IconsForm } from './icons-form'
import { AppearanceForm } from './appearance-form'
import { ComponentTokenForm } from './component-token-form'
import { LivePreview } from './live-preview'

function ShellBody() {
  const { manifest, values, componentValues, iconMap, resolvedAlgorithm } = useThemeEditor()
  const [activeGroupId, setActiveGroupId] = React.useState(manifest.groups[0]?.id ?? '')
  const activeComponentGroup = manifest.componentGroups.find((g) => g.id === activeGroupId)

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 240, flexShrink: 0, borderRight: '1px solid rgba(5,5,5,0.06)', padding: 16, overflowY: 'auto' }}>
        <ThemeNav activeGroupId={activeGroupId} onSelectGroup={setActiveGroupId} />
      </aside>

      <section style={{ width: 420, flexShrink: 0, borderRight: '1px solid rgba(5,5,5,0.06)', padding: 16, overflowY: 'auto' }}>
        {activeGroupId === 'icons' ? (
          <IconsForm />
        ) : activeGroupId === 'appearance' ? (
          <AppearanceForm />
        ) : activeComponentGroup ? (
          <ComponentTokenForm group={activeComponentGroup} />
        ) : (
          <VariableForm activeGroupId={activeGroupId} />
        )}
      </section>

      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: 16 }}>
        <Divider style={{ marginTop: 0 }}>Live preview</Divider>
        <ConfigProvider theme={{ token: values, components: componentValues, algorithm: resolvedAlgorithm }}>
          <IconMapProvider value={iconMap}>
            <LivePreview />
          </IconMapProvider>
        </ConfigProvider>
      </main>
    </div>
  )
}

export function ThemeEditorShell({
  manifest,
  initialIconMap,
}: {
  manifest: ThemeManifest
  initialIconMap: Record<IconKey, string>
}) {
  return (
    <ThemeEditorProvider manifest={manifest} initialIconMap={initialIconMap}>
      <ShellBody />
    </ThemeEditorProvider>
  )
}
