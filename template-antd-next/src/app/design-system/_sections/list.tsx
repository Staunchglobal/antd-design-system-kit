'use client'

import { Avatar, List, Skeleton } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

type Item = {
  title: string
  description: string
}

const dataSource: Item[] = [
  { title: 'Design system kit v1.0', description: 'Initial release with 20 core components.' },
  { title: 'Ant Design v6 migration', description: 'Upgraded showcase components to antd v6.5.0.' },
  { title: 'Dark mode tokens', description: 'Added theme tokens for dark mode support.' },
  { title: 'CLI scaffolding', description: 'Generate a full design-system page in one command.' },
]

export default function ListDemo() {
  return (
    <ComponentSection
      id="list"
      title="List"
      description="Display a collection of structured items, optionally with avatars and metadata."
    >
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <List
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{index + 1}</Avatar>}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Example>

      <Example title="Bordered with pagination" contentStyle={{ display: 'block' }}>
        <List
          bordered
          itemLayout="horizontal"
          dataSource={dataSource}
          pagination={{ pageSize: 2, align: 'center' }}
          renderItem={(item) => (
            <List.Item actions={[<a key="view">view</a>, <a key="edit">edit</a>]}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Example>

      <Example title="Loading state" contentStyle={{ display: 'block' }}>
        <List
          itemLayout="horizontal"
          dataSource={dataSource.slice(0, 2)}
          renderItem={() => (
            <List.Item>
              <Skeleton avatar title paragraph={{ rows: 1 }} active />
            </List.Item>
          )}
        />
      </Example>
    </ComponentSection>
  )
}
