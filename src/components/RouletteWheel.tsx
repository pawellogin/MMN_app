import { useId, type CSSProperties, type Ref } from 'react'
import styled from '@emotion/styled'

export const SEGMENTS = 16
export const SEGMENT_DEG = 360 / SEGMENTS

const NUMBERS = [32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8]
const C = 150

const Frame = styled.div<{ size: number }>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin: 0 auto;

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
`

const Rotor = styled.div`
  position: absolute;
  inset: 0;
  will-change: transform;
`

function point(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180
  return [C + r * Math.sin(a), C - r * Math.cos(a)]
}

function xy(r: number, deg: number): string {
  const [x, y] = point(r, deg)
  return `${x.toFixed(2)} ${y.toFixed(2)}`
}

function sector(r0: number, r1: number, a0: number, a1: number): string {
  return [
    `M ${xy(r1, a0)}`,
    `A ${r1} ${r1} 0 0 1 ${xy(r1, a1)}`,
    `L ${xy(r0, a1)}`,
    `A ${r0} ${r0} 0 0 0 ${xy(r0, a0)}`,
    'Z',
  ].join(' ')
}

const segments = Array.from({ length: SEGMENTS }, (_, i) => ({
  i,
  a0: i * SEGMENT_DEG,
  a1: (i + 1) * SEGMENT_DEG,
  mid: (i + 0.5) * SEGMENT_DEG,
  red: i % 2 === 0,
}))

function GoldGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f6e2a0" />
      <stop offset="45%" stopColor="#c9a24a" />
      <stop offset="100%" stopColor="#7d5c1c" />
    </linearGradient>
  )
}

type Props = {
  size?: number
  rotorRef?: Ref<HTMLDivElement>
  rotorStyle?: CSSProperties
}

export function RouletteWheel({ size = 260, rotorRef, rotorStyle }: Props) {
  const id = useId().replace(/:/g, '')
  const gold = `url(#${id}-gold)`
  const rotorGold = `url(#${id}-gold-r)`

  return (
    <Frame size={size}>
      <svg viewBox="0 0 300 300">
        <defs>
          <GoldGradient id={`${id}-gold`} />
          <radialGradient id={`${id}-wood`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#7a4424" />
            <stop offset="70%" stopColor="#4a240f" />
            <stop offset="100%" stopColor="#24110a" />
          </radialGradient>
          <radialGradient id={`${id}-track`} cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="#140904" />
            <stop offset="100%" stopColor="#3a1f0f" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={148} fill={`url(#${id}-wood)`} stroke={gold} strokeWidth={4} />
        <circle cx={C} cy={C} r={134} fill={`url(#${id}-track)`} />
        <circle cx={C} cy={C} r={123} fill="none" stroke={gold} strokeWidth={2.5} />
      </svg>

      <Rotor ref={rotorRef} style={rotorStyle}>
        <svg viewBox="0 0 300 300">
          <defs>
            <GoldGradient id={`${id}-gold-r`} />
            <radialGradient id={`${id}-cone`} cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#8a5330" />
              <stop offset="100%" stopColor="#2e160a" />
            </radialGradient>
          </defs>
          {segments.map((s) => (
            <g key={s.i}>
              <path d={sector(98, 122, s.a0, s.a1)} fill={s.red ? '#b3141d' : '#0d0d0d'} />
              <path d={sector(76, 98, s.a0, s.a1)} fill={s.red ? '#7e0d14' : '#050505'} />
            </g>
          ))}
          <g stroke="#d4af5a" strokeWidth={1.6}>
            {segments.map((s) => {
              const [x0, y0] = point(76, s.a0)
              const [x1, y1] = point(122, s.a0)
              return <line key={s.i} x1={x0} y1={y0} x2={x1} y2={y1} />
            })}
          </g>
          <circle cx={C} cy={C} r={98} fill="none" stroke="#c9a24a" strokeWidth={1} opacity={0.7} />
          {segments.map((s) => (
            <text
              key={s.i}
              x={C}
              y={C - 110}
              transform={`rotate(${s.mid} ${C} ${C})`}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              fontSize={13}
              fontWeight={600}
              fontFamily="'Oswald', sans-serif"
            >
              {NUMBERS[s.i]}
            </text>
          ))}
          <circle cx={C} cy={C} r={76} fill={`url(#${id}-cone)`} stroke="#c9a24a" strokeWidth={2} />
          <circle cx={C} cy={C} r={58} fill="none" stroke="#c9a24a" strokeWidth={1} opacity={0.4} />
          {[0, 90, 180, 270].map((a) => {
            const [x, y] = point(46, a)
            return (
              <g key={a}>
                <line x1={C} y1={C} x2={x} y2={y} stroke="#c9a24a" strokeWidth={6} strokeLinecap="round" />
                <line x1={C} y1={C} x2={x} y2={y} stroke="#f6e2a0" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
                <circle cx={x} cy={y} r={6.5} fill={rotorGold} stroke="#5c4212" strokeWidth={1} />
              </g>
            )
          })}
          <circle cx={C} cy={C} r={18} fill={rotorGold} stroke="#5c4212" strokeWidth={1} />
          <circle cx={C} cy={C} r={8} fill="#f6e2a0" />
        </svg>
      </Rotor>

      <svg viewBox="0 0 300 300">
        <defs>
          <radialGradient id={`${id}-ball`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="60%" stopColor="#ddd" />
            <stop offset="100%" stopColor="#888" />
          </radialGradient>
        </defs>
        <polygon
          points={`${C - 9},${C - 150} ${C + 9},${C - 150} ${C},${C - 132}`}
          fill={gold}
          stroke="#5c4212"
          strokeWidth={1}
        />
        <ellipse cx={C} cy={C - 84} rx={7} ry={3} fill="#000" opacity={0.5} />
        <circle cx={C} cy={C - 87} r={7} fill={`url(#${id}-ball)`} />
        <ellipse
          cx={C - 30}
          cy={C - 70}
          rx={70}
          ry={38}
          fill="#fff"
          opacity={0.05}
          transform={`rotate(-25 ${C} ${C})`}
        />
      </svg>
    </Frame>
  )
}
