import { Collapse } from 'antd'
import type { CollapseProps } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'What is a design system?',
    children: (
      <p style={{ margin: 0 }}>
        A design system is a set of reusable components and guidelines that help teams build consistent
        products faster.
      </p>
    ),
  },
  {
    key: '2',
    label: 'Which frameworks are supported?',
    children: <p style={{ margin: 0 }}>Both Next.js (App Router) and Vite-based React apps are supported.</p>,
  },
  {
    key: '3',
    label: 'Can panels be disabled?',
    children: <p style={{ margin: 0 }}>Yes, an individual panel can be disabled or collapsible: &quot;header&quot;.</p>,
    collapsible: 'header',
  },
]

export default function CollapseDemo() {
  return (
    <ComponentSection
      id="collapse"
      title="Collapse"
      description="Show and hide content in collapsible panels."
    >
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <Collapse items={items} defaultActiveKey={['1']} />
      </Example>

      <Example title="Accordion" description="Only one panel can stay open at a time." contentStyle={{ display: 'block' }}>
        <Collapse items={items} accordion defaultActiveKey={['1']} />
      </Example>

      <Example title="Ghost / borderless" contentStyle={{ display: 'block' }}>
        <Collapse items={items} ghost defaultActiveKey={['2']} />
      </Example>
    </ComponentSection>
  )
}
