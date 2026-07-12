import { Button, Popover, Space } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const content = (
  <div>
    <p style={{ margin: 0 }}>Content line one.</p>
    <p style={{ margin: 0 }}>Content line two.</p>
  </div>
)

export default function PopoverDemo() {
  return (
    <ComponentSection
      id="popover"
      title="Popover"
      description="A floating card triggered by hover or click, used for extra information or actions."
    >
      <Example title="Basic">
        <Popover title="Title" content={content}>
          <Button>Hover me</Button>
        </Popover>
      </Example>

      <Example title="Click trigger">
        <Popover title="Confirm" content={content} trigger="click">
          <Button type="primary">Click me</Button>
        </Popover>
      </Example>

      <Example title="Placements" contentStyle={{ justifyContent: 'center' }}>
        <Space wrap>
          <Popover content={content} title="Top" placement="top">
            <Button>Top</Button>
          </Popover>
          <Popover content={content} title="Right" placement="right">
            <Button>Right</Button>
          </Popover>
          <Popover content={content} title="Bottom" placement="bottom">
            <Button>Bottom</Button>
          </Popover>
          <Popover content={content} title="Left" placement="left">
            <Button>Left</Button>
          </Popover>
        </Space>
      </Example>
    </ComponentSection>
  )
}
