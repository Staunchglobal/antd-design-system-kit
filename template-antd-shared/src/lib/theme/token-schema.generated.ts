/**
 * Ant Design's global Seed Token catalog (name, default value, label, description, group),
 * generated from antd's own shipped `SeedToken` interface + its `PresetColorType` base
 * (`node_modules/antd/es/theme/interface/seeds.d.ts`) and the real default values
 * (`node_modules/antd/es/theme/themes/seed.js`) by `scripts/extract-token-schema.mjs`.
 * Regenerate with `node scripts/extract-token-schema.mjs` after bumping antd's version —
 * not run at end-user install time, same pattern as google-fonts.ts.
 */
export type TokenValueType =
  | 'color-hex'
  | 'number'
  | 'font-family'
  | 'boolean'
  | 'easing-string'
  | 'enum'

export type TokenSchemaEntry = {
  name: string
  valueType: TokenValueType
  defaultValue: unknown
  label: string
  description?: string
  group: string
  enumOptions?: string[]
}

export const GLOBAL_TOKEN_SCHEMA: TokenSchemaEntry[] = [
  {
    name: "colorPrimary",
    valueType: "color-hex",
    defaultValue: "#1677ff",
    label: "Brand Color",
    description: "Brand color is one of the most direct visual elements to reflect the characteristics and communication of the product. After you have selected the brand color, we will automatically generate a complete color palette and assign it effective design semantics.",
    group: "Colors",
  },
  {
    name: "colorSuccess",
    valueType: "color-hex",
    defaultValue: "#52c41a",
    label: "Success Color",
    description: "Used to represent the token sequence of operation success, such as Result, Progress and other components will use these map tokens.",
    group: "Colors",
  },
  {
    name: "colorWarning",
    valueType: "color-hex",
    defaultValue: "#faad14",
    label: "Warning Color",
    description: "Used to represent the warning map token, such as Notification, Alert, etc. Alert or Control component(like Input) will use these map tokens.",
    group: "Colors",
  },
  {
    name: "colorError",
    valueType: "color-hex",
    defaultValue: "#ff4d4f",
    label: "Error Color",
    description: "Used to represent the visual elements of the operation failure, such as the error Button, error Result component, etc.",
    group: "Colors",
  },
  {
    name: "colorInfo",
    valueType: "color-hex",
    defaultValue: "#1677ff",
    label: "Info Color",
    description: "Used to represent the operation information of the Token sequence, such as Alert, Tag, Progress, and other components use these map tokens.",
    group: "Colors",
  },
  {
    name: "colorTextBase",
    valueType: "color-hex",
    defaultValue: "",
    label: "Seed Text Color",
    description: "Used to derive the base variable of the text color gradient. In v5, we added a layer of text color derivation algorithm to produce gradient variables of text color gradient. But please do not use this Seed Token directly in the code!",
    group: "Colors",
  },
  {
    name: "colorBgBase",
    valueType: "color-hex",
    defaultValue: "",
    label: "Seed Background Color",
    description: "Used to derive the base variable of the background color gradient. In v5, we added a layer of background color derivation algorithm to produce map token of background color. But PLEASE DO NOT USE this Seed Token directly in the code!",
    group: "Colors",
  },
  {
    name: "colorLink",
    valueType: "color-hex",
    defaultValue: "",
    label: "Hyperlink color",
    description: "Control the color of hyperlink.",
    group: "Colors",
  },
  {
    name: "fontFamily",
    valueType: "font-family",
    defaultValue: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\n'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n'Noto Color Emoji'",
    label: "Font family for default text",
    description: "The font family of Ant Design prioritizes the default interface font of the system, and provides a set of alternative font libraries that are suitable for screen display to maintain the readability and readability of the font under different platforms and browsers, reflecting the friendly, stable and professional characteristics.",
    group: "Typography",
  },
  {
    name: "fontFamilyCode",
    valueType: "font-family",
    defaultValue: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    label: "Font family for code text",
    description: "Code font, used for code, pre and kbd elements in Typography",
    group: "Typography",
  },
  {
    name: "fontSize",
    valueType: "number",
    defaultValue: 14,
    label: "Default Font Size",
    description: "The most widely used font size in the design system, from which the text gradient will be derived.",
    group: "Typography",
  },
  {
    name: "lineWidth",
    valueType: "number",
    defaultValue: 1,
    label: "Base Line Width",
    description: "Border width of base components",
    group: "Layout",
  },
  {
    name: "lineType",
    valueType: "enum",
    defaultValue: "solid",
    label: "Line Style",
    description: "Border style of base components",
    group: "Layout",
    enumOptions: ["solid","dashed","dotted","double","none"],
  },
  {
    name: "borderRadius",
    valueType: "number",
    defaultValue: 6,
    label: "Base Border Radius",
    description: "Border radius of base components",
    group: "Layout",
  },
  {
    name: "sizeUnit",
    valueType: "number",
    defaultValue: 4,
    label: "Size Change Unit",
    description: "The unit of size change, in Ant Design, our base unit is 4, which is more fine-grained control of the size step",
    group: "Layout",
  },
  {
    name: "sizeStep",
    valueType: "number",
    defaultValue: 4,
    label: "Size Base Step",
    description: "The base step of size change, the size step combined with the size change unit, can derive various size steps. By adjusting the step, you can get different layout modes, such as the size step of the compact mode of V5 is 2",
    group: "Layout",
  },
  {
    name: "sizePopupArrow",
    valueType: "number",
    defaultValue: 16,
    label: "Size Popup Arrow",
    description: "The size of the component arrow",
    group: "Layout",
  },
  {
    name: "controlHeight",
    valueType: "number",
    defaultValue: 32,
    label: "Base Control Height",
    description: "The height of the basic controls such as buttons and input boxes in Ant Design",
    group: "Layout",
  },
  {
    name: "zIndexBase",
    valueType: "number",
    defaultValue: 0,
    label: "Base zIndex",
    description: "The base Z axis value of all components, which can be used to control the level of some floating components based on the Z axis value, such as BackTop, Affix, etc.",
    group: "Layout",
  },
  {
    name: "zIndexPopupBase",
    valueType: "number",
    defaultValue: 1000,
    label: "popup base zIndex",
    description: "Base zIndex of component like FloatButton, Affix which can be cover by large popup",
    group: "Layout",
  },
  {
    name: "opacityImage",
    valueType: "number",
    defaultValue: 1,
    label: "Image Opacity",
    description: "Control image opacity",
    group: "Layout",
  },
  {
    name: "motionUnit",
    valueType: "number",
    defaultValue: 0.1,
    label: "Animation Duration Unit",
    description: "The unit of animation duration change",
    group: "Motion",
  },
  {
    name: "motionBase",
    valueType: "number",
    defaultValue: 0,
    label: "Animation Base Duration.",
    description: "Animation Base Duration.",
    group: "Motion",
  },
  {
    name: "motionEaseOutCirc",
    valueType: "easing-string",
    defaultValue: "cubic-bezier(0.08, 0.82, 0.17, 1)",
    label: "Motion Ease Out Circ",
    description: "Preset motion curve.",
    group: "Motion",
  },
  {
    name: "motionEaseInOutCirc",
    valueType: "easing-string",
    defaultValue: "cubic-bezier(0.78, 0.14, 0.15, 0.86)",
    label: "Motion Ease In Out Circ",
    description: "Preset motion curve.",
    group: "Motion",
  },
  {
    name: "motionEaseInOut",
    valueType: "easing-string",
    defaultValue: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    label: "Motion Ease In Out",
    description: "Preset motion curve.",
    group: "Motion",
  },
  {
    name: "motionEaseOutBack",
    valueType: "easing-string",
    defaultValue: "cubic-bezier(0.12, 0.4, 0.29, 1.46)",
    label: "Motion Ease Out Back",
    description: "Preset motion curve.",
    group: "Motion",
  },
  {
    name: "motionEaseInBack",
    valueType: "easing-string",
    defaultValue: "cubic-bezier(0.71, -0.46, 0.88, 0.6)",
    label: "Motion Ease In Back",
    description: "Preset motion curve.",
    group: "Motion",
  },
  {
    name: "motionEaseInQuint",
    valueType: "easing-string",
    defaultValue: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
    label: "Motion Ease In Quint",
    description: "Preset motion curve.",
    group: "Motion",
  },
  {
    name: "motionEaseOutQuint",
    valueType: "easing-string",
    defaultValue: "cubic-bezier(0.23, 1, 0.32, 1)",
    label: "Motion Ease Out Quint",
    description: "Preset motion curve.",
    group: "Motion",
  },
  {
    name: "motionEaseOut",
    valueType: "easing-string",
    defaultValue: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    label: "Motion Ease Out",
    description: "Preset motion curve.",
    group: "Motion",
  },
  {
    name: "wireframe",
    valueType: "boolean",
    defaultValue: false,
    label: "Wireframe Style",
    description: "Used to change the visual effect of the component to wireframe, if you need to use the V4 effect, you need to enable the configuration item",
    group: "Behavior",
  },
  {
    name: "motion",
    valueType: "boolean",
    defaultValue: true,
    label: "Motion Style",
    description: "Used to configure the motion effect, when it is `false`, the motion is turned off",
    group: "Motion",
  },
]
