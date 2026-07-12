import { Masonry } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const heights = [120, 80, 160, 100, 140, 90, 110, 150]

const items = heights.map((height, index) => ({
  key: index,
  data: { height },
}))

export default function MasonryDemo() {
  return (
    <ComponentSection
      id="masonry"
      title="Masonry"
      description="Arranges items of varying heights into a compact, waterfall-style multi-column grid."
    >
      <Example title="Basic" contentStyle={{ display: 'block' }}>
        <Masonry
          items={items}
          columns={3}
          gutter={12}
          itemRender={(item) => (
            <div
              style={{
                height: item.data.height,
                borderRadius: 6,
                background: '#e6f4ff',
                color: '#1677ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
            >
              Item {String(item.key)}
            </div>
          )}
        />
      </Example>

      <Example title="Responsive columns" description="Column count adapts to breakpoint." contentStyle={{ display: 'block' }}>
        <Masonry
          items={items}
          columns={{ xs: 1, sm: 2, md: 4 }}
          gutter={12}
          itemRender={(item) => (
            <div
              style={{
                height: item.data.height,
                borderRadius: 6,
                background: '#f6ffed',
                color: '#389e0d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
            >
              Item {String(item.key)}
            </div>
          )}
        />
      </Example>
    </ComponentSection>
  )
}
