import * as React from 'react'
import { Rate, Space, Typography } from 'antd'
import { HeartFilled } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function RateDemo() {
  const [value, setValue] = React.useState(3)

  return (
    <ComponentSection
      id="rate"
      title="Rate"
      description="A rating component for capturing quick, subjective feedback."
    >
      <Example title="Basic">
        <Rate value={value} onChange={setValue} />
        <Typography.Text type="secondary">{value} / 5</Typography.Text>
      </Example>

      <Example title="Half star" description="Allow selecting half a star for finer-grained ratings.">
        <Rate allowHalf defaultValue={2.5} />
      </Example>

      <Example title="Custom character" description="Any node can replace the default star.">
        <Space orientation="vertical" size={16}>
          <Rate character={<HeartFilled />} defaultValue={2} style={{ color: '#eb2f96' }} />
          <Rate character="A" defaultValue={3} allowHalf={false} />
        </Space>
      </Example>

      <Example title="States">
        <Space orientation="vertical" size={16}>
          <Rate disabled defaultValue={2} />
          <Rate count={10} defaultValue={6} />
        </Space>
      </Example>
    </ComponentSection>
  )
}
