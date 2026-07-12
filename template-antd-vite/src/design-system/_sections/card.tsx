import { Avatar, Card } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const { Meta } = Card

export default function CardDemo() {
  return (
    <ComponentSection id="card" title="Card" description="A container for grouping related content and actions.">
      <Example title="Basic">
        <Card title="Card title" style={{ width: 300 }} extra={<a href="#">More</a>}>
          <p style={{ margin: 0 }}>Card content goes here, describing something useful.</p>
        </Card>
      </Example>

      <Example title="With actions and meta">
        <Card
          style={{ width: 300 }}
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
            title="Jane Doe"
            description="Product Designer at Acme"
          />
        </Card>
      </Example>

      <Example title="Loading">
        <Card style={{ width: 300 }} loading title="Card title" />
      </Example>

      <Example title="Grid">
        <Card title="Grid card" style={{ width: '100%' }} styles={{ body: { padding: 0 } }}>
          <Card.Grid style={{ width: '25%', textAlign: 'center' }}>Content</Card.Grid>
          <Card.Grid style={{ width: '25%', textAlign: 'center' }} hoverable={false}>
            Content
          </Card.Grid>
          <Card.Grid style={{ width: '25%', textAlign: 'center' }}>Content</Card.Grid>
          <Card.Grid style={{ width: '25%', textAlign: 'center' }}>Content</Card.Grid>
        </Card>
      </Example>
    </ComponentSection>
  )
}
