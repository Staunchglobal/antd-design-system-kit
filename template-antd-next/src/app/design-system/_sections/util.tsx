'use client'

import { Typography } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function UtilDemo() {
  return (
    <ComponentSection
      id="util"
      title="Util"
      description="antd's internal utility namespace — included here only for parity with the official component list."
    >
      <Example title="No public API">
        <Typography.Paragraph style={{ marginBottom: 0 }}>
          <code>_util</code> is antd&apos;s internal-only utility namespace (helpers for hooks, warnings, colors, etc.). It
          is not exported as a public component and has no props to demo — it exists in this showcase purely to keep
          parity with antd&apos;s official component listing.
        </Typography.Paragraph>
      </Example>
    </ComponentSection>
  )
}
