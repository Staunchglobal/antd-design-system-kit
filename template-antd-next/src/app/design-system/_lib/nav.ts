// Canonical component/group data — scripts/build-registry.mjs parses this into
// src/generated/registry.ts. NOT copied into consumer projects; the CLI generates a
// filtered nav.ts (via src/lib/codegen.ts) scoped to whatever components were chosen.
// Grouped and ordered to match Ant Design's own doc taxonomy and component list
// (https://ant.design/components/overview) for antd v6.5.0 — all 72 components except
// `_util` (an internal-only namespace with no public props/demo of its own; kept as a
// stub info section for completeness against the doc list).

export type NavItem = {
  id: string
  label: string
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'General',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'float-button', label: 'FloatButton' },
      { id: 'icon', label: 'Icon' },
      { id: 'typography', label: 'Typography' },
    ],
  },
  {
    title: 'Layout',
    items: [
      { id: 'divider', label: 'Divider' },
      { id: 'flex', label: 'Flex' },
      { id: 'grid', label: 'Grid' },
      { id: 'layout', label: 'Layout' },
      { id: 'masonry', label: 'Masonry' },
      { id: 'space', label: 'Space' },
      { id: 'splitter', label: 'Splitter' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { id: 'anchor', label: 'Anchor' },
      { id: 'breadcrumb', label: 'Breadcrumb' },
      { id: 'dropdown', label: 'Dropdown' },
      { id: 'menu', label: 'Menu' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'steps', label: 'Steps' },
      { id: 'tabs', label: 'Tabs' },
    ],
  },
  {
    title: 'Data Entry',
    items: [
      { id: 'auto-complete', label: 'AutoComplete' },
      { id: 'cascader', label: 'Cascader' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'color-picker', label: 'ColorPicker' },
      { id: 'date-picker', label: 'DatePicker' },
      { id: 'form', label: 'Form' },
      { id: 'input', label: 'Input' },
      { id: 'input-number', label: 'InputNumber' },
      { id: 'mentions', label: 'Mentions' },
      { id: 'radio', label: 'Radio' },
      { id: 'rate', label: 'Rate' },
      { id: 'select', label: 'Select' },
      { id: 'slider', label: 'Slider' },
      { id: 'switch', label: 'Switch' },
      { id: 'time-picker', label: 'TimePicker' },
      { id: 'transfer', label: 'Transfer' },
      { id: 'tree-select', label: 'TreeSelect' },
      { id: 'upload', label: 'Upload' },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'badge', label: 'Badge' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'card', label: 'Card' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'collapse', label: 'Collapse' },
      { id: 'descriptions', label: 'Descriptions' },
      { id: 'empty', label: 'Empty' },
      { id: 'image', label: 'Image' },
      { id: 'list', label: 'List' },
      { id: 'popover', label: 'Popover' },
      { id: 'qr-code', label: 'QRCode' },
      { id: 'segmented', label: 'Segmented' },
      { id: 'statistic', label: 'Statistic' },
      { id: 'table', label: 'Table' },
      { id: 'tag', label: 'Tag' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'tour', label: 'Tour' },
      { id: 'tree', label: 'Tree' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { id: 'alert', label: 'Alert' },
      { id: 'drawer', label: 'Drawer' },
      { id: 'message', label: 'Message' },
      { id: 'modal', label: 'Modal' },
      { id: 'notification', label: 'Notification' },
      { id: 'popconfirm', label: 'Popconfirm' },
      { id: 'progress', label: 'Progress' },
      { id: 'result', label: 'Result' },
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'spin', label: 'Spin' },
      { id: 'watermark', label: 'Watermark' },
    ],
  },
  {
    title: 'Other',
    items: [
      { id: 'affix', label: 'Affix' },
      { id: 'app', label: 'App' },
      { id: 'border-beam', label: 'BorderBeam' },
      { id: 'config-provider', label: 'ConfigProvider' },
      { id: 'util', label: 'Util' },
    ],
  },
]
