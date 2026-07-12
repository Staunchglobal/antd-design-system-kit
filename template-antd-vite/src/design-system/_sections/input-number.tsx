import { Input, InputNumber, Space } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

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
        <Space orientation="vertical">
          <Space.Compact>
            <Input style={{ width: 40, flex: 'none', textAlign: 'center' }} defaultValue="$" disabled />
            <InputNumber defaultValue={1000} style={{ width: 120 }} />
            <Input style={{ width: 60, flex: 'none', textAlign: 'center' }} defaultValue="USD" disabled />
          </Space.Compact>
          <Space.Compact>
            <InputNumber defaultValue={20} min={0} max={100} style={{ width: 120 }} />
            <Input style={{ width: 40, flex: 'none', textAlign: 'center' }} defaultValue="%" disabled />
          </Space.Compact>
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
