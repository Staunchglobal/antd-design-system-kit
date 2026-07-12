import { Divider, Typography } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const { Text } = Typography

export default function DividerDemo() {
  return (
    <ComponentSection id="divider" title="Divider" description="A divider line separates different content.">
      <Example title="Horizontal">
        <div style={{ width: '100%' }}>
          <Text>First section of content</Text>
          <Divider />
          <Text>Second section of content</Text>
        </div>
      </Example>

      <Example title="With text">
        <div style={{ width: '100%' }}>
          <Divider>Center Text</Divider>
          <Divider titlePlacement="left">Left Text</Divider>
          <Divider titlePlacement="right">Right Text</Divider>
        </div>
      </Example>

      <Example title="Dashed">
        <div style={{ width: '100%' }}>
          <Divider dashed>Dashed</Divider>
        </div>
      </Example>

      <Example title="Vertical">
        <div>
          <Text>Text</Text>
          <Divider orientation="vertical" />
          <Text>Link</Text>
          <Divider orientation="vertical" />
          <Text>Link</Text>
        </div>
      </Example>
    </ComponentSection>
  )
}
