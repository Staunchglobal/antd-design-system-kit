import * as React from 'react'
import { Button, Skeleton, Space, Switch } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function SkeletonDemo() {
  const [loading, setLoading] = React.useState(true)

  return (
    <ComponentSection id="skeleton" title="Skeleton" description="A placeholder shown while content is still loading.">
      <Example title="Basic">
        <Skeleton />
      </Example>

      <Example title="Active animation">
        <Skeleton active />
      </Example>

      <Example title="Avatar and paragraph">
        <Space orientation="vertical" style={{ width: '100%' }} size="large">
          <Skeleton avatar paragraph={{ rows: 4 }} active />
          <Skeleton avatar={{ shape: 'square' }} paragraph={{ rows: 2 }} title={false} active />
        </Space>
      </Example>

      <Example title="Toggle loading state">
        <Space orientation="vertical" style={{ width: '100%' }} size="middle">
          <Switch checked={loading} onChange={setLoading} checkedChildren="Loading" unCheckedChildren="Loaded" />
          <Skeleton loading={loading} active avatar>
            <Skeleton.Avatar active size="large" style={{ marginRight: 12 }} />
            <Button type="primary">Content is ready</Button>
          </Skeleton>
        </Space>
      </Example>
    </ComponentSection>
  )
}
