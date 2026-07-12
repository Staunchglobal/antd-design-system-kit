'use client'

import * as React from 'react'
import { Pagination } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function PaginationDemo() {
  const [current, setCurrent] = React.useState(3)

  return (
    <ComponentSection
      id="pagination"
      title="Pagination"
      description="Splits large lists of data into pages, and lets the user jump between them."
    >
      <Example title="Basic">
        <Pagination current={current} onChange={setCurrent} total={500} />
      </Example>

      <Example title="Sizes">
        <Pagination defaultCurrent={1} total={50} />
      </Example>

      <Example title="With size changer and quick jumper">
        <Pagination
          defaultCurrent={2}
          total={200}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `Total ${total} items`}
        />
      </Example>

      <Example title="Simple mode">
        <Pagination simple defaultCurrent={2} total={100} />
      </Example>

      <Example title="Disabled">
        <Pagination disabled defaultCurrent={2} total={50} />
      </Example>
    </ComponentSection>
  )
}
