'use client'

import * as React from 'react'
import { Carousel } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const slideStyle = (background: string): React.CSSProperties => ({
  height: 160,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  fontWeight: 600,
  background,
})

export default function CarouselDemo() {
  return (
    <ComponentSection
      id="carousel"
      title="Carousel"
      description="A rotating panel for cycling through a set of slides."
    >
      <Example title="Basic" contentStyle={{ display: 'block', padding: 0, overflow: 'hidden' }}>
        <Carousel>
          <div>
            <div style={slideStyle('#1677ff')}>Slide 1</div>
          </div>
          <div>
            <div style={slideStyle('#13c2c2')}>Slide 2</div>
          </div>
          <div>
            <div style={slideStyle('#722ed1')}>Slide 3</div>
          </div>
          <div>
            <div style={slideStyle('#eb2f96')}>Slide 4</div>
          </div>
        </Carousel>
      </Example>

      <Example title="Fade effect" contentStyle={{ display: 'block', padding: 0, overflow: 'hidden' }}>
        <Carousel effect="fade" autoplay>
          <div>
            <div style={slideStyle('#fa8c16')}>Fade 1</div>
          </div>
          <div>
            <div style={slideStyle('#52c41a')}>Fade 2</div>
          </div>
          <div>
            <div style={slideStyle('#2f54eb')}>Fade 3</div>
          </div>
        </Carousel>
      </Example>

      <Example title="Dot placement" contentStyle={{ display: 'block', padding: 0, overflow: 'hidden' }}>
        <Carousel dotPlacement="bottom">
          <div>
            <div style={slideStyle('#08979c')}>Top</div>
          </div>
          <div>
            <div style={slideStyle('#d4380d')}>Middle</div>
          </div>
        </Carousel>
      </Example>
    </ComponentSection>
  )
}
