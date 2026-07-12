import type { NavGroup } from '../generated/registry.js'

/** A demo file's default export local binding name is arbitrary — generated code always
 * imports it as `${Pascal}Demo` regardless of what it's actually called in the source file. */
function toPascalCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('')
}

export function generateNavTs(groups: NavGroup[]): string {
  const body = groups
    .map(
      (g) =>
        `  {\n    title: '${g.title.replace(/'/g, "\\'")}',\n    items: [${g.items
          .map((i) => `{ id: '${i.slug}', label: '${i.label.replace(/'/g, "\\'")}' }`)
          .join(', ')}],\n  },`
    )
    .join('\n')

  return `export type NavItem = {
  id: string
  label: string
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
${body}
]
`
}

function shellBody(opts: { sidebarImport: string; imports: string; renders: string }): string {
  return `import { Typography } from 'antd'
import { SidebarNav } from '${opts.sidebarImport}'
${opts.imports}

export default function DesignSystemPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', display: 'flex', gap: 40, padding: '40px 24px' }}>
        <aside style={{ width: 224, flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: 40, maxHeight: 'calc(100vh - 80px)', overflowY: 'auto', paddingBottom: 40 }}>
            <SidebarNav />
          </div>
        </aside>

        <main style={{ minWidth: 0, flex: 1 }}>
          <header style={{ paddingBottom: 40 }}>
            <Typography.Title level={1}>Design System</Typography.Title>
            <Typography.Paragraph type="secondary" style={{ maxWidth: 640 }}>
              Every Ant Design component installed in this app, rendered with its full range of
              variants, sizes, and states for visual QA.
            </Typography.Paragraph>
          </header>

${opts.renders}
        </main>
      </div>
    </div>
  )
}
`
}

/**
 * Vite has no RSC/static-prerendering concept — the whole app is client-rendered, so the
 * showcase page can be one plain file with no directive at all.
 */
export function generateDesignSystemPage(opts: {
  navGroups: NavGroup[]
  importBase: string
  sidebarImport: string
}): string {
  const items = opts.navGroups.flatMap((g) => g.items)
  const imports = items
    .map(
      (item) =>
        `import ${toPascalCase(item.slug)}Demo from '${opts.importBase}/_sections/${item.demoFile.replace(/\.tsx$/, '')}'`
    )
    .join('\n')
  const renders = items.map((item) => `        <${toPascalCase(item.slug)}Demo />`).join('\n')
  return shellBody({ sidebarImport: opts.sidebarImport, imports, renders })
}

/**
 * Next needs the split this function embodies: `metadata` can only be exported from a
 * Server Component, but Ant Design's compound components (Typography.Title, Layout.Content,
 * Form.Item, ...) rely on client-side context (ConfigProvider, @ant-design/cssinjs) and throw
 * "Element type is invalid: ... undefined" if rendered directly inside a Server Component
 * during Next's static prerendering (a known antd/Next.js App Router interaction — the
 * compound statics resolve to undefined outside a Client Component boundary). So `page.tsx`
 * stays a thin Server Component holding only `metadata`, and every actual antd render lives
 * in a sibling `'use client'` content component it imports and renders.
 */
export function generateDesignSystemPageShell(opts: { contentImport: string }): string {
  return `import type { Metadata } from 'next'
import { DesignSystemContent } from '${opts.contentImport}'

export const metadata: Metadata = {
  title: 'Design System',
  description: 'Internal reference showing every Ant Design component in every variant and state.',
  robots: { index: false, follow: false },
}

export default function DesignSystemPage() {
  return <DesignSystemContent />
}
`
}

export function generateDesignSystemContent(opts: {
  navGroups: NavGroup[]
  importBase: string
  sidebarImport: string
}): string {
  const items = opts.navGroups.flatMap((g) => g.items)
  const imports = items
    .map(
      (item) =>
        `import ${toPascalCase(item.slug)}Demo from '${opts.importBase}/_sections/${item.demoFile.replace(/\.tsx$/, '')}'`
    )
    .join('\n')
  const renders = items.map((item) => `        <${toPascalCase(item.slug)}Demo />`).join('\n')
  return `'use client'

${shellBody({ sidebarImport: opts.sidebarImport, imports, renders }).replace(
    'export default function DesignSystemPage()',
    'export function DesignSystemContent()'
  )}`
}
