'use client'

import { Image, Space } from 'antd'

import { ComponentSection, Example } from '@/app/design-system/_lib/showcase'

export default function ImageDemo() {
  return (
    <ComponentSection
      id="image"
      title="Image"
      description="Display images with lazy loading, fallback, and a built-in preview experience."
    >
      <Example title="Basic" description="Click the image to preview it.">
        <Image width={200} src="https://picsum.photos/id/1015/400/300" alt="Mountain river" />
      </Example>

      <Example title="With fallback" description="Shown when the source fails to load.">
        <Image
          width={200}
          src="https://this-domain-does-not-exist.invalid/broken.png"
          fallback="https://picsum.photos/id/1025/400/300"
          alt="Fallback example"
        />
      </Example>

      <Example title="Preview group" description="Group several images into one preview gallery.">
        <Space>
          <Image.PreviewGroup>
            <Image width={100} src="https://picsum.photos/id/1015/200/200" alt="Photo 1" />
            <Image width={100} src="https://picsum.photos/id/1016/200/200" alt="Photo 2" />
            <Image width={100} src="https://picsum.photos/id/1018/200/200" alt="Photo 3" />
          </Image.PreviewGroup>
        </Space>
      </Example>
    </ComponentSection>
  )
}
