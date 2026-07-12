'use client'

import { Button, Empty, Space } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function EmptyDemo() {
  return (
    <ComponentSection
      id="empty"
      title="Empty"
      description="A placeholder for empty states such as no data or no search results."
    >
      <Example title="Default" contentStyle={{ display: 'block' }}>
        <Empty />
      </Example>

      <Example title="Custom description and action" contentStyle={{ display: 'block' }}>
        <Empty description="No matching results">
          <Button type="primary">Clear filters</Button>
        </Empty>
      </Example>

      <Example title="Simple / compact image" contentStyle={{ display: 'block' }}>
        <Space size={48} wrap>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
        </Space>
      </Example>
    </ComponentSection>
  )
}
