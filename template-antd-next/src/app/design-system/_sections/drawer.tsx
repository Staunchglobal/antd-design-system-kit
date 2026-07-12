'use client'

import * as React from 'react'
import { Button, Drawer, Form, Input, Select, Space } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function DrawerDemo() {
  const [basicOpen, setBasicOpen] = React.useState(false)
  const [placement, setPlacement] = React.useState<'top' | 'right' | 'bottom' | 'left'>('right')
  const [placementOpen, setPlacementOpen] = React.useState(false)
  const [formOpen, setFormOpen] = React.useState(false)

  return (
    <ComponentSection id="drawer" title="Drawer" description="A panel that slides in from the edge of the screen to show supplementary content.">
      <Example title="Basic">
        <Button type="primary" onClick={() => setBasicOpen(true)}>
          Open drawer
        </Button>
        <Drawer title="Basic drawer" open={basicOpen} onClose={() => setBasicOpen(false)}>
          <p>Some contents describing the item...</p>
          <p>More detail goes here.</p>
        </Drawer>
      </Example>

      <Example title="Placement">
        <Space wrap>
          {(['top', 'right', 'bottom', 'left'] as const).map((p) => (
            <Button
              key={p}
              onClick={() => {
                setPlacement(p)
                setPlacementOpen(true)
              }}
            >
              {p}
            </Button>
          ))}
        </Space>
        <Drawer
          title={`Placement: ${placement}`}
          placement={placement}
          open={placementOpen}
          onClose={() => setPlacementOpen(false)}
        >
          <p>This drawer slides in from the {placement}.</p>
        </Drawer>
      </Example>

      <Example title="With a form and footer">
        <Button onClick={() => setFormOpen(true)}>New customer</Button>
        <Drawer
          title="Create a new customer"
          open={formOpen}
          onClose={() => setFormOpen(false)}
          size={360}
          footer={
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={() => setFormOpen(false)}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical">
            <Form.Item label="Name" required>
              <Input placeholder="Jane Doe" />
            </Form.Item>
            <Form.Item label="Email" required>
              <Input placeholder="jane@example.com" />
            </Form.Item>
            <Form.Item label="Plan">
              <Select
                placeholder="Select a plan"
                options={[
                  { value: 'starter', label: 'Starter' },
                  { value: 'pro', label: 'Pro' },
                  { value: 'enterprise', label: 'Enterprise' },
                ]}
              />
            </Form.Item>
          </Form>
        </Drawer>
      </Example>
    </ComponentSection>
  )
}
