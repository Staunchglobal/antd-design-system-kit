'use client'

import * as React from 'react'
import { ColorPicker, Space } from 'antd'
import type { Color } from 'antd/es/color-picker'

const presets = [
  {
    label: 'Brand',
    colors: ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
  },
  {
    label: 'Grayscale',
    colors: ['#000000', '#434343', '#8c8c8c', '#bfbfbf', '#f5f5f5'],
  },
]

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function ColorPickerDemo() {
  const [color, setColor] = React.useState<Color | string>('#1677ff')

  return (
    <ComponentSection
      id="color-picker"
      title="Color Picker"
      description="Lets users select or input a color, with support for presets, alpha, and multiple formats."
    >
      <Example title="Basic">
        <ColorPicker value={color} onChange={setColor} />
      </Example>

      <Example title="With presets">
        <ColorPicker defaultValue="#1677ff" presets={presets} />
      </Example>

      <Example title="Show text and format options">
        <Space>
          <ColorPicker defaultValue="#1677ff" showText />
          <ColorPicker defaultValue="#1677ff" format="rgb" showText />
        </Space>
      </Example>

      <Example title="Sizes and disabled">
        <Space align="center">
          <ColorPicker defaultValue="#1677ff" size="large" />
          <ColorPicker defaultValue="#1677ff" />
          <ColorPicker defaultValue="#1677ff" size="small" />
          <ColorPicker defaultValue="#1677ff" disabled />
        </Space>
      </Example>
    </ComponentSection>
  )
}
