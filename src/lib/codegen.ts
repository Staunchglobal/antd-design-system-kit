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

/**
 * theme-editor/page.tsx (Next) / ThemeEditorPage.tsx (Vite) bakes in the literal list of
 * currently-selected component slugs so buildThemeManifest only builds nav/live-preview
 * entries for components this project actually has a /design-system demo for — regenerated
 * on every init/update/remove alongside nav.ts, same reason nav.ts is regenerated (the
 * selection can change independently of any single file's content).
 */
export function generateThemeEditorPage(opts: { componentSlugs: string[] }): string {
  return `import type { Metadata } from 'next'
import { buildThemeManifest } from '@/lib/theme/build-manifest'
import { themeConfig } from '@/lib/theme/theme-config'
import { iconMap } from '@/components/icons/icon-map'
import { ThemeEditorShell } from './_components/theme-editor-shell'

export const metadata: Metadata = {
  title: 'Theme Editor',
  description: "Live editor for this project's Ant Design theme tokens.",
  robots: { index: false, follow: false },
}

const COMPONENT_SLUGS = ${JSON.stringify(opts.componentSlugs)}

export default function ThemeEditorPage() {
  const manifest = buildThemeManifest(themeConfig, { componentSlugs: COMPONENT_SLUGS })
  return <ThemeEditorShell manifest={manifest} initialIconMap={iconMap} />
}
`
}

export function generateThemeEditorPageVite(opts: { componentSlugs: string[] }): string {
  return `import { buildThemeManifest } from '@/lib/theme/build-manifest'
import { themeConfig } from '@/lib/theme/theme-config'
import { iconMap } from '@/components/icons/icon-map'
import { ThemeEditorShell } from './_components/theme-editor-shell'

const COMPONENT_SLUGS = ${JSON.stringify(opts.componentSlugs)}

export default function ThemeEditorPage() {
  const manifest = buildThemeManifest(themeConfig, { componentSlugs: COMPONENT_SLUGS })
  return <ThemeEditorShell manifest={manifest} initialIconMap={iconMap} />
}
`
}

/**
 * live-preview.tsx hardcodes an import + COMPONENT_DEMOS entry per selected section file so
 * clicking a component in the theme editor's nav shows the SAME demo /design-system renders —
 * live theme edits apply because theme-editor-shell.tsx already wraps <LivePreview> in the
 * live-editing <ConfigProvider>/<IconMapProvider>, so the demo module needs no wrapping of its
 * own. Falls back to a small fixed multi-component preview for global-token-only groups
 * (Colors/Typography/Layout/Motion/Behavior/Appearance/Icons), which don't map to one component.
 */
const TOKEN_PREVIEW_BODY = `function TokenPreview() {
  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Card title="Card + Button">
        <Space wrap>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="primary" danger>
            Danger
          </Button>
        </Space>
      </Card>

      <Card title="Typography">
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          Heading
        </Typography.Title>
        <Typography.Paragraph>
          Body text using the current font family and size. <Typography.Text code>code text</Typography.Text>
        </Typography.Paragraph>
        <Typography.Link href="#">A hyperlink</Typography.Link>
      </Card>

      <Card title="Inputs & Tags">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Input placeholder="Text input" />
          <Space wrap>
            <Tag color="success">Success</Tag>
            <Tag color="warning">Warning</Tag>
            <Tag color="error">Error</Tag>
            <Tag color="processing">Info</Tag>
          </Space>
          <Space>
            <Switch defaultChecked />
            <Checkbox defaultChecked>Checkbox</Checkbox>
          </Space>
        </Space>
      </Card>

      <Card title="Feedback">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Alert type="success" title="Success alert" showIcon />
          <Alert type="warning" title="Warning alert" showIcon />
          <Progress percent={65} />
        </Space>
      </Card>

      <Card title="Avatar & Icons">
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Avatar style={{ backgroundColor: '#f56a00' }}>U</Avatar>
          <HeartFilled style={{ color: 'var(--ant-color-error, #ff4d4f)' }} />
        </Space>
      </Card>
    </Space>
  )
}

export function LivePreview({ activeGroupId }: { activeGroupId: string }) {
  const Demo = COMPONENT_DEMOS[activeGroupId]
  return Demo ? <Demo /> : <TokenPreview />
}
`

export function generateLivePreview(opts: {
  navGroups: NavGroup[]
  designSystemImportBase: string
  useClient: boolean
}): string {
  const { navGroups, designSystemImportBase, useClient } = opts
  const items = navGroups.flatMap((g) => g.items)

  const imports = items
    .map(
      (item) =>
        `import ${toPascalCase(item.slug)}Demo from '${designSystemImportBase}/_sections/${item.demoFile.replace(/\.tsx$/, '')}'`
    )
    .join('\n')

  const entries = items.map((item) => `  ${JSON.stringify(item.slug)}: ${toPascalCase(item.slug)}Demo,`).join('\n')

  const moduleNames = items.map((item) => `${toPascalCase(item.slug)}Demo`)
  const typeUnion = moduleNames.length ? moduleNames.map((n) => `typeof ${n}`).join('\n  | ') : 'React.ComponentType'

  const clientDirective = useClient ? `'use client'\n\n` : ''

  return `${clientDirective}import { Alert, Avatar, Button, Card, Checkbox, Input, Progress, Space, Switch, Tag, Typography } from 'antd'
import { HeartFilled, UserOutlined } from '@ant-design/icons'
${imports}

type ShowcaseModule =
  | ${typeUnion}

const COMPONENT_DEMOS: Record<string, ShowcaseModule> = {
${entries}
}

${TOKEN_PREVIEW_BODY}`
}
