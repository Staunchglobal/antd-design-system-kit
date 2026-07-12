import * as React from 'react'
import { Space, TreeSelect } from 'antd'
import type { TreeSelectProps } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const treeData: TreeSelectProps['treeData'] = [
  {
    title: 'Engineering',
    value: 'engineering',
    children: [
      { title: 'Frontend', value: 'frontend' },
      { title: 'Backend', value: 'backend' },
      { title: 'Platform', value: 'platform' },
    ],
  },
  {
    title: 'Design',
    value: 'design',
    children: [
      { title: 'Product Design', value: 'product-design' },
      { title: 'Brand', value: 'brand' },
    ],
  },
  {
    title: 'Operations',
    value: 'operations',
    children: [
      { title: 'Support', value: 'support' },
      { title: 'Success', value: 'success' },
    ],
  },
]

export default function TreeSelectDemo() {
  const [single, setSingle] = React.useState<string | undefined>('frontend')
  const [multi, setMulti] = React.useState<string[]>(['frontend', 'design'])

  return (
    <ComponentSection
      id="tree-select"
      title="TreeSelect"
      description="Select values from a hierarchical tree structure."
    >
      <Example title="Basic">
        <TreeSelect
          style={{ width: 260 }}
          value={single}
          treeData={treeData}
          placeholder="Select a team"
          onChange={setSingle}
        />
      </Example>

      <Example title="Multiple with checkboxes">
        <TreeSelect
          style={{ width: 320 }}
          value={multi}
          treeData={treeData}
          treeCheckable
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
          placeholder="Select teams"
          onChange={setMulti}
        />
      </Example>

      <Example title="Sizes and states">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <TreeSelect style={{ width: 260 }} size="large" treeData={treeData} placeholder="Large" />
          <TreeSelect style={{ width: 260 }} size="small" treeData={treeData} placeholder="Small" />
          <TreeSelect style={{ width: 260 }} treeData={treeData} placeholder="Disabled" disabled />
        </Space>
      </Example>
    </ComponentSection>
  )
}
