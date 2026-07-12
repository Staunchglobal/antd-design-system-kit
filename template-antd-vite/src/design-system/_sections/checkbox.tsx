import * as React from 'react'
import { Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const plainOptions = ['Apple', 'Pear', 'Orange']

export default function CheckboxDemo() {
  const [checked, setChecked] = React.useState(true)
  const [indeterminate, setIndeterminate] = React.useState(true)
  const [checkedList, setCheckedList] = React.useState<string[]>(['Apple'])

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions : [])
    setIndeterminate(false)
  }

  return (
    <ComponentSection
      id="checkbox"
      title="Checkbox"
      description="Used for selecting one or more options from a set."
    >
      <Example title="Basic">
        <Checkbox defaultChecked>Checked</Checkbox>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox disabled>Disabled</Checkbox>
        <Checkbox disabled defaultChecked>
          Disabled checked
        </Checkbox>
      </Example>

      <Example title="Controlled">
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        >
          {checked ? 'Checked' : 'Unchecked'}
        </Checkbox>
      </Example>

      <Example title="Checkbox group">
        <Checkbox.Group
          options={plainOptions}
          value={checkedList}
          onChange={(list) => {
            setCheckedList(list as string[])
            setIndeterminate(list.length > 0 && list.length < plainOptions.length)
          }}
        />
      </Example>

      <Example title="Indeterminate (select all)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Checkbox
            indeterminate={indeterminate}
            checked={checkedList.length === plainOptions.length}
            onChange={onCheckAllChange}
          >
            Check all
          </Checkbox>
          <Checkbox.Group
            options={plainOptions}
            value={checkedList}
            onChange={(list) => {
              setCheckedList(list as string[])
              setIndeterminate(list.length > 0 && list.length < plainOptions.length)
            }}
          />
        </div>
      </Example>
    </ComponentSection>
  )
}
