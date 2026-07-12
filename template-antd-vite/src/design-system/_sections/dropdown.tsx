import {
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Space } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function DropdownDemo() {
  return (
    <ComponentSection
      id="dropdown"
      title="Dropdown"
      description="Shows a menu of actions or links when triggered by a click, hover, or right-click."
    >
      <Example title="Basic">
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'Edit', icon: <EditOutlined /> },
              { key: '2', label: 'Delete', icon: <DeleteOutlined />, danger: true },
              { type: 'divider' },
              { key: '3', label: 'Profile', icon: <UserOutlined /> },
            ],
          }}
        >
          <Button>
            <Space>
              Actions
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Example>

      <Example title="Trigger types" description="Click, hover, or context menu.">
        <Space wrap>
          <Dropdown
            trigger={['click']}
            menu={{ items: [{ key: '1', label: 'Option 1' }, { key: '2', label: 'Option 2' }] }}
          >
            <Button>Click me</Button>
          </Dropdown>
          <Dropdown
            trigger={['hover']}
            menu={{ items: [{ key: '1', label: 'Option 1' }, { key: '2', label: 'Option 2' }] }}
          >
            <Button>Hover me</Button>
          </Dropdown>
          <Dropdown
            trigger={['contextMenu']}
            menu={{ items: [{ key: '1', label: 'Option 1' }, { key: '2', label: 'Option 2' }] }}
          >
            <Button>Right click me</Button>
          </Dropdown>
        </Space>
      </Example>

      <Example title="Icon-only trigger">
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'View details' },
              { key: '2', label: 'Duplicate' },
              { key: '3', label: 'Remove', danger: true },
            ],
          }}
          placement="bottomRight"
        >
          <Button shape="circle" icon={<EllipsisOutlined />} />
        </Dropdown>
      </Example>

      <Example title="Button with dropdown">
        <Space.Compact>
          <Button type="primary">Primary action</Button>
          <Dropdown
            menu={{
              items: [
                { key: '1', label: 'Second action' },
                { key: '2', label: 'Third action' },
              ],
            }}
          >
            <Button type="primary" icon={<DownOutlined />} />
          </Dropdown>
        </Space.Compact>
      </Example>
    </ComponentSection>
  )
}
