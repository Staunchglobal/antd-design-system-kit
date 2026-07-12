'use client'

import * as React from 'react'
import { ConfigProvider, Divider } from 'antd'
import type { ThemeManifest } from '@/lib/theme/types'
import { ThemeEditorProvider, useThemeEditor } from '@/app/theme-editor/_lib/theme-editor-context'
import { ThemeNav } from './theme-nav'
import { VariableForm } from './variable-form'
import { LivePreview } from './live-preview'

function ShellBody() {
  const { manifest } = useThemeEditor()
  const [activeGroupId, setActiveGroupId] = React.useState(manifest.groups[0]?.id ?? '')
  const { values } = useThemeEditor()

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 240, flexShrink: 0, borderRight: '1px solid rgba(5,5,5,0.06)', padding: 16, overflowY: 'auto' }}>
        <ThemeNav activeGroupId={activeGroupId} onSelectGroup={setActiveGroupId} />
      </aside>

      <section style={{ width: 420, flexShrink: 0, borderRight: '1px solid rgba(5,5,5,0.06)', padding: 16, overflowY: 'auto' }}>
        <VariableForm activeGroupId={activeGroupId} />
      </section>

      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: 16 }}>
        <Divider style={{ marginTop: 0 }}>Live preview</Divider>
        <ConfigProvider theme={{ token: values }}>
          <LivePreview />
        </ConfigProvider>
      </main>
    </div>
  )
}

export function ThemeEditorShell({ manifest }: { manifest: ThemeManifest }) {
  return (
    <ThemeEditorProvider manifest={manifest}>
      <ShellBody />
    </ThemeEditorProvider>
  )
}
