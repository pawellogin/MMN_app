import type { LocalizedString } from '../i18n/localized'

export type { LocalizedString }

export type Hint = {
  id: string
  text: LocalizedString
}

export type HintOrder = 'sequential' | 'random'

export function parseHintOrder(raw: unknown): HintOrder {
  return raw === 'random' ? 'random' : 'sequential'
}

export type Game = {
  id: string
  name: LocalizedString
  languages: Array<'en' | 'pl'>
  active: boolean
  hintLimit: number
  rouletteEnabled: boolean
}

export type AccessCode = {
  id: string
  code: string
  gameId: string
  label: LocalizedString
  hintsTotal: number
  hintsUsed: number
  active: boolean
  createdAtMs: number
}

export type Character = {
  id: string
  gameId: string
  name: LocalizedString
  order: number
  maxHints: number
  hintOrder: HintOrder
  hints: Hint[]
  imageUrl: string
  imagePath: string
}

export type UnlockedHint = {
  characterId: string
  characterName: LocalizedString | string
  hintId: string
  hintText: LocalizedString | string
  claimedAtMs: number
}

export type AccessCodeDoc = AccessCode & {
  unlocked: UnlockedHint[]
}

export type Session = {
  code: string
  gameId: string
  label: LocalizedString
}
