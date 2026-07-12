'use client'

import { InputNumber, Space } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function InputNumberDemo() {
  return (
    <ComponentSection
      id="input-number"
      title="Input Number"
      description="A numeric input with increment/decrement controls, min/max bounds, and step size."
    >
      <Example title="Basic">
        <InputNumber min={0} max={100} defaultValue={10} />
      </Example>

      <Example title="Step and precision">
        <Space>
          <InputNumber min={0} max={10} step={0.5} defaultValue={1.5} />
          <InputNumber min={0} max={1000} step={100} defaultValue={200} />
        </Space>
      </Example>

      <Example title="With addons">
        <Space direction="vertical">
          <InputNumber addonBefore="$" addonAfter="USD" defaultValue={1000} style={{ width: 200 }} />
          <InputNumber addonAfter="%" defaultValue={20} min={0} max={100} style={{ width: 160 }} />
        </Space>
      </Example>

      <Example title="Sizes and states">
        <Space wrap align="center">
          <InputNumber size="large" defaultValue={10} />
          <InputNumber defaultValue={10} />
          <InputNumber size="small" defaultValue={10} />
          <InputNumber defaultValue={10} disabled />
        </Space>
      </Example>
    </ComponentSection>
  )
}
