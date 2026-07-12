'use client'

import { Mentions } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const teamOptions = [
  { value: 'jane', label: 'Jane Doe' },
  { value: 'sam', label: 'Sam Smith' },
  { value: 'alex', label: 'Alex Kim' },
  { value: 'priya', label: 'Priya Patel' },
]

export default function MentionsDemo() {
  return (
    <ComponentSection
      id="mentions"
      title="Mentions"
      description="A textarea that suggests and inserts @-mentions of people or #-tags as the user types."
    >
      <Example title="Basic">
        <Mentions
          style={{ width: '100%' }}
          placeholder="Type @ to mention a teammate"
          options={teamOptions}
        />
      </Example>

      <Example title="With default value" contentStyle={{ display: 'block' }}>
        <Mentions
          style={{ width: '100%' }}
          defaultValue="Hi @jane, can you review this?"
          options={teamOptions}
        />
      </Example>

      <Example title="Placement and rows">
        <Mentions
          style={{ width: '100%' }}
          rows={3}
          placement="top"
          placeholder="Suggestions open above the cursor"
          options={teamOptions}
        />
      </Example>

      <Example title="Disabled">
        <Mentions
          style={{ width: '100%' }}
          disabled
          defaultValue="@jane thanks for the update!"
          options={teamOptions}
        />
      </Example>
    </ComponentSection>
  )
}
