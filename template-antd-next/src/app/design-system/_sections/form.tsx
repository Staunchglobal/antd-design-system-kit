'use client'

import { Button, Checkbox, Form, Input, Select } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

type ProfileFormValues = {
  name: string
  email: string
  role: string
  remember: boolean
}

export default function FormDemo() {
  const [form] = Form.useForm<ProfileFormValues>()

  return (
    <ComponentSection
      id="form"
      title="Form"
      description="Validate and collect user input with a consistent layout and error states."
    >
      <Example title="Vertical layout" contentStyle={{ display: 'block' }}>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 400 }}
          initialValues={{ remember: true }}
          onFinish={(values) => console.log('Submitted:', values)}
        >
          <Form.Item
            label="Full name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Jane Doe" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email address' },
            ]}
          >
            <Input placeholder="jane@example.com" />
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role' }]}>
            <Select
              placeholder="Select a role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'editor', label: 'Editor' },
                { value: 'viewer', label: 'Viewer' },
              ]}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember my preferences</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Example>

      <Example title="Validation states" contentStyle={{ display: 'block' }}>
        <Form layout="vertical" style={{ maxWidth: 400 }}>
          <Form.Item
            label="Username"
            validateStatus="error"
            help="This username is already taken."
          >
            <Input defaultValue="jane_doe" />
          </Form.Item>
          <Form.Item
            label="Display name"
            validateStatus="success"
            hasFeedback
          >
            <Input defaultValue="Jane Doe" />
          </Form.Item>
        </Form>
      </Example>
    </ComponentSection>
  )
}
