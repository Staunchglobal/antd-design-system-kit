import { Avatar, Badge, Space } from 'antd'
import { NotificationOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function BadgeDemo() {
  return (
    <ComponentSection id="badge" title="Badge" description="A small numerical or status indicator overlaid on another element.">
      <Example title="Basic count">
        <Space size="large">
          <Badge count={5}>
            <Avatar shape="square" size="large" />
          </Badge>
          <Badge count={0} showZero>
            <Avatar shape="square" size="large" />
          </Badge>
          <Badge count={99}>
            <Avatar shape="square" size="large" />
          </Badge>
          <Badge count={100} overflowCount={99}>
            <Avatar shape="square" size="large" />
          </Badge>
        </Space>
      </Example>

      <Example title="Dot">
        <Space size="large">
          <Badge dot>
            <NotificationOutlined style={{ fontSize: 20 }} />
          </Badge>
          <Badge dot status="success">
            <Avatar shape="square" />
          </Badge>
        </Space>
      </Example>

      <Example title="Status">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Badge status="success" text="Success" />
          <Badge status="error" text="Error" />
          <Badge status="default" text="Default" />
          <Badge status="processing" text="Processing" />
          <Badge status="warning" text="Warning" />
        </div>
      </Example>

      <Example title="Custom color">
        <Space size="large">
          <Badge count={9} color="purple">
            <Avatar shape="square" size="large" />
          </Badge>
          <Badge count={9} color="#87d068">
            <Avatar shape="square" size="large" />
          </Badge>
        </Space>
      </Example>
    </ComponentSection>
  )
}
