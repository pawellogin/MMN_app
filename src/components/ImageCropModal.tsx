import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Button, Modal, Slider, Space, Typography, message } from 'antd'
import styled from '@emotion/styled'
import { useLanguage } from '../context/LanguageContext'
import { translateError } from '../i18n/translations'
import { loadImage, renderSquareImage } from '../services/images'
import { colors } from '../styles/theme'

const { Text } = Typography

const VIEW = 300
const MAX_ZOOM = 5

type Offset = { x: number; y: number }

const Viewport = styled.div`
  position: relative;
  width: ${VIEW}px;
  height: ${VIEW}px;
  margin: 0 auto;
  overflow: hidden;
  background: ${colors.black};
  border: 1px solid ${colors.border};
  cursor: grab;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`

const Picture = styled.img`
  position: absolute;
  max-width: none;
  pointer-events: none;
`

const Grid = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  outline: 2px solid ${colors.primary};
  outline-offset: -2px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 1px, transparent 1px);
  background-size: ${VIEW / 3}px ${VIEW / 3}px;
  background-position: -1px -1px;
`

type Props = {
  src: string | null
  onCancel: () => void
  onConfirm: (dataUrl: string) => void
}

export function ImageCropModal({ src, onCancel, onConfirm }: Props) {
  const { lang, t } = useLanguage()
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerX: number; pointerY: number; start: Offset } | null>(null)
  const onLoadErrorRef = useRef(() => {})
  onLoadErrorRef.current = () => {
    message.error(translateError(lang, 'imageType'))
    onCancel()
  }

  useEffect(() => {
    setImage(null)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
    if (!src) return
    let cancelled = false
    loadImage(src)
      .then((loaded) => {
        if (!cancelled) setImage(loaded)
      })
      .catch(() => {
        if (!cancelled) onLoadErrorRef.current()
      })
    return () => {
      cancelled = true
    }
  }, [src])

  const naturalW = image?.naturalWidth ?? 1
  const naturalH = image?.naturalHeight ?? 1
  // zoom 1 fills the frame; minZoom fits the whole image inside it
  const baseScale = VIEW / Math.min(naturalW, naturalH)
  const minZoom = Math.min(naturalW, naturalH) / Math.max(naturalW, naturalH)

  const clamp = useCallback(
    (next: Offset, nextZoom: number): Offset => {
      const scale = baseScale * nextZoom
      const maxX = Math.abs(naturalW * scale - VIEW) / 2
      const maxY = Math.abs(naturalH * scale - VIEW) / 2
      return {
        x: Math.min(maxX, Math.max(-maxX, next.x)),
        y: Math.min(maxY, Math.max(-maxY, next.y)),
      }
    },
    [baseScale, naturalW, naturalH],
  )

  const applyZoom = useCallback(
    (nextZoom: number) => {
      const bounded = Math.min(MAX_ZOOM, Math.max(minZoom, nextZoom))
      const ratio = bounded / zoom
      setOffset((current) => clamp({ x: current.x * ratio, y: current.y * ratio }, bounded))
      setZoom(bounded)
    },
    [clamp, minZoom, zoom],
  )

  useEffect(() => {
    const node = viewportRef.current
    if (!node || !image) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      applyZoom(zoom * Math.exp(-event.deltaY * 0.0015))
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [applyZoom, image, zoom])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerX: event.clientX, pointerY: event.clientY, start: offset }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    setOffset(
      clamp(
        {
          x: drag.start.x + event.clientX - drag.pointerX,
          y: drag.start.y + event.clientY - drag.pointerY,
        },
        zoom,
      ),
    )
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  const scale = baseScale * zoom
  const displayW = naturalW * scale
  const displayH = naturalH * scale
  const left = (VIEW - displayW) / 2 + offset.x
  const top = (VIEW - displayH) / 2 + offset.y

  const onSave = () => {
    if (!image) return
    try {
      onConfirm(renderSquareImage(image, { x: -left / scale, y: -top / scale, size: VIEW / scale }))
    } catch (error) {
      const raw = error instanceof Error ? error.message : 'imageType'
      message.error(translateError(lang, raw))
    }
  }

  return (
    <Modal
      open={Boolean(src)}
      title={t.positionImageTitle}
      width={VIEW + 100}
      onCancel={onCancel}
      onOk={onSave}
      okText={t.positionImageSave}
      okButtonProps={{ disabled: !image }}
      destroyOnHidden
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        {t.positionImageHint}
      </Text>
      <Viewport
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {image && src ? (
          <Picture
            src={src}
            alt=""
            draggable={false}
            style={{ left, top, width: displayW, height: displayH }}
          />
        ) : null}
        <Grid />
      </Viewport>
      <Space style={{ width: '100%', marginTop: 16 }} align="center">
        <Text type="secondary">{t.positionImageZoom}</Text>
        <Slider
          style={{ width: VIEW - 120 }}
          min={minZoom}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          disabled={!image}
          tooltip={{ open: false }}
          onChange={(value) => applyZoom(value)}
        />
        <Button
          size="small"
          disabled={!image}
          onClick={() => {
            setZoom(minZoom)
            setOffset({ x: 0, y: 0 })
          }}
        >
          {t.positionImageFit}
        </Button>
      </Space>
    </Modal>
  )
}
