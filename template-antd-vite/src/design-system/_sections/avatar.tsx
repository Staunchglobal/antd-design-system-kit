import { Avatar, Badge, Space } from 'antd'
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function AvatarDemo() {
  return (
    <ComponentSection id="avatar" title="Avatar" description="Represents a user or entity, shown as an image, icon, or letter.">
      <Example title="Sizes">
        <Space size="middle" align="center">
          <Avatar size={64} icon={<UserOutlined />} />
          <Avatar size="large" icon={<UserOutlined />} />
          <Avatar icon={<UserOutlined />} />
          <Avatar size="small" icon={<UserOutlined />} />
        </Space>
      </Example>

      <Example title="Shapes">
        <Space size="middle">
          <Avatar shape="square" size="large" icon={<UserOutlined />} />
          <Avatar shape="circle" size="large" icon={<UserOutlined />} />
        </Space>
      </Example>

      <Example title="Types">
        <Space size="middle">
          <Avatar icon={<UserOutlined />} />
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<AntDesignOutlined />} />
          <Avatar style={{ backgroundColor: '#1677ff' }}>JD</Avatar>
        </Space>
      </Example>

      <Example title="Group with badge">
        <Avatar.Group max={{ count: 3 }}>
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
          <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
          <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
          <Avatar style={{ backgroundColor: '#87d068' }}>L</Avatar>
          <Badge count={1} offset={[-4, 4]}>
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=4" />
          </Badge>
        </Avatar.Group>
      </Example>
    </ComponentSection>
  )
}
