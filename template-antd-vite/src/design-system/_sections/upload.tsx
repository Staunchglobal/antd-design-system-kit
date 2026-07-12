import { Button, Upload, message } from 'antd'
import type { UploadProps } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'

import { ComponentSection, Example } from '@/design-system/_lib/showcase'

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  message.info(`${file.name} selected (no network request is made in this demo)`)
  return false
}

export default function UploadDemo() {
  return (
    <ComponentSection
      id="upload"
      title="Upload"
      description="Upload files via a button trigger or a drag-and-drop area."
    >
      <Example title="Basic button" contentStyle={{ display: 'block' }}>
        <Upload beforeUpload={beforeUpload} maxCount={3}>
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Example>

      <Example title="Dragger" contentStyle={{ display: 'block' }}>
        <Upload.Dragger name="file" multiple beforeUpload={beforeUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload. No files leave this browser.</p>
        </Upload.Dragger>
      </Example>

      <Example title="Picture card" contentStyle={{ display: 'block' }}>
        <Upload listType="picture-card" beforeUpload={beforeUpload}>
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Example>
    </ComponentSection>
  )
}
