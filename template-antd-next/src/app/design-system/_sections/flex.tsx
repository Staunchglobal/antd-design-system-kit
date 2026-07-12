'use client'

import type { CSSProperties } from 'react'
import { Flex } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const box = (width = 80): CSSProperties => ({
  width,
  height: 54,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  background: '#1677ff',
  color: '#fff',
  fontSize: 12,
})

export default function FlexDemo() {
  return (
    <ComponentSection
      id="flex"
      title="Flex"
      description="A thin wrapper around flexbox layout for common gap, alignment, and wrapping needs."
    >
      <Example title="Gap">
        <Flex gap="small" style={{ width: '100%' }}>
          <div style={box()}>1</div>
          <div style={box()}>2</div>
          <div style={box()}>3</div>
        </Flex>
      </Example>

      <Example title="Align">
        <Flex gap="middle" align="center" style={{ width: '100%', height: 100 }}>
          <div style={box()}>Short</div>
          <div style={{ ...box(), height: 80 }}>Tall</div>
          <div style={box()}>Mid</div>
        </Flex>
      </Example>

      <Example title="Justify">
        <Flex gap="small" justify="space-between" style={{ width: '100%' }}>
          <div style={box()}>1</div>
          <div style={box()}>2</div>
          <div style={box()}>3</div>
        </Flex>
      </Example>

      <Example title="Wrap">
        <Flex gap="small" wrap style={{ width: 260 }}>
          <div style={box(90)}>1</div>
          <div style={box(90)}>2</div>
          <div style={box(90)}>3</div>
          <div style={box(90)}>4</div>
        </Flex>
      </Example>
    </ComponentSection>
  )
}
