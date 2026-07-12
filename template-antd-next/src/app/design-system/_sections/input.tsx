'use client'

import { Input, Space } from 'antd'
import { MailOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const { TextArea, Search, Password } = Input

export default function InputDemo() {
  return (
    <ComponentSection id="input" title="Input" description="A basic widget for getting user text input.">
      <Example title="Variants">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
          <Input placeholder="Basic input" prefix={<UserOutlined />} />
          <Password placeholder="Enter password" />
          <Search placeholder="Search..." enterButton />
          <TextArea rows={3} placeholder="Multi-line text area" />
        </div>
      </Example>

      <Example title="Sizes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
          <Input size="large" placeholder="Large" prefix={<MailOutlined />} />
          <Input placeholder="Middle (default)" prefix={<MailOutlined />} />
          <Input size="small" placeholder="Small" prefix={<MailOutlined />} />
        </div>
      </Example>

      <Example title="With suffix / addons">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
          <Input suffix={<SearchOutlined />} placeholder="Suffix icon" />
          <Space.Compact style={{ width: '100%' }}>
            <Input style={{ width: 90, flex: 'none' }} defaultValue="https://" disabled />
            <Input placeholder="mysite" />
            <Input style={{ width: 70, flex: 'none' }} defaultValue=".com" disabled />
          </Space.Compact>
        </div>
      </Example>

      <Example title="States">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
          <Input placeholder="Allow clear" allowClear defaultValue="Clearable text" />
          <Input placeholder="Disabled" disabled />
          <Input status="error" placeholder="Error status" />
          <Input status="warning" placeholder="Warning status" />
        </div>
      </Example>
    </ComponentSection>
  )
}
