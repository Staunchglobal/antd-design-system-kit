'use client'

import { Descriptions } from 'antd'
import type { DescriptionsProps } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const items: DescriptionsProps['items'] = [
  { key: 'name', label: 'Name', children: 'Jane Doe' },
  { key: 'role', label: 'Role', children: 'Product Designer' },
  { key: 'email', label: 'Email', children: 'jane.doe@example.com' },
  { key: 'phone', label: 'Phone', children: '+1 555-0100' },
  { key: 'address', label: 'Address', children: '123 Market Street, San Francisco, CA', span: 2 },
  { key: 'remark', label: 'Remark', children: 'Prefers async updates over meetings.', span: 2 },
]

export default function DescriptionsDemo() {
  return (
    <ComponentSection
      id="descriptions"
      title="Descriptions"
      description="Display a group of read-only fields as label/value pairs."
    >
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <Descriptions title="User profile" items={items} column={2} />
      </Example>

      <Example title="Bordered" contentStyle={{ display: 'block' }}>
        <Descriptions title="User profile" items={items} column={2} bordered />
      </Example>

      <Example title="Vertical layout" contentStyle={{ display: 'block' }}>
        <Descriptions title="User profile" items={items} column={3} bordered layout="vertical" size="small" />
      </Example>
    </ComponentSection>
  )
}
