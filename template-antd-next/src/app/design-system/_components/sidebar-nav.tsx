'use client'

import * as React from 'react'
import { Typography } from 'antd'

import { NAV_GROUPS } from '@/app/design-system/_lib/nav'

export function SidebarNav() {
  const allIds = React.useMemo(() => NAV_GROUPS.flatMap((group) => group.items.map((item) => item.id)), [])
  const [activeId, setActiveId] = React.useState<string>(allIds[0] ?? '')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    )

    allIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [allIds])

  return (
    <nav aria-label="Component sections" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {NAV_GROUPS.map((group) => (
        <div key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', padding: '0 8px' }}
          >
            {group.title}
          </Typography.Text>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {group.items.map((item) => {
              const active = activeId === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    style={{
                      display: 'block',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 14,
                      textDecoration: 'none',
                      color: active ? 'var(--ant-color-text, #000)' : 'var(--ant-color-text-secondary, #666)',
                      fontWeight: active ? 500 : 400,
                      background: active ? 'var(--ant-color-fill-secondary, rgba(0,0,0,0.04))' : 'transparent',
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
