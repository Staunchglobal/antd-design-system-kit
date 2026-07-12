'use client'

import { Calendar } from 'antd'
import type { CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const getListData = (value: Dayjs) => {
  const day = value.date()
  if (day % 7 === 0) return [{ type: 'success', content: 'Deploy complete' }]
  if (day % 5 === 0) return [{ type: 'warning', content: 'Review due' }]
  return []
}

const cellRender: CalendarProps<Dayjs>['cellRender'] = (value, info) => {
  if (info.type !== 'date') return info.originNode
  const listData = getListData(value)
  if (!listData.length) return info.originNode
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {listData.map((item) => (
        <li key={item.content}>
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              marginRight: 4,
              background: item.type === 'success' ? '#52c41a' : '#faad14',
            }}
          />
          <span style={{ fontSize: 12 }}>{item.content}</span>
        </li>
      ))}
    </ul>
  )
}

export default function CalendarDemo() {
  return (
    <ComponentSection
      id="calendar"
      title="Calendar"
      description="A full-size or compact calendar for date-based navigation and content."
    >
      <Example title="Full size" contentStyle={{ display: 'block' }}>
        <Calendar cellRender={cellRender} />
      </Example>

      <Example title="Mini / compact" description="fullscreen={false} for embedding in cards or sidebars." contentStyle={{ display: 'block', maxWidth: 320 }}>
        <Calendar fullscreen={false} />
      </Example>
    </ComponentSection>
  )
}
