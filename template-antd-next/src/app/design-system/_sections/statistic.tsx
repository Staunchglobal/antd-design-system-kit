'use client'

import { Card, Col, Row, Statistic } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30

export default function StatisticDemo() {
  return (
    <ComponentSection
      id="statistic"
      title="Statistic"
      description="Display a highlighted, formatted numeric value with an optional title, prefix, or suffix."
    >
      <Example title="Basic" contentStyle={{ display: 'flex', gap: 32 }}>
        <Statistic title="Active users" value={112893} />
        <Statistic title="Account balance" value={1128.93} precision={2} />
      </Example>

      <Example title="With prefix and suffix" contentStyle={{ display: 'flex', gap: 32 }}>
        <Statistic
          title="Growth"
          value={11.28}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
          prefix={<ArrowUpOutlined />}
          suffix="%"
        />
        <Statistic
          title="Churn"
          value={9.3}
          precision={2}
          valueStyle={{ color: '#cf1322' }}
          prefix={<ArrowDownOutlined />}
          suffix="%"
        />
      </Example>

      <Example title="Countdown" contentStyle={{ display: 'flex', gap: 32 }}>
        <Statistic.Countdown title="Offer ends in" value={deadline} format="D [days] H[h] m[m] s[s]" />
      </Example>

      <Example title="In cards" contentStyle={{ display: 'flex', gap: 16 }}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={8}>
            <Card size="small">
              <Statistic title="Feedback" value={1128} />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic title="Unmerged" value={93} suffix="/ 100" />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic title="Uptime" value={99.98} suffix="%" precision={2} />
            </Card>
          </Col>
        </Row>
      </Example>
    </ComponentSection>
  )
}
