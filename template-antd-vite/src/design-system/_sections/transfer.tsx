import * as React from 'react'
import { Transfer } from 'antd'
import type { TransferProps } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

interface RecordType {
  key: string
  title: string
  description: string
}

const mockData: RecordType[] = Array.from({ length: 10 }).map((_, i) => ({
  key: String(i),
  title: `Content ${i + 1}`,
  description: `Description of content ${i + 1}`,
}))

const initialTargetKeys = mockData.filter((item) => Number(item.key) > 6).map((item) => item.key)

export default function TransferDemo() {
  const [targetKeys, setTargetKeys] = React.useState<string[]>(initialTargetKeys)
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([])

  const onChange: TransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys as string[])
  }

  const onSelectChange: TransferProps['onSelectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys] as string[])
  }

  return (
    <ComponentSection
      id="transfer"
      title="Transfer"
      description="Move items between two lists with checkbox selection."
    >
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <Transfer
          dataSource={mockData}
          titles={['Source', 'Target']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          render={(item) => item.title}
        />
      </Example>

      <Example title="With search" contentStyle={{ display: 'block' }}>
        <Transfer
          dataSource={mockData}
          showSearch
          titles={['Available', 'Selected']}
          targetKeys={targetKeys}
          onChange={onChange}
          render={(item) => `${item.title} — ${item.description}`}
        />
      </Example>

      <Example title="Disabled" contentStyle={{ display: 'block' }}>
        <Transfer dataSource={mockData} disabled targetKeys={initialTargetKeys} render={(item) => item.title} />
      </Example>
    </ComponentSection>
  )
}
