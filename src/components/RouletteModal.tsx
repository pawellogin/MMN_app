import { useEffect, useRef, useState } from 'react'
import { Button, Modal, Typography } from 'antd'
import styled from '@emotion/styled'
import { useLanguage } from '../context/LanguageContext'
import { pickLocalized } from '../i18n/localized'
import type { RouletteColor, SpinResult } from '../services/claims'
import { colors } from '../styles/theme'
import { RouletteWheel, SEGMENTS, SEGMENT_DEG } from './RouletteWheel'

const { Paragraph, Text } = Typography

const SPIN_MS = 3000
const MIN_SETTLE_MS = 800
const START_SPEED = 1.2

const WheelSpace = styled.div`
  margin: 8px 0 24px;
`

const Choices = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const ColorButton = styled(Button)<{ swatch: RouletteColor }>`
  height: 64px;
  font-size: 20px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${colors.text} !important;
  background: ${({ swatch }) => (swatch === 'red' ? colors.primary : colors.black)} !important;
  border: 2px solid
    ${({ swatch }) => (swatch === 'red' ? colors.primary : colors.textSubtle)} !important;

  &:hover {
    filter: brightness(1.25);
  }
`

const Centered = styled.div`
  text-align: center;
`

type Stage = 'choose' | 'spinning' | 'result'

type Props = {
  open: boolean
  characterName: string
  hintsLeft: number
  onSpin: (choice: RouletteColor) => Promise<SpinResult>
  onError: (error: unknown) => void
  onClose: () => void
}

function landingAngle(start: number, landed: RouletteColor, minTravel: number): number {
  const candidates = Array.from({ length: SEGMENTS }, (_, i) => i).filter((i) =>
    landed === 'red' ? i % 2 === 0 : i % 2 === 1,
  )
  const segment = candidates[Math.floor(Math.random() * candidates.length)]
  const jitter = (Math.random() - 0.5) * SEGMENT_DEG * 0.6
  const pointerAt = segment * SEGMENT_DEG + SEGMENT_DEG / 2 + jitter
  const base = (((-pointerAt - start) % 360) + 360) % 360
  const turns = Math.max(0, Math.ceil((minTravel - base) / 360))
  return base + turns * 360
}

export function RouletteModal({
  open,
  characterName,
  hintsLeft,
  onSpin,
  onError,
  onClose,
}: Props) {
  const { lang, t } = useLanguage()
  const [stage, setStage] = useState<Stage>('choose')
  const [choice, setChoice] = useState<RouletteColor | null>(null)
  const [result, setResult] = useState<SpinResult | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const angleRef = useRef(0)
  const frameRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  const paint = (angle: number) => {
    angleRef.current = angle
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${angle}deg)`
    }
  }

  const spin = (picked: RouletteColor) => {
    setChoice(picked)
    setStage('spinning')

    const startedAt = performance.now()
    const startAngle = angleRef.current
    let settle: {
      from: number
      at: number
      duration: number
      travel: number
      momentum: number
    } | null = null
    let pending: SpinResult | null = null

    const tick = (now: number) => {
      if (!settle) {
        paint(startAngle + (now - startedAt) * START_SPEED)
        if (pending) {
          const elapsed = now - startedAt
          const duration = Math.max(SPIN_MS - elapsed, MIN_SETTLE_MS)
          const momentum = START_SPEED * duration
          settle = {
            from: angleRef.current,
            at: now,
            duration,
            momentum,
            travel: landingAngle(angleRef.current, pending.landed, momentum / 2),
          }
        }
        frameRef.current = requestAnimationFrame(tick)
        return
      }

      const s = Math.min(1, (now - settle.at) / settle.duration)
      const eased =
        (s ** 3 - 2 * s ** 2 + s) * settle.momentum + (-2 * s ** 3 + 3 * s ** 2) * settle.travel
      paint(settle.from + eased)

      if (s < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        frameRef.current = null
        setResult(pending)
        setStage('result')
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    onSpin(picked)
      .then((next) => {
        pending = next
      })
      .catch((error: unknown) => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
        frameRef.current = null
        onError(error)
        onClose()
      })
  }

  const reset = () => {
    setStage('choose')
    setChoice(null)
    setResult(null)
  }

  const spinning = stage === 'spinning'
  const colorLabel = (color: RouletteColor) =>
    color === 'red' ? t.rouletteRed : t.rouletteBlack

  return (
    <Modal
      open={open}
      title={`${t.rouletteTitle} · ${characterName}`}
      closable={!spinning}
      maskClosable={!spinning}
      keyboard={!spinning}
      onCancel={onClose}
      afterClose={reset}
      footer={
        stage === 'result' ? (
          <Button type="primary" onClick={onClose}>
            {t.gotIt}
          </Button>
        ) : stage === 'choose' ? (
          <Button onClick={onClose}>{t.rouletteCancel}</Button>
        ) : null
      }
    >
      <WheelSpace>
        <RouletteWheel
          rotorRef={wheelRef}
          rotorStyle={{ transform: `rotate(${angleRef.current}deg)` }}
        />
      </WheelSpace>

      {stage === 'choose' && (
        <>
          <Paragraph style={{ textAlign: 'center' }}>{t.rouletteQuickHelp}</Paragraph>
          <Choices>
            <ColorButton swatch="red" onClick={() => spin('red')}>
              {t.rouletteRed}
            </ColorButton>
            <ColorButton swatch="black" onClick={() => spin('black')}>
              {t.rouletteBlack}
            </ColorButton>
          </Choices>
        </>
      )}

      {stage === 'spinning' && choice && (
        <Centered>
          <Text style={{ fontSize: 20 }}>{t.rouletteSpinning(colorLabel(choice))}</Text>
        </Centered>
      )}

      {stage === 'result' && result && (
        <Centered>
          <Text
            strong
            style={{
              display: 'block',
              fontSize: 26,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: result.won ? colors.text : colors.primary,
              marginBottom: 8,
            }}
          >
            {result.won ? t.rouletteWin : t.rouletteLose}
          </Text>
          {result.won && result.hint ? (
            <Paragraph
              style={{ fontSize: 18, lineHeight: '32px', textAlign: 'left', marginBottom: 0 }}
            >
              {pickLocalized(result.hint.text, lang)}
            </Paragraph>
          ) : (
            <Paragraph style={{ marginBottom: 0 }}>{t.rouletteLoseBody(hintsLeft)}</Paragraph>
          )}
        </Centered>
      )}
    </Modal>
  )
}
