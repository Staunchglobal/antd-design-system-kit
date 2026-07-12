'use client'

import { Tabs } from 'antd'
import { AppstoreOutlined, BellOutlined, UserOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const basicItems = [
  { key: '1', label: 'Tab 1', children: 'Content of Tab Pane 1' },
  { key: '2', label: 'Tab 2', children: 'Content of Tab Pane 2' },
  { key: '3', label: 'Tab 3', children: 'Content of Tab Pane 3' },
]

const iconItems = [
  { key: 'profile', label: 'Profile', icon: <UserOutlined />, children: 'Profile settings content.' },
  { key: 'notifications', label: 'Notifications', icon: <BellOutlined />, children: 'Notification preferences.' },
  { key: 'apps', label: 'Apps', icon: <AppstoreOutlined />, children: 'Connected applications.' },
]

export default function TabsDemo() {
  return (
    <ComponentSection id="tabs" title="Tabs" description="Organize content into separate views that share the same space.">
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <Tabs defaultActiveKey="1" items={basicItems} />
      </Example>

      <Example title="Card type" contentStyle={{ display: 'block' }}>
        <Tabs type="card" defaultActiveKey="1" items={basicItems} />
      </Example>

      <Example title="With icons" contentStyle={{ display: 'block' }}>
        <Tabs defaultActiveKey="profile" items={iconItems} />
      </Example>

      <Example title="Sizes">
        <Tabs size="small" defaultActiveKey="1" items={basicItems.slice(0, 2)} />
        <Tabs size="large" defaultActiveKey="1" items={basicItems.slice(0, 2)} />
      </Example>
    </ComponentSection>
  )
}
