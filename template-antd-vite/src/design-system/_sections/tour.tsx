import * as React from 'react'
import { Button, Space, Tour } from 'antd'
import type { TourProps } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function TourDemo() {
  const [defaultOpen, setDefaultOpen] = React.useState(false)
  const [primaryOpen, setPrimaryOpen] = React.useState(false)
  const step1Ref = React.useRef<HTMLButtonElement>(null)
  const step2Ref = React.useRef<HTMLButtonElement>(null)
  const step3Ref = React.useRef<HTMLButtonElement>(null)

  const steps: TourProps['steps'] = [
    {
      title: 'Create',
      description: 'Click here to create a new item.',
      target: () => step1Ref.current!,
    },
    {
      title: 'Save',
      description: 'Save your changes with this button.',
      target: () => step2Ref.current!,
    },
    {
      title: 'Publish',
      description: 'Finally, publish it for everyone to see.',
      target: () => step3Ref.current!,
    },
  ]

  return (
    <ComponentSection
      id="tour"
      title="Tour"
      description="A guided tour that walks users through a sequence of features on the page."
    >
      <Example title="Guided tour over three actions">
        <Space wrap>
          <Button ref={step1Ref}>Create</Button>
          <Button ref={step2Ref}>Save</Button>
          <Button ref={step3Ref} type="primary">
            Publish
          </Button>
        </Space>
        <Button type="link" onClick={() => setDefaultOpen(true)}>
          Begin tour
        </Button>
        <Tour open={defaultOpen} onClose={() => setDefaultOpen(false)} steps={steps} />
      </Example>

      <Example title="Primary type">
        <Button onClick={() => setPrimaryOpen(true)}>Replay tour (primary style)</Button>
        <Tour open={primaryOpen} onClose={() => setPrimaryOpen(false)} steps={steps} type="primary" />
      </Example>
    </ComponentSection>
  )
}
