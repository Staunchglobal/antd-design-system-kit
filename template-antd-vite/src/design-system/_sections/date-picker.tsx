import { DatePicker, Space } from 'antd'
import dayjs from 'dayjs'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function DatePickerDemo() {
  return (
    <ComponentSection
      id="date-picker"
      title="DatePicker"
      description="Select a date or a range of dates."
    >
      <Example title="Basic">
        <Space wrap>
          <DatePicker />
          <DatePicker picker="week" />
          <DatePicker picker="month" />
          <DatePicker picker="year" />
        </Space>
      </Example>

      <Example title="Range">
        <Space wrap>
          <DatePicker.RangePicker />
        </Space>
      </Example>

      <Example title="With default value and time">
        <Space wrap>
          <DatePicker defaultValue={dayjs('2026-01-01')} />
          <DatePicker showTime defaultValue={dayjs('2026-01-01T12:00:00')} />
        </Space>
      </Example>

      <Example title="States">
        <Space wrap>
          <DatePicker disabled />
          <DatePicker status="error" />
        </Space>
      </Example>
    </ComponentSection>
  )
}
