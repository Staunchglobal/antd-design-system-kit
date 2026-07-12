import { Button, Space, message } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function MessageDemo() {
  return (
    <ComponentSection id="message" title="Message" description="Lightweight, non-blocking feedback for the outcome of an action.">
      <Example title="Types">
        <Space wrap>
          <Button onClick={() => message.success('Changes saved successfully')}>Success</Button>
          <Button onClick={() => message.error('Something went wrong')}>Error</Button>
          <Button onClick={() => message.warning('This action may have side effects')}>Warning</Button>
          <Button onClick={() => message.info('New version available')}>Info</Button>
        </Space>
      </Example>

      <Example title="Loading with duration">
        <Button
          onClick={() => {
            const hide = message.loading('Processing request...', 0)
            setTimeout(() => {
              hide()
              message.success('Request completed')
            }, 1500)
          }}
        >
          Show loading then success
        </Button>
      </Example>

      <Example title="Custom duration">
        <Button onClick={() => message.info('This message stays for 5 seconds', 5)}>
          Long duration message
        </Button>
      </Example>
    </ComponentSection>
  )
}
