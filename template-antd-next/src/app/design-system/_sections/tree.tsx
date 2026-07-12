'use client'

import { Tree } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const treeData = [
  {
    title: 'Documents',
    key: '0-0',
    children: [
      {
        title: 'Design',
        key: '0-0-0',
        children: [
          { title: 'wireframes.fig', key: '0-0-0-0' },
          { title: 'brand-guide.pdf', key: '0-0-0-1' },
        ],
      },
      {
        title: 'Engineering',
        key: '0-0-1',
        children: [
          { title: 'architecture.md', key: '0-0-1-0' },
          { title: 'runbook.md', key: '0-0-1-1' },
        ],
      },
    ],
  },
  {
    title: 'Archive',
    key: '0-1',
    children: [{ title: '2025-notes.txt', key: '0-1-0' }],
  },
]

export default function TreeDemo() {
  return (
    <ComponentSection id="tree" title="Tree" description="Displays hierarchical data in a nested, expandable structure.">
      <Example title="Basic">
        <Tree
          style={{ width: '100%' }}
          showLine
          defaultExpandedKeys={['0-0']}
          treeData={treeData}
        />
      </Example>

      <Example title="Checkable">
        <Tree
          style={{ width: '100%' }}
          checkable
          defaultExpandedKeys={['0-0', '0-0-0']}
          defaultCheckedKeys={['0-0-0-0']}
          treeData={treeData}
        />
      </Example>

      <Example title="Selectable, disabled node">
        <Tree
          style={{ width: '100%' }}
          defaultExpandedKeys={['0-0']}
          treeData={[
            {
              title: 'Team',
              key: 't-0',
              children: [
                { title: 'Active member', key: 't-0-0' },
                { title: 'Suspended member', key: 't-0-1', disabled: true },
              ],
            },
          ]}
        />
      </Example>
    </ComponentSection>
  )
}
