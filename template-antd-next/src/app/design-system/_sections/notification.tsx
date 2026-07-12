'use client'

import { Button, Space, notification } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function NotificationDemo() {
  return (
    <ComponentSection
      id="notification"
      title="Notification"
      description="A global display of important, timed messages, richer than Message, using antd's static notification API."
    >
      <Example title="Types">
        <Space wrap>
          <Button
            onClick={() =>
              notification.success({
                title: 'Success',
                description: 'Your changes have been saved successfully.',
              })
            }
          >
            Success
          </Button>
          <Button
            onClick={() =>
              notification.error({
                title: 'Error',
                description: 'Something went wrong while saving your changes.',
              })
            }
          >
            Error
          </Button>
          <Button
            onClick={() =>
              notification.warning({
                title: 'Warning',
                description: 'This action may have unintended side effects.',
              })
            }
          >
            Warning
          </Button>
          <Button
            onClick={() =>
              notification.info({
                title: 'New version available',
                description: 'A new version of the app is ready to install.',
              })
            }
          >
            Info
          </Button>
        </Space>
      </Example>

      <Example title="With description and placement">
        <Space wrap>
          <Button
            onClick={() =>
              notification.open({
                title: 'Deployment complete',
                description: 'Build #482 was deployed to production at 10:42 UTC.',
                placement: 'topRight',
              })
            }
          >
            Top right
          </Button>
          <Button
            onClick={() =>
              notification.open({
                title: 'Deployment complete',
                description: 'Build #482 was deployed to production at 10:42 UTC.',
                placement: 'bottomLeft',
              })
            }
          >
            Bottom left
          </Button>
        </Space>
      </Example>

      <Example title="Custom duration">
        <Button
          onClick={() =>
            notification.info({
              title: 'Sticky notice',
              description: 'This notification stays open until manually closed.',
              duration: 0,
            })
          }
        >
          Show sticky notification
        </Button>
      </Example>
    </ComponentSection>
  )
}
