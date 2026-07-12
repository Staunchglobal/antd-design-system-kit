import { Button, Popconfirm, Space, message } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function PopconfirmDemo() {
  return (
    <ComponentSection
      id="popconfirm"
      title="Popconfirm"
      description="A small popup that asks for confirmation before performing an action."
    >
      <Example title="Basic">
        <Popconfirm
          title="Delete this item"
          description="Are you sure you want to delete this item?"
          onConfirm={() => message.success('Item deleted')}
          onCancel={() => message.info('Cancelled')}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      </Example>

      <Example title="Custom icon">
        <Popconfirm
          title="Discard unsaved changes?"
          icon={<QuestionCircleOutlined style={{ color: 'orange' }} />}
          onConfirm={() => message.success('Changes discarded')}
        >
          <Button>Discard</Button>
        </Popconfirm>
      </Example>

      <Example title="Placement">
        <Space wrap>
          <Popconfirm title="Confirm this action?" placement="topLeft" onConfirm={() => message.success('Confirmed')}>
            <Button>Top left</Button>
          </Popconfirm>
          <Popconfirm title="Confirm this action?" placement="bottomRight" onConfirm={() => message.success('Confirmed')}>
            <Button>Bottom right</Button>
          </Popconfirm>
        </Space>
      </Example>
    </ComponentSection>
  )
}
