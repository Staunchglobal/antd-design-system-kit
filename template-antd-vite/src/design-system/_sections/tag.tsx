import * as React from 'react'
import { Tag } from 'antd'
import { CheckOutlined, ClockCircleOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function TagDemo() {
  const [visible, setVisible] = React.useState(true)
  const [selected, setSelected] = React.useState(['react'])

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  return (
    <ComponentSection id="tag" title="Tag" description="Compact labels for categorization, filtering, or status.">
      <Example title="Basic">
        <Tag>Default</Tag>
        <Tag color="processing">Processing</Tag>
        <Tag icon={<ClockCircleOutlined />} color="warning">
          Pending
        </Tag>
        <Tag icon={<CheckOutlined />} color="success">
          Success
        </Tag>
        <Tag icon={<CloseOutlined />} color="error">
          Failed
        </Tag>
      </Example>

      <Example title="Colors">
        <Tag color="magenta">magenta</Tag>
        <Tag color="red">red</Tag>
        <Tag color="volcano">volcano</Tag>
        <Tag color="orange">orange</Tag>
        <Tag color="gold">gold</Tag>
        <Tag color="green">green</Tag>
        <Tag color="cyan">cyan</Tag>
        <Tag color="blue">blue</Tag>
        <Tag color="purple">purple</Tag>
      </Example>

      <Example title="Closable">
        {visible && (
          <Tag closable onClose={() => setVisible(false)}>
            Closable tag
          </Tag>
        )}
        {!visible && (
          <Tag icon={<PlusOutlined />} onClick={() => setVisible(true)} style={{ cursor: 'pointer' }}>
            Add tag
          </Tag>
        )}
        <Tag closable>Another closable</Tag>
      </Example>

      <Example title="Checkable">
        {['react', 'vue', 'angular'].map((value) => (
          <Tag.CheckableTag
            key={value}
            checked={selected.includes(value)}
            onChange={() => toggle(value)}
          >
            {value}
          </Tag.CheckableTag>
        ))}
      </Example>
    </ComponentSection>
  )
}
