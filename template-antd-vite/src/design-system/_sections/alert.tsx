import { Alert, Space } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function AlertDemo() {
  return (
    <ComponentSection id="alert" title="Alert" description="Displays important, contextual feedback messages.">
      <Example title="Types" contentStyle={{ display: 'block' }}>
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Alert title="Success Tips" type="success" showIcon />
          <Alert title="Informational Notes" type="info" showIcon />
          <Alert title="Warning" type="warning" showIcon />
          <Alert title="Error" type="error" showIcon />
        </Space>
      </Example>

      <Example title="With description" contentStyle={{ display: 'block' }}>
        <Alert
          title="Update available"
          description="A new version of the design system is available. Refresh to load the latest tokens."
          type="info"
          showIcon
        />
      </Example>

      <Example title="Closable" contentStyle={{ display: 'block' }}>
        <Alert
          title="Closable alert"
          description="This alert can be dismissed by the user."
          type="warning"
          showIcon
          closable
        />
      </Example>

      <Example title="With action" contentStyle={{ display: 'block' }}>
        <Alert
          title="Deployment in progress"
          description="Your changes are being published to production."
          type="info"
          showIcon
          action={
            <a href="#" style={{ fontSize: 12 }}>
              View status
            </a>
          }
          closable
        />
      </Example>
    </ComponentSection>
  )
}
