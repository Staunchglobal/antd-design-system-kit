'use client'

import { Timeline } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function TimelineDemo() {
  return (
    <ComponentSection
      id="timeline"
      title="Timeline"
      description="Displays a list of events in chronological order."
    >
      <Example title="Basic">
        <Timeline
          items={[
            { content: 'Create a services site 2015-09-01' },
            { content: 'Solve initial network problems 2015-09-01' },
            { content: 'Technical testing 2015-09-01' },
            { content: 'Network problems being solved 2015-09-01' },
          ]}
        />
      </Example>

      <Example title="Color-coded dots">
        <Timeline
          items={[
            { color: 'green', content: 'Order placed' },
            { color: 'green', content: 'Payment confirmed' },
            { color: 'blue', content: 'Preparing shipment' },
            { color: 'gray', content: 'Awaiting delivery' },
            { color: 'red', content: 'Delivery failed, retrying' },
          ]}
        />
      </Example>

      <Example title="Custom icon">
        <Timeline
          items={[
            { color: 'blue', icon: <ClockCircleOutlined />, content: 'Scheduled for review 2026-07-01' },
            { content: 'Reviewed by team lead 2026-07-05' },
            { content: 'Approved and merged 2026-07-12' },
          ]}
        />
      </Example>
    </ComponentSection>
  )
}
