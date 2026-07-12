import * as React from 'react'
import { Divider, Typography } from 'antd'

const sectionStyle: React.CSSProperties = {
  scrollMarginTop: 96,
  paddingBlock: 48,
}

const exampleContentStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 16,
  padding: 24,
  borderRadius: 8,
  border: '1px solid var(--ant-color-border, #d9d9d9)',
  background: 'var(--ant-color-bg-container, #fff)',
}

export function ComponentSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} style={sectionStyle}>
      <Typography.Title level={2} style={{ marginBottom: 4 }}>
        {title}
      </Typography.Title>
      {description ? <Typography.Paragraph type="secondary">{description}</Typography.Paragraph> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 24 }}>{children}</div>
      <Divider style={{ marginTop: 48, marginBottom: 0 }} />
    </section>
  )
}

export function Example({
  title,
  description,
  children,
  contentStyle,
}: {
  title: string
  description?: string
  children: React.ReactNode
  contentStyle?: React.CSSProperties
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <Typography.Text strong>{title}</Typography.Text>
        {description ? (
          <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
            {description}
          </Typography.Paragraph>
        ) : null}
      </div>
      <div style={{ ...exampleContentStyle, ...contentStyle }}>{children}</div>
    </div>
  )
}

export function ExampleGrid({ children, columns = 2 }: { children: React.ReactNode; columns?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 24,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  )
}
