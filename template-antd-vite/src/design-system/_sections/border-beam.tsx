import { BorderBeam, Card, Space, Typography } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function BorderBeamDemo() {
  return (
    <ComponentSection
      id="border-beam"
      title="Border Beam"
      description="A decorative animated light that travels along the border of its container, useful for drawing attention to a card or panel."
    >
      <Example title="Default">
        <Card style={{ width: 280, position: 'relative' }}>
          <BorderBeam />
          <Typography.Text strong>Featured plan</Typography.Text>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            An animated beam travels around this card&apos;s border.
          </Typography.Paragraph>
        </Card>
      </Example>

      <Example title="Custom color and speed">
        <Space wrap size="large">
          <Card style={{ width: 240, position: 'relative' }}>
            <BorderBeam color="#eb2f96" duration={3} size={120} />
            <Typography.Text strong>Fast pink beam</Typography.Text>
          </Card>
          <Card style={{ width: 240, position: 'relative' }}>
            <BorderBeam
              color={[
                { color: '#1677ff', percent: 0 },
                { color: '#722ed1', percent: 100 },
              ]}
              duration={8}
              lineWidth={2}
            />
            <Typography.Text strong>Gradient beam</Typography.Text>
          </Card>
        </Space>
      </Example>
    </ComponentSection>
  )
}
