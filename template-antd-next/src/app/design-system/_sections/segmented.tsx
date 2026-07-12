'use client'

import { Segmented } from 'antd'
import {
  AppstoreOutlined,
  BarsOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function SegmentedDemo() {
  return (
    <ComponentSection
      id="segmented"
      title="Segmented"
      description="A compact control for switching between a small set of mutually exclusive views."
    >
      <Example title="Basic">
        <Segmented options={['List', 'Kanban', 'Timeline']} />
      </Example>

      <Example title="With icons">
        <Segmented
          options={[
            { label: 'List', value: 'list', icon: <BarsOutlined /> },
            { label: 'Grid', value: 'grid', icon: <AppstoreOutlined /> },
            { label: 'Chart', value: 'chart', icon: <BarChartOutlined /> },
          ]}
        />
      </Example>

      <Example title="Icon only" description="Omit label and rely on a tooltip.">
        <Segmented
          options={[
            { value: 'list', icon: <UnorderedListOutlined />, title: 'List view' },
            { value: 'grid', icon: <AppstoreOutlined />, title: 'Grid view' },
          ]}
        />
      </Example>

      <Example title="Sizes, block, and disabled" contentStyle={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'stretch' }}>
        <Segmented size="large" options={['Daily', 'Weekly', 'Monthly']} />
        <Segmented block options={['Overview', 'Details', 'Settings']} />
        <Segmented disabled options={['On', 'Off']} />
      </Example>
    </ComponentSection>
  )
}
