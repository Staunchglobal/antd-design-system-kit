import { Anchor } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function AnchorDemo() {
  return (
    <ComponentSection
      id="anchor"
      title="Anchor"
      description="Hyperlinks to scroll to a location on the current page, highlighting the active section."
    >
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <Anchor
          getContainer={() => window}
          items={[
            { key: 'overview', href: '#anchor-demo-overview', title: 'Overview' },
            { key: 'guide', href: '#anchor-demo-guide', title: 'Guide' },
            { key: 'api', href: '#anchor-demo-api', title: 'API' },
          ]}
        />
      </Example>

      <Example title="With sub-items" contentStyle={{ display: 'block' }}>
        <Anchor getContainer={() => window}>
          <Anchor.Link href="#anchor-demo-components" title="Components">
            <Anchor.Link href="#anchor-demo-button" title="Button" />
            <Anchor.Link href="#anchor-demo-card" title="Card" />
          </Anchor.Link>
          <Anchor.Link href="#anchor-demo-changelog" title="Changelog" />
        </Anchor>
      </Example>

      <Example title="Horizontal" contentStyle={{ display: 'block' }}>
        <Anchor
          direction="horizontal"
          getContainer={() => window}
          items={[
            { key: 'design', href: '#anchor-demo-design', title: 'Design' },
            { key: 'development', href: '#anchor-demo-development', title: 'Development' },
            { key: 'resources', href: '#anchor-demo-resources', title: 'Resources' },
          ]}
        />
      </Example>
    </ComponentSection>
  )
}
