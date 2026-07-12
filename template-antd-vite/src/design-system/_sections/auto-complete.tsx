import * as React from 'react'
import { AutoComplete, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
  { value: 'Warren Street' },
]

export default function AutoCompleteDemo() {
  const [emailValue, setEmailValue] = React.useState('')

  const onEmailSearch = (text: string) => {
    if (!text || text.includes('@')) {
      setEmailValue(text)
      return
    }
    setEmailValue(text)
  }

  const emailAutoOptions = emailValue.includes('@')
    ? []
    : ['gmail.com', 'outlook.com', 'yahoo.com'].map((domain) => ({
        value: `${emailValue}@${domain}`,
      }))

  return (
    <ComponentSection
      id="auto-complete"
      title="AutoComplete"
      description="A free-form text input with suggested completions, combining an Input with a dropdown of options."
    >
      <Example title="Basic">
        <AutoComplete
          options={options}
          style={{ width: 240 }}
          placeholder="Start typing an address"
          filterOption={(inputValue, option) =>
            (option?.value ?? '').toUpperCase().includes(inputValue.toUpperCase())
          }
        />
      </Example>

      <Example title="With custom input">
        <AutoComplete
          value={emailValue}
          options={emailAutoOptions}
          style={{ width: 240 }}
          onSearch={onEmailSearch}
          onChange={setEmailValue}
        >
          <Input placeholder="Enter your email" prefix={<SearchOutlined />} />
        </AutoComplete>
      </Example>

      <Example title="Sizes">
        <AutoComplete options={options} size="large" style={{ width: 200 }} placeholder="Large" />
        <AutoComplete options={options} style={{ width: 200 }} placeholder="Middle" />
        <AutoComplete options={options} size="small" style={{ width: 200 }} placeholder="Small" />
      </Example>
    </ComponentSection>
  )
}
