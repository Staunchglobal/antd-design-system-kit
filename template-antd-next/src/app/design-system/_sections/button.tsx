'use client'

import { Button, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'
import { AppIcon } from '@/components/icons/icon'

export default function ButtonDemo() {
  return (
    <ComponentSection
      id="button"
      title="Button"
      description="To trigger an operation. Types, sizes, states, and icon placement."
    >
      <Example title="Types">
        <Space wrap>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="text">Text</Button>
          <Button type="link">Link</Button>
        </Space>
      </Example>

      <Example title="Sizes">
        <Space wrap align="center">
          <Button type="primary" size="large">
            Large
          </Button>
          <Button type="primary">Middle</Button>
          <Button type="primary" size="small">
            Small
          </Button>
        </Space>
      </Example>

      <Example title="With icon">
        <Space wrap>
          <Button type="primary" icon={<AppIcon name="button.new" />}>
            New
          </Button>
          <Button icon={<AppIcon name="button.download" />}>Download</Button>
          <Button shape="circle" icon={<SearchOutlined />} />
        </Space>
      </Example>

      <Example title="States">
        <Space wrap>
          <Button type="primary" loading>
            Loading
          </Button>
          <Button disabled>Disabled</Button>
          <Button type="primary" danger>
            Danger
          </Button>
        </Space>
      </Example>
    </ComponentSection>
  )
}
