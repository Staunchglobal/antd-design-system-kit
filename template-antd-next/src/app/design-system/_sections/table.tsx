'use client'

import { Space, Table, Tag } from 'antd'
import type { TableColumnsType } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

type Person = {
  key: string
  name: string
  age: number
  role: string
  status: 'active' | 'invited' | 'suspended'
}

const columns: TableColumnsType<Person> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: Person['status']) => {
      const color = status === 'active' ? 'green' : status === 'invited' ? 'blue' : 'red'
      return <Tag color={color}>{status.toUpperCase()}</Tag>
    },
  },
]

const dataSource: Person[] = [
  { key: '1', name: 'Jane Doe', age: 32, role: 'Product Designer', status: 'active' },
  { key: '2', name: 'John Smith', age: 28, role: 'Engineer', status: 'invited' },
  { key: '3', name: 'Amara Okafor', age: 41, role: 'Engineering Manager', status: 'active' },
  { key: '4', name: 'Liam Chen', age: 24, role: 'Support Specialist', status: 'suspended' },
]

export default function TableDemo() {
  return (
    <ComponentSection id="table" title="Table" description="Display structured, sortable, and selectable tabular data.">
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <Table<Person> columns={columns} dataSource={dataSource} pagination={false} />
      </Example>

      <Example title="With row selection" contentStyle={{ display: 'block' }}>
        <Table<Person>
          rowSelection={{ type: 'checkbox' }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </Example>

      <Example title="With pagination" contentStyle={{ display: 'block' }}>
        <Table<Person> columns={columns} dataSource={dataSource} pagination={{ pageSize: 2 }} />
      </Example>

      <Example title="Compact size">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Table<Person> size="small" columns={columns} dataSource={dataSource} pagination={false} />
        </Space>
      </Example>
    </ComponentSection>
  )
}
