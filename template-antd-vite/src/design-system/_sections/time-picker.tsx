import { Space, TimePicker } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function TimePickerDemo() {
  return (
    <ComponentSection
      id="time-picker"
      title="TimePicker"
      description="Pick a single time or a time range."
    >
      <Example title="Basic">
        <TimePicker />
      </Example>

      <Example title="With format and default value">
        <Space wrap>
          <TimePicker defaultValue={undefined} format="HH:mm" />
          <TimePicker format="h:mm a" use12Hours />
        </Space>
      </Example>

      <Example title="Range">
        <TimePicker.RangePicker />
      </Example>

      <Example title="Sizes and states">
        <Space wrap>
          <TimePicker size="large" placeholder="Large" />
          <TimePicker placeholder="Middle" />
          <TimePicker size="small" placeholder="Small" />
          <TimePicker placeholder="Disabled" disabled />
        </Space>
      </Example>
    </ComponentSection>
  )
}
