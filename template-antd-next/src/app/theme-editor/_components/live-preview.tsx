'use client'

import { Alert, Avatar, Button, Card, Checkbox, Input, Progress, Space, Switch, Tag, Typography } from 'antd'
import { HeartFilled, UserOutlined } from '@ant-design/icons'

/**
 * A small, representative slice of components (not the full /design-system showcase) —
 * enough to see every global token's effect (color, radius, font, control height, motion)
 * without needing to mount all 72 sections inside the editor's live-preview pane.
 */
export function LivePreview() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="Card + Button">
        <Space wrap>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="primary" danger>
            Danger
          </Button>
        </Space>
      </Card>

      <Card title="Typography">
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          Heading
        </Typography.Title>
        <Typography.Paragraph>
          Body text using the current font family and size. <Typography.Text code>code text</Typography.Text>
        </Typography.Paragraph>
        <Typography.Link href="#">A hyperlink</Typography.Link>
      </Card>

      <Card title="Inputs & Tags">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input placeholder="Text input" />
          <Space wrap>
            <Tag color="success">Success</Tag>
            <Tag color="warning">Warning</Tag>
            <Tag color="error">Error</Tag>
            <Tag color="processing">Info</Tag>
          </Space>
          <Space>
            <Switch defaultChecked />
            <Checkbox defaultChecked>Checkbox</Checkbox>
          </Space>
        </Space>
      </Card>

      <Card title="Feedback">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert type="success" message="Success alert" showIcon />
          <Alert type="warning" message="Warning alert" showIcon />
          <Progress percent={65} />
        </Space>
      </Card>

      <Card title="Avatar & Icons">
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Avatar style={{ backgroundColor: '#f56a00' }}>U</Avatar>
          <HeartFilled style={{ color: 'var(--ant-color-error, #ff4d4f)' }} />
        </Space>
      </Card>
    </Space>
  )
}
