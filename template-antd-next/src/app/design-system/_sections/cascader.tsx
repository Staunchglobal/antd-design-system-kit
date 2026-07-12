'use client'

import { Cascader } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const options = [
  {
    value: 'north-america',
    label: 'North America',
    children: [
      {
        value: 'united-states',
        label: 'United States',
        children: [
          { value: 'new-york', label: 'New York' },
          { value: 'los-angeles', label: 'Los Angeles' },
        ],
      },
      {
        value: 'canada',
        label: 'Canada',
        children: [
          { value: 'toronto', label: 'Toronto' },
          { value: 'vancouver', label: 'Vancouver' },
        ],
      },
    ],
  },
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'united-kingdom',
        label: 'United Kingdom',
        children: [
          { value: 'london', label: 'London' },
          { value: 'manchester', label: 'Manchester' },
        ],
      },
      {
        value: 'germany',
        label: 'Germany',
        children: [
          { value: 'berlin', label: 'Berlin' },
          { value: 'munich', label: 'Munich' },
        ],
      },
    ],
  },
]

export default function CascaderDemo() {
  return (
    <ComponentSection
      id="cascader"
      title="Cascader"
      description="Selects a value from a set of associated, cascading options across multiple levels."
    >
      <Example title="Basic">
        <Cascader options={options} style={{ width: 260 }} placeholder="Select a location" />
      </Example>

      <Example title="With search">
        <Cascader
          options={options}
          showSearch
          style={{ width: 260 }}
          placeholder="Search a location"
        />
      </Example>

      <Example title="Multiple selection">
        <Cascader
          options={options}
          multiple
          maxTagCount="responsive"
          style={{ width: 320 }}
          placeholder="Select multiple locations"
        />
      </Example>

      <Example title="Sizes">
        <Cascader options={options} size="large" style={{ width: 200 }} placeholder="Large" />
        <Cascader options={options} style={{ width: 200 }} placeholder="Middle" />
        <Cascader options={options} size="small" style={{ width: 200 }} placeholder="Small" />
      </Example>
    </ComponentSection>
  )
}
