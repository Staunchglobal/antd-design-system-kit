import { Select } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const cityOptions = [
  { value: 'nyc', label: 'New York' },
  { value: 'sf', label: 'San Francisco' },
  { value: 'chi', label: 'Chicago' },
  { value: 'aus', label: 'Austin' },
]

const tagOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]

export default function SelectDemo() {
  return (
    <ComponentSection id="select" title="Select" description="A dropdown for selecting one value from a list of options.">
      <Example title="Basic">
        <Select
          style={{ width: 220 }}
          placeholder="Select a city"
          options={cityOptions}
          defaultValue="nyc"
        />
      </Example>

      <Example title="Multiple">
        <Select
          mode="multiple"
          style={{ width: 320 }}
          placeholder="Select frameworks"
          options={tagOptions}
          defaultValue={['react', 'vue']}
        />
      </Example>

      <Example title="Sizes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select size="large" style={{ width: 220 }} options={cityOptions} defaultValue="nyc" />
          <Select style={{ width: 220 }} options={cityOptions} defaultValue="nyc" />
          <Select size="small" style={{ width: 220 }} options={cityOptions} defaultValue="nyc" />
        </div>
      </Example>

      <Example title="States">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select style={{ width: 220 }} options={cityOptions} defaultValue="sf" disabled />
          <Select style={{ width: 220 }} options={cityOptions} loading placeholder="Loading..." />
          <Select style={{ width: 220 }} options={cityOptions} allowClear defaultValue="chi" />
        </div>
      </Example>
    </ComponentSection>
  )
}
