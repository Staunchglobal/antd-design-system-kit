'use client'

import * as React from 'react'
import { Switch } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function SwitchDemo() {
  const [checked, setChecked] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  return (
    <ComponentSection id="switch" title="Switch" description="A control for toggling between two states.">
      <Example title="Basic">
        <Switch defaultChecked />
        <Switch />
        <Switch disabled defaultChecked />
        <Switch disabled />
      </Example>

      <Example title="Controlled">
        <Switch checked={checked} onChange={setChecked} />
        <span>{checked ? 'On' : 'Off'}</span>
      </Example>

      <Example title="Sizes">
        <Switch defaultChecked />
        <Switch size="small" defaultChecked />
      </Example>

      <Example title="With icons and loading">
        <Switch
          defaultChecked
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
        <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked />
        <Switch
          loading={loading}
          checked={loading}
          onChange={(next) => setLoading(next)}
        />
      </Example>
    </ComponentSection>
  )
}
