// Mirrors template-antd-next/src/app/design-system/_lib/nav.ts exactly (byte-identical
// content, different path) — see that file's header comment for the full explanation.

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
