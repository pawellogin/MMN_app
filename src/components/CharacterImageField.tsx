import { useState } from 'react'
import { Button, Space, Upload, message } from 'antd'
import styled from '@emotion/styled'
import { useLanguage } from '../context/LanguageContext'
import { translateError } from '../i18n/translations'
import { colors } from '../styles/theme'
import { CHARACTER_PLACEHOLDER } from './CharacterCover'
import { ImageCropModal } from './ImageCropModal'
import { deleteCharacterImage, readImageFile } from '../services/images'

const Preview = styled.img`
  display: block;
  width: 160px;
  height: 160px;
  object-fit: cover;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
`

type Props = {
  imageUrl: string
  imagePath: string
  onChange: (next: { imageUrl: string; imagePath: string }) => void
}

export function CharacterImageField({ imageUrl, imagePath, onChange }: Props) {
  const { lang, t } = useLanguage()
  const [busy, setBusy] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const closeCrop = () => {
    if (cropSrc?.startsWith('blob:')) {
      URL.revokeObjectURL(cropSrc)
    }
    setCropSrc(null)
  }

  const onFile = (file: File) => {
    try {
      closeCrop()
      setCropSrc(readImageFile(file))
    } catch (error) {
      const raw = error instanceof Error ? error.message : 'imageType'
      message.error(translateError(lang, raw))
    }
  }

  const onRemove = async () => {
    setBusy(true)
    try {
      await deleteCharacterImage(imagePath)
      onChange({ imageUrl: '', imagePath: '' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Space align="start" size="middle" wrap>
      <Preview src={imageUrl || CHARACTER_PLACEHOLDER} alt="" />
      <Space direction="vertical">
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            onFile(file)
            return false
          }}
        >
          <Button loading={busy}>{t.uploadImage}</Button>
        </Upload>
        {imageUrl ? (
          <>
            <Button onClick={() => setCropSrc(imageUrl)} disabled={busy}>
              {t.positionImage}
            </Button>
            <Button onClick={() => void onRemove()} disabled={busy}>
              {t.removeImage}
            </Button>
          </>
        ) : null}
      </Space>
      <ImageCropModal
        src={cropSrc}
        onCancel={closeCrop}
        onConfirm={(dataUrl) => {
          closeCrop()
          onChange({ imageUrl: dataUrl, imagePath: '' })
        }}
      />
    </Space>
  )
}
