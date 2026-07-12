'use client'

import type { CSSProperties } from 'react'
import { Col, Row } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const cell: CSSProperties = {
  padding: '8px 0',
  textAlign: 'center',
  borderRadius: 4,
  background: '#e6f4ff',
  color: '#1677ff',
  fontSize: 12,
}

export default function GridDemo() {
  return (
    <ComponentSection
      id="grid"
      title="Grid"
      description="A 24-column responsive layout system built on Row and Col, for arranging content in a grid."
    >
      <Example title="Basic columns" contentStyle={{ display: 'block' }}>
        <Row>
          <Col span={8} style={cell}>
            span=8
          </Col>
          <Col span={8} style={{ ...cell, background: '#bae0ff' }}>
            span=8
          </Col>
          <Col span={8} style={cell}>
            span=8
          </Col>
        </Row>
      </Example>

      <Example title="With gutter" contentStyle={{ display: 'block' }}>
        <Row gutter={16}>
          <Col span={6} style={cell}>
            span=6
          </Col>
          <Col span={6} style={cell}>
            span=6
          </Col>
          <Col span={6} style={cell}>
            span=6
          </Col>
          <Col span={6} style={cell}>
            span=6
          </Col>
        </Row>
      </Example>

      <Example title="Responsive spans" description="Resize the window to see columns reflow." contentStyle={{ display: 'block' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} style={cell}>
            xs=24 sm=12 md=8
          </Col>
          <Col xs={24} sm={12} md={8} style={cell}>
            xs=24 sm=12 md=8
          </Col>
          <Col xs={24} sm={24} md={8} style={cell}>
            xs=24 sm=24 md=8
          </Col>
        </Row>
      </Example>

      <Example title="Offset" contentStyle={{ display: 'block' }}>
        <Row>
          <Col span={8} style={cell}>
            span=8
          </Col>
          <Col span={8} offset={8} style={cell}>
            span=8 offset=8
          </Col>
        </Row>
      </Example>
    </ComponentSection>
  )
}
