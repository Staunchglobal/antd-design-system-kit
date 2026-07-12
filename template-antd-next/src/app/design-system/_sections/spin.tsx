'use client'

import * as React from 'react'
import { Alert, Button, Space, Spin } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function SpinDemo() {
  const [spinning, setSpinning] = React.useState(false)

  const toggleSpinning = () => {
    setSpinning(true)
    setTimeout(() => setSpinning(false), 1500)
  }

  return (
    <ComponentSection id="spin" title="Spin" description="Indicates a loading state for a page or section of content.">
      <Example title="Basic">
        <Spin />
      </Example>

      <Example title="Sizes">
        <Space size="large" align="center">
          <Spin size="small" />
          <Spin size="default" />
          <Spin size="large" />
        </Space>
      </Example>

      <Example title="With description">
        <Spin description="Loading..." spinning>
          <Alert
            message="Alert message title"
            description="Further details about the context of this alert."
            type="info"
          />
        </Spin>
      </Example>

      <Example title="Toggle spinning content">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button onClick={toggleSpinning}>Refresh content</Button>
          <Spin spinning={spinning}>
            <Alert message="Content loaded from the server appears here." type="success" />
          </Spin>
        </Space>
      </Example>
    </ComponentSection>
  )
}
