'use client'

import {
  BellOutlined,
  CheckCircleTwoTone,
  HeartTwoTone,
  HomeOutlined,
  LoadingOutlined,
  SettingFilled,
  SmileOutlined,
  StarFilled,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Space, Typography } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function IconDemo() {
  return (
    <ComponentSection
      id="icon"
      title="Icon"
      description="Icons from @ant-design/icons, used across buttons, menus, and inputs. Outlined, filled, and two-tone styles."
    >
      <Example title="Common icons">
        <Space size="large" wrap>
          <Space orientation="vertical" align="center" size={4}>
            <HomeOutlined style={{ fontSize: 20 }} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              HomeOutlined
            </Typography.Text>
          </Space>
          <Space orientation="vertical" align="center" size={4}>
            <UserOutlined style={{ fontSize: 20 }} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              UserOutlined
            </Typography.Text>
          </Space>
          <Space orientation="vertical" align="center" size={4}>
            <SettingFilled style={{ fontSize: 20 }} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              SettingFilled
            </Typography.Text>
          </Space>
          <Space orientation="vertical" align="center" size={4}>
            <HeartTwoTone style={{ fontSize: 20 }} twoToneColor="#eb2f96" />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              HeartTwoTone
            </Typography.Text>
          </Space>
          <Space orientation="vertical" align="center" size={4}>
            <StarFilled style={{ fontSize: 20, color: '#fadb14' }} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              StarFilled
            </Typography.Text>
          </Space>
          <Space orientation="vertical" align="center" size={4}>
            <CheckCircleTwoTone style={{ fontSize: 20 }} twoToneColor="#52c41a" />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              CheckCircleTwoTone
            </Typography.Text>
          </Space>
          <Space orientation="vertical" align="center" size={4}>
            <BellOutlined style={{ fontSize: 20 }} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              BellOutlined
            </Typography.Text>
          </Space>
          <Space orientation="vertical" align="center" size={4}>
            <SmileOutlined style={{ fontSize: 20 }} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              SmileOutlined
            </Typography.Text>
          </Space>
        </Space>
      </Example>

      <Example title="Sizes">
        <Space size="large" align="center">
          <UserOutlined style={{ fontSize: 14 }} />
          <UserOutlined style={{ fontSize: 20 }} />
          <UserOutlined style={{ fontSize: 28 }} />
          <UserOutlined style={{ fontSize: 40 }} />
        </Space>
      </Example>

      <Example title="Color">
        <Space size="large" align="center">
          <HomeOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          <HomeOutlined style={{ fontSize: 24, color: '#52c41a' }} />
          <HomeOutlined style={{ fontSize: 24, color: '#faad14' }} />
          <HomeOutlined style={{ fontSize: 24, color: '#f5222d' }} />
        </Space>
      </Example>

      <Example title="Spin">
        <Space size="large" align="center">
          <SyncOutlined spin style={{ fontSize: 24 }} />
          <LoadingOutlined spin style={{ fontSize: 24 }} />
        </Space>
      </Example>
    </ComponentSection>
  )
}
