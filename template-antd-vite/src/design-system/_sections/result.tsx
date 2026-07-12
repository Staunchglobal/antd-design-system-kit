import { Button, Result, Space } from 'antd'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

export default function ResultDemo() {
  return (
    <ComponentSection id="result" title="Result" description="Used to display the outcome of a task, such as a submission, payment, or error state.">
      <Example title="Success">
        <Result
          status="success"
          title="Successfully purchased your plan"
          subTitle="Order number: 2026071200001. Your subscription will renew automatically."
          extra={[
            <Button type="primary" key="console">
              View plan
            </Button>,
            <Button key="buy">View invoice</Button>,
          ]}
        />
      </Example>

      <Example title="Error">
        <Result
          status="error"
          title="Submission failed"
          subTitle="Please check and modify the following information before resubmitting."
          extra={
            <Space>
              <Button type="primary">Go back</Button>
              <Button>Retry</Button>
            </Space>
          }
        />
      </Example>

      <Example title="404">
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button type="primary" href="#">
              Back home
            </Button>
          }
        />
      </Example>
    </ComponentSection>
  )
}
