'use client'

import type { CSSProperties } from 'react'
import { Splitter } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const panelContent: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  fontSize: 12,
  color: '#1677ff',
}

export default function SplitterDemo() {
  return (
    <ComponentSection
      id="splitter"
      title="Splitter"
      description="Divides a container into resizable panels the user can drag to reallocate space."
    >
      <Example title="Horizontal" contentStyle={{ display: 'block', height: 160, padding: 0 }}>
        <Splitter style={{ height: 160 }}>
          <Splitter.Panel defaultSize="30%" min="20%" max="70%">
            <div style={panelContent}>Sidebar</div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={panelContent}>Main content</div>
          </Splitter.Panel>
        </Splitter>
      </Example>

      <Example title="Vertical" contentStyle={{ display: 'block', height: 200, padding: 0 }}>
        <Splitter orientation="vertical" style={{ height: 200 }}>
          <Splitter.Panel defaultSize="40%">
            <div style={panelContent}>Top panel</div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={panelContent}>Bottom panel</div>
          </Splitter.Panel>
        </Splitter>
      </Example>

      <Example title="Three panels with collapsible ends" contentStyle={{ display: 'block', height: 160, padding: 0 }}>
        <Splitter style={{ height: 160 }}>
          <Splitter.Panel collapsible defaultSize="20%" min="10%" max="30%">
            <div style={panelContent}>Left</div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={panelContent}>Center</div>
          </Splitter.Panel>
          <Splitter.Panel collapsible defaultSize="20%" min="10%" max="30%">
            <div style={panelContent}>Right</div>
          </Splitter.Panel>
        </Splitter>
      </Example>
    </ComponentSection>
  )
}
