import * as React from 'react'
import { QRCode, Space } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function QrCodeDemo() {
  const [refreshedAt, setRefreshedAt] = React.useState(0)

  return (
    <ComponentSection
      id="qr-code"
      title="QRCode"
      description="Render a scannable QR code for a URL or arbitrary string value."
    >
      <Example title="Basic">
        <QRCode value="https://ant.design/" />
      </Example>

      <Example title="Sizes and error level">
        <Space wrap align="end">
          <QRCode value="https://ant.design/" size={96} />
          <QRCode value="https://ant.design/" size={128} errorLevel="H" />
          <QRCode value="https://ant.design/" size={128} bordered={false} />
        </Space>
      </Example>

      <Example title="Status" description="loading and expired states, with a refresh action.">
        <Space wrap align="start">
          <QRCode value="https://ant.design/" status="loading" />
          <QRCode
            key={refreshedAt}
            value="https://ant.design/"
            status="expired"
            onRefresh={() => setRefreshedAt(Date.now())}
          />
          <QRCode value="https://ant.design/" status="scanned" />
        </Space>
      </Example>

      <Example title="With icon">
        <QRCode
          value="https://ant.design/"
          icon="https://raw.githubusercontent.com/ant-design/ant-design/master/public/logo.svg"
        />
      </Example>
    </ComponentSection>
  )
}
