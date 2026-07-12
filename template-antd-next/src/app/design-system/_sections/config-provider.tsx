'use client'

import { Button, ConfigProvider, Space, Tag, Typography } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function ConfigProviderDemo() {
  return (
    <ComponentSection
      id="config-provider"
      title="Config Provider"
      description="Provides global or scoped configuration (theme tokens, locale, component defaults) to its descendants. This demo overrides theme tokens only within a local subtree — the app's real theme is untouched."
    >
      <Example title="Default theme (no override)">
        <Space wrap>
          <Button type="primary">Primary button</Button>
          <Tag color="processing">Default token</Tag>
        </Space>
      </Example>

      <Example title="Scoped theme override" description="Buttons and tags inside this ConfigProvider subtree use a magenta primary color instead of the app default.">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#eb2f96',
              borderRadius: 2,
            },
          }}
        >
          <Space wrap>
            <Button type="primary">Primary button</Button>
            <Tag color="processing">Overridden token</Tag>
          </Space>
        </ConfigProvider>
      </Example>

      <Example title="Nested override">
        <ConfigProvider theme={{ token: { colorPrimary: '#13c2c2' } }}>
          <Space orientation="vertical">
            <Button type="primary">Teal (outer override)</Button>
            <ConfigProvider theme={{ token: { colorPrimary: '#fa8c16' } }}>
              <Button type="primary">Orange (nested override wins)</Button>
            </ConfigProvider>
          </Space>
        </ConfigProvider>
      </Example>

      <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
        Nested ConfigProvider theme tokens merge with and override their ancestor&apos;s tokens for everything rendered underneath.
      </Typography.Paragraph>
    </ComponentSection>
  )
}
