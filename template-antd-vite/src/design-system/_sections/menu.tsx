import { Menu } from 'antd'
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const items = [
  { key: 'home', icon: <MailOutlined />, label: 'Navigation One' },
  { key: 'apps', icon: <AppstoreOutlined />, label: 'Navigation Two' },
  {
    key: 'sub',
    icon: <SettingOutlined />,
    label: 'Navigation Three',
    children: [
      { key: 'sub-1', label: 'Option 1' },
      { key: 'sub-2', label: 'Option 2' },
      { key: 'sub-3', label: 'Option 3' },
    ],
  },
]

export default function MenuDemo() {
  return (
    <ComponentSection
      id="menu"
      title="Menu"
      description="A versatile menu for navigation, supporting horizontal, vertical, and inline modes."
    >
      <Example title="Horizontal" contentStyle={{ display: 'block' }}>
        <Menu mode="horizontal" defaultSelectedKeys={['home']} items={items} />
      </Example>

      <Example title="Vertical (inline)" contentStyle={{ display: 'block' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['home']}
          defaultOpenKeys={['sub']}
          style={{ width: 256 }}
          items={items}
        />
      </Example>

      <Example title="Dark theme" contentStyle={{ display: 'block' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['apps']}
          items={items}
        />
      </Example>
    </ComponentSection>
  )
}
