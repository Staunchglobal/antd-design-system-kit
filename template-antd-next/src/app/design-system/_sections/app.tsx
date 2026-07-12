'use client'

import { App as AntdApp, Button, Space } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

function AppContextButtons() {
  const { message, modal, notification } = AntdApp.useApp()

  return (
    <Space wrap>
      <Button onClick={() => message.success('Saved via contextual message instance')}>Contextual message</Button>
      <Button
        onClick={() =>
          modal.confirm({
            title: 'Confirm via contextual modal',
            content: 'This modal instance was obtained from AntdApp.useApp().',
          })
        }
      >
        Contextual modal
      </Button>
      <Button
        onClick={() =>
          notification.info({
            title: 'Contextual notification',
            description: 'This notification instance was obtained from AntdApp.useApp().',
          })
        }
      >
        Contextual notification
      </Button>
    </Space>
  )
}

export default function AppDemo() {
  return (
    <ComponentSection
      id="app"
      title="App"
      description="Provides a unified context for message, modal, and notification instances, so they render inside the app's own theme and DOM context."
    >
      <Example
        title="useApp()"
        description="A child component reads message/modal/notification off context instead of the static antd namespaces."
      >
        <AntdApp>
          <AppContextButtons />
        </AntdApp>
      </Example>
    </ComponentSection>
  )
}
