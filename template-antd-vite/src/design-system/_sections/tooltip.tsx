import { Button, Space, Tooltip } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function TooltipDemo() {
  return (
    <ComponentSection
      id="tooltip"
      title="Tooltip"
      description="A simple text popup box that appears when hovering over an element."
    >
      <Example title="Placement">
        <Space wrap>
          <Tooltip title="Top tooltip" placement="top">
            <Button>Top</Button>
          </Tooltip>
          <Tooltip title="Left tooltip" placement="left">
            <Button>Left</Button>
          </Tooltip>
          <Tooltip title="Right tooltip" placement="right">
            <Button>Right</Button>
          </Tooltip>
          <Tooltip title="Bottom tooltip" placement="bottom">
            <Button>Bottom</Button>
          </Tooltip>
        </Space>
      </Example>

      <Example title="Corner placements">
        <Space wrap>
          <Tooltip title="Top left" placement="topLeft">
            <Button>Top Left</Button>
          </Tooltip>
          <Tooltip title="Top right" placement="topRight">
            <Button>Top Right</Button>
          </Tooltip>
          <Tooltip title="Bottom left" placement="bottomLeft">
            <Button>Bottom Left</Button>
          </Tooltip>
          <Tooltip title="Bottom right" placement="bottomRight">
            <Button>Bottom Right</Button>
          </Tooltip>
        </Space>
      </Example>

      <Example title="Colors">
        <Space wrap>
          <Tooltip title="Blue tooltip" color="blue">
            <Button>Blue</Button>
          </Tooltip>
          <Tooltip title="Success tooltip" color="green">
            <Button>Green</Button>
          </Tooltip>
          <Tooltip title="Warning tooltip" color="gold">
            <Button>Gold</Button>
          </Tooltip>
          <Tooltip title="Error tooltip" color="red">
            <Button>Red</Button>
          </Tooltip>
        </Space>
      </Example>
    </ComponentSection>
  )
}
