'use client'

import * as React from 'react'
import { Radio } from 'antd'
import type { RadioChangeEvent } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function RadioDemo() {
  const [value, setValue] = React.useState('apple')

  const onChange = (e: RadioChangeEvent) => setValue(e.target.value)

  return (
    <ComponentSection id="radio" title="Radio" description="Used for selecting a single option from a set.">
      <Example title="Basic">
        <Radio.Group onChange={onChange} value={value}>
          <Radio value="apple">Apple</Radio>
          <Radio value="pear">Pear</Radio>
          <Radio value="orange">Orange</Radio>
          <Radio value="grape" disabled>
            Grape (disabled)
          </Radio>
        </Radio.Group>
      </Example>

      <Example title="Button style">
        <Radio.Group defaultValue="medium" optionType="button">
          <Radio.Button value="small">Small</Radio.Button>
          <Radio.Button value="medium">Medium</Radio.Button>
          <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
      </Example>

      <Example title="Solid button style">
        <Radio.Group defaultValue="week" optionType="button" buttonStyle="solid">
          <Radio.Button value="day">Day</Radio.Button>
          <Radio.Button value="week">Week</Radio.Button>
          <Radio.Button value="month">Month</Radio.Button>
          <Radio.Button value="year">Year</Radio.Button>
        </Radio.Group>
      </Example>

      <Example title="Vertical">
        <Radio.Group defaultValue="a">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Radio value="a">Option A</Radio>
            <Radio value="b">Option B</Radio>
            <Radio value="c">Option C</Radio>
          </div>
        </Radio.Group>
      </Example>
    </ComponentSection>
  )
}
