'use client'

import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const { Header, Sider, Content, Footer } = Layout

export default function LayoutDemo() {
  return (
    <ComponentSection
      id="layout"
      title="Layout"
      description="Header, Sider, Content, and Footer primitives for building an application shell."
    >
      <Example title="Basic app shell" contentStyle={{ display: 'block', padding: 0, overflow: 'hidden' }}>
        <Layout style={{ borderRadius: 8, overflow: 'hidden' }}>
          <Header style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            <div style={{ color: '#fff', fontWeight: 600, marginRight: 24 }}>Acme</div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ flex: 1, minWidth: 0 }}
              items={[
                { key: '1', label: 'Dashboard' },
                { key: '2', label: 'Reports' },
                { key: '3', label: 'Settings' },
              ]}
            />
          </Header>
          <Layout>
            <Sider width={200} theme="light">
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderInlineEnd: 0 }}
                items={[
                  { key: '1', icon: <UserOutlined />, label: 'Users' },
                  { key: '2', icon: <LaptopOutlined />, label: 'Devices' },
                  { key: '3', icon: <NotificationOutlined />, label: 'Alerts' },
                ]}
              />
            </Sider>
            <Content style={{ padding: 24, minHeight: 240, background: '#fff' }}>
              Main content area
            </Content>
          </Layout>
          <Footer style={{ textAlign: 'center' }}>Acme Inc. ©{new Date().getFullYear()}</Footer>
        </Layout>
      </Example>

      <Example title="Collapsible sider" contentStyle={{ display: 'block', padding: 0, overflow: 'hidden' }}>
        <Layout style={{ borderRadius: 8, overflow: 'hidden', minHeight: 220 }}>
          <Sider collapsible theme="dark">
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                { key: '1', icon: <UserOutlined />, label: 'Profile' },
                { key: '2', icon: <LaptopOutlined />, label: 'Workspace' },
              ]}
            />
          </Sider>
          <Content style={{ padding: 24, background: '#fff' }}>Collapse the sider using its trigger.</Content>
        </Layout>
      </Example>
    </ComponentSection>
  )
}
