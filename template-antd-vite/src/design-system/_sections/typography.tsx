import { Typography } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const { Title, Paragraph, Text, Link } = Typography

export default function TypographyDemo() {
  return (
    <ComponentSection
      id="typography"
      title="Typography"
      description="Headings, paragraphs, and text styles — driven by the fontFamily/fontSize theme tokens."
    >
      <Example title="Headings">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Title level={1}>h1. Heading</Title>
          <Title level={2}>h2. Heading</Title>
          <Title level={3}>h3. Heading</Title>
          <Title level={4}>h4. Heading</Title>
          <Title level={5}>h5. Heading</Title>
        </div>
      </Example>

      <Example title="Text variants">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text>Default text</Text>
          <Text type="secondary">Secondary text</Text>
          <Text type="success">Success text</Text>
          <Text type="warning">Warning text</Text>
          <Text type="danger">Danger text</Text>
          <Text disabled>Disabled text</Text>
          <Text mark>Marked text</Text>
          <Text code>Code text</Text>
          <Text underline>Underlined text</Text>
          <Text delete>Deleted text</Text>
          <Text strong>Strong text</Text>
          <Link href="#">Link text</Link>
        </div>
      </Example>

      <Example title="Paragraph">
        <Paragraph style={{ maxWidth: 480 }}>
          Ant Design produces a design language for background applications. This paragraph
          demonstrates the default body copy style, wired to the <Text code>fontFamily</Text> and{' '}
          <Text code>fontSize</Text> global tokens.
        </Paragraph>
      </Example>
    </ComponentSection>
  )
}
