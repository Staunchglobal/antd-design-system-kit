'use client'

import * as React from 'react'
import { Slider, Space } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function SliderDemo() {
  const [range, setRange] = React.useState<number[]>([20, 60])

  return (
    <ComponentSection
      id="slider"
      title="Slider"
      description="Drag a handle along a track to select a value or a range of values."
    >
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <Slider defaultValue={30} />
      </Example>

      <Example title="Range" description="Select a range with two handles." contentStyle={{ display: 'block' }}>
        <Slider range value={range} onChange={(v) => setRange(v as number[])} />
      </Example>

      <Example title="With marks" contentStyle={{ display: 'block' }}>
        <Slider
          defaultValue={37}
          marks={{
            0: '0°C',
            26: '26°C',
            37: '37°C',
            100: { style: { color: '#f5222d' }, label: '100°C' },
          }}
        />
      </Example>

      <Example title="Vertical" contentStyle={{ height: 220, alignItems: 'flex-start' }}>
        <Space size={48}>
          <Slider vertical defaultValue={30} />
          <Slider vertical range defaultValue={[20, 50]} />
        </Space>
      </Example>
    </ComponentSection>
  )
}
