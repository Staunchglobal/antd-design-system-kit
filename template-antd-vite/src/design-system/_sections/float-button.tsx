import {
  CustomerServiceOutlined,
  MessageOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { FloatButton } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function FloatButtonDemo() {
  return (
    <ComponentSection
      id="float-button"
      title="Float Button"
      description="A floating action button anchored to a corner of its container, for a page's primary or global actions."
    >
      <Example title="Default" contentStyle={{ position: 'relative', height: 160 }}>
        <FloatButton style={{ position: 'absolute', insetInlineEnd: 24, insetBlockEnd: 24 }} />
      </Example>

      <Example title="With icon and type" contentStyle={{ position: 'relative', height: 160 }}>
        <FloatButton
          type="primary"
          icon={<PlusOutlined />}
          style={{ position: 'absolute', insetInlineEnd: 24, insetBlockEnd: 24 }}
        />
      </Example>

      <Example title="With content" contentStyle={{ position: 'relative', height: 160 }}>
        <FloatButton
          icon={<QuestionCircleOutlined />}
          content="Help"
          shape="square"
          style={{ position: 'absolute', insetInlineEnd: 24, insetBlockEnd: 24 }}
        />
      </Example>

      <Example title="Group" contentStyle={{ position: 'relative', height: 220 }}>
        <FloatButton.Group
          shape="circle"
          style={{ position: 'absolute', insetInlineEnd: 24, insetBlockEnd: 24 }}
        >
          <FloatButton icon={<QuestionCircleOutlined />} />
          <FloatButton icon={<MessageOutlined />} />
          <FloatButton icon={<CustomerServiceOutlined />} type="primary" />
        </FloatButton.Group>
      </Example>
    </ComponentSection>
  )
}
