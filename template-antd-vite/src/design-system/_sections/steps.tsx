import {
  LoadingOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Steps } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function StepsDemo() {
  return (
    <ComponentSection
      id="steps"
      title="Steps"
      description="Guides the user through the steps of a task, showing progress and current position."
    >
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <Steps
          current={1}
          items={[
            { title: 'Finished', description: 'This step has been completed.' },
            { title: 'In Progress', description: 'This step is currently active.' },
            { title: 'Waiting', description: 'This step has not started yet.' },
          ]}
        />
      </Example>

      <Example title="With error status" contentStyle={{ display: 'block' }}>
        <Steps
          current={1}
          status="error"
          items={[
            { title: 'Login', description: 'Completed.' },
            { title: 'Verification', description: 'Verification failed.' },
            { title: 'Pay', description: 'Waiting.' },
          ]}
        />
      </Example>

      <Example title="With icons" contentStyle={{ display: 'block' }}>
        <Steps
          items={[
            { title: 'Account', status: 'finish', icon: <UserOutlined /> },
            { title: 'Processing', status: 'process', icon: <LoadingOutlined /> },
            { title: 'Review', status: 'wait', icon: <SolutionOutlined /> },
          ]}
        />
      </Example>

      <Example title="Small size, vertical" contentStyle={{ display: 'block' }}>
        <Steps
          direction="vertical"
          size="small"
          current={1}
          items={[
            { title: 'Order placed', description: 'Your order has been placed.' },
            { title: 'Preparing shipment', description: 'Your items are being packed.' },
            { title: 'Delivered', description: 'Awaiting delivery.' },
          ]}
        />
      </Example>
    </ComponentSection>
  )
}
