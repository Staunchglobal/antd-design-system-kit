import * as React from 'react'
import { Button, Modal, Space } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function ModalDemo() {
  const [basicOpen, setBasicOpen] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)

  const handleOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setConfirmLoading(false)
      setBasicOpen(false)
    }, 1000)
  }

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
    })
  }

  return (
    <ComponentSection id="modal" title="Modal" description="A dialog that focuses user attention on a single task or decision.">
      <Example title="Basic">
        <Button type="primary" onClick={() => setBasicOpen(true)}>
          Open modal
        </Button>
        <Modal
          title="Basic modal"
          open={basicOpen}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={() => setBasicOpen(false)}
        >
          <p>Some contents describing the action to be taken...</p>
        </Modal>
      </Example>

      <Example title="Confirm dialog">
        <Space>
          <Button danger onClick={showDeleteConfirm}>
            Delete item
          </Button>
        </Space>
      </Example>

      <Example title="Info dialog">
        <Button
          onClick={() =>
            Modal.info({
              title: 'System notice',
              content: 'Scheduled maintenance will occur this weekend from 2am to 4am UTC.',
            })
          }
        >
          Show info
        </Button>
      </Example>
    </ComponentSection>
  )
}
