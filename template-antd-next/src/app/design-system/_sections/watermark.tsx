'use client'

import { Typography, Watermark } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function WatermarkDemo() {
  return (
    <ComponentSection id="watermark" title="Watermark" description="Overlays repeated text or an image across a block of content, typically for confidentiality or branding.">
      <Example title="Text watermark">
        <Watermark content={['Staunch Inc.', 'Confidential']}>
          <div style={{ width: '100%', minHeight: 200, padding: 24 }}>
            <Typography.Title level={4}>Quarterly report</Typography.Title>
            <Typography.Paragraph>
              This document contains sensitive financial figures and is intended only for internal review.
            </Typography.Paragraph>
          </div>
        </Watermark>
      </Example>

      <Example title="Custom font">
        <Watermark
          content="DRAFT"
          font={{ color: 'rgba(255, 0, 0, 0.15)', fontSize: 32, fontWeight: 'bold' }}
          rotate={-15}
        >
          <div style={{ width: '100%', minHeight: 160, padding: 24 }}>
            <Typography.Paragraph>
              This proposal has not yet been finalized and is subject to change.
            </Typography.Paragraph>
          </div>
        </Watermark>
      </Example>
    </ComponentSection>
  )
}
