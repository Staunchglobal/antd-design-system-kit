'use client'

import { HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function BreadcrumbDemo() {
  return (
    <ComponentSection
      id="breadcrumb"
      title="Breadcrumb"
      description="Displays the current page's location within a hierarchy, with links back up the chain."
    >
      <Example title="Basic">
        <Breadcrumb
          items={[{ title: 'Home' }, { title: 'Application Center' }, { title: 'Application List' }]}
        />
      </Example>

      <Example title="With links">
        <Breadcrumb
          items={[
            { title: 'Home', href: '#' },
            { title: 'Products', href: '#' },
            { title: 'Design System' },
          ]}
        />
      </Example>

      <Example title="With icons">
        <Breadcrumb
          items={[
            { href: '#', title: <HomeOutlined /> },
            { href: '#', title: (
              <>
                <UserOutlined />
                <span style={{ marginLeft: 4 }}>Account</span>
              </>
            ) },
            { title: (
              <>
                <SettingOutlined />
                <span style={{ marginLeft: 4 }}>Settings</span>
              </>
            ) },
          ]}
        />
      </Example>

      <Example title="With dropdown menu">
        <Breadcrumb
          items={[
            { title: 'Home', href: '#' },
            {
              title: 'Team',
              menu: {
                items: [
                  { key: '1', label: 'Engineering' },
                  { key: '2', label: 'Design' },
                  { key: '3', label: 'Product' },
                ],
              },
            },
            { title: 'Current page' },
          ]}
        />
      </Example>
    </ComponentSection>
  )
}
