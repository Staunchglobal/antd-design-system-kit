'use client'

import { Progress, Space } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function ProgressDemo() {
  return (
    <ComponentSection id="progress" title="Progress" description="Displays the current progress of an operation.">
      <Example title="Line">
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Progress percent={30} />
          <Progress percent={70} status="active" />
          <Progress percent={100} />
          <Progress percent={60} status="exception" />
        </div>
      </Example>

      <Example title="Circle">
        <Space wrap size="large">
          <Progress type="circle" percent={75} />
          <Progress type="circle" percent={100} status="success" />
          <Progress type="circle" percent={40} status="exception" />
        </Space>
      </Example>

      <Example title="Dashboard">
        <Space wrap size="large">
          <Progress type="dashboard" percent={80} />
          <Progress type="dashboard" percent={20} status="exception" />
        </Space>
      </Example>

      <Example title="Sizes and custom strokes">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Progress percent={50} size="small" />
          <Progress percent={50} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
        </Space>
      </Example>
    </ComponentSection>
  )
}
