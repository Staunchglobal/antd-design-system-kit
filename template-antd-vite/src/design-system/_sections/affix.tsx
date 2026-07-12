import * as React from 'react'
import { Affix, Button, Typography } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function AffixDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <ComponentSection id="affix" title="Affix" description="Pins an element in place once the page is scrolled past a given offset.">
      <Example title="Affix with offsetTop" description="Scroll within the box below — the button sticks 16px from the top.">
        <div
          ref={containerRef}
          style={{ height: 240, overflowY: 'auto', width: '100%', border: '1px dashed var(--ant-color-border, #d9d9d9)', padding: 16 }}
        >
          <Affix offsetTop={16} target={() => containerRef.current}>
            <Button type="primary">Affixed button (offsetTop: 16)</Button>
          </Affix>
          <Typography.Paragraph style={{ marginTop: 16 }}>
            {Array.from({ length: 12 })
              .map(() => 'Scroll down to see the button stay pinned near the top of this container. ')
              .join('')}
          </Typography.Paragraph>
        </div>
      </Example>
    </ComponentSection>
  )
}
