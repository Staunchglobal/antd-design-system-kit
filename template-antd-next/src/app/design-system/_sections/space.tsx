'use client'

import { Button, Card, Divider, Space } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function SpaceDemo() {
  return (
    <ComponentSection
      id="space"
      title="Space"
      description="Set components spacing, avoiding the need for extra margin utility classes."
    >
      <Example title="Size">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Space size="small">
            <Button>Small</Button>
            <Button>Small</Button>
            <Button>Small</Button>
          </Space>
          <Space size="middle">
            <Button>Middle</Button>
            <Button>Middle</Button>
            <Button>Middle</Button>
          </Space>
          <Space size="large">
            <Button>Large</Button>
            <Button>Large</Button>
            <Button>Large</Button>
          </Space>
        </div>
      </Example>

      <Example title="Vertical">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Card size="small">Card 1</Card>
          <Card size="small">Card 2</Card>
          <Card size="small">Card 3</Card>
        </Space>
      </Example>

      <Example title="Split">
        <Space separator={<Divider orientation="vertical" />}>
          <Button type="link" style={{ padding: 0 }}>
            Link 1
          </Button>
          <Button type="link" style={{ padding: 0 }}>
            Link 2
          </Button>
          <Button type="link" style={{ padding: 0 }}>
            Link 3
          </Button>
        </Space>
      </Example>

      <Example title="Alignment">
        <Space align="end">
          <div style={{ height: 24 }}>Short</div>
          <div style={{ height: 48 }}>Taller</div>
          <div style={{ height: 72 }}>Tallest</div>
        </Space>
      </Example>
    </ComponentSection>
  )
}
