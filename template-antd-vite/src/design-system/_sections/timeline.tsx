import { Timeline } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

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
            { children: 'Create a services site 2015-09-01' },
            { children: 'Solve initial network problems 2015-09-01' },
            { children: 'Technical testing 2015-09-01' },
            { children: 'Network problems being solved 2015-09-01' },
          ]}
        />
      </Example>

      <Example title="Color-coded dots">
        <Timeline
          items={[
            { color: 'green', children: 'Order placed' },
            { color: 'green', children: 'Payment confirmed' },
            { color: 'blue', children: 'Preparing shipment' },
            { color: 'gray', children: 'Awaiting delivery' },
            { color: 'red', children: 'Delivery failed, retrying' },
          ]}
        />
      </Example>

      <Example title="Custom icon">
        <Timeline
          items={[
            { color: 'blue', dot: <ClockCircleOutlined />, children: 'Scheduled for review 2026-07-01' },
            { children: 'Reviewed by team lead 2026-07-05' },
            { children: 'Approved and merged 2026-07-12' },
          ]}
        />
      </Example>
    </ComponentSection>
  )
}
