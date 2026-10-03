import {
  collection,
  onSnapshot,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { parseLocalized } from '../i18n/localized'
import { requireDb } from '../lib/firebase'
import {
  parseHintOrder,
  type Character,
  type Hint,
  type UnlockedHint,
} from '../types/game'

function mapHints(raw: unknown): Hint[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    const hint = item as Record<string, unknown>
    return {
      id: String(hint.id),
      text: parseLocalized(hint.text),
    }
  })
}

function mapCharacter(id: string, data: Record<string, unknown>): Character {
  const hints = mapHints(data.hints)

  return {
    id,
    gameId: String(data.gameId ?? ''),
    name: parseLocalized(data.name, 'Character'),
    order: Number(data.order ?? 0),
    maxHints: Number(data.maxHints ?? hints.length),
    hintOrder: parseHintOrder(data.hintOrder),
    hints,
    imageUrl: String(data.imageUrl ?? ''),
    imagePath: String(data.imagePath ?? ''),
  }
}

export function subscribeCharacters(
  gameId: string,
  onData: (characters: Character[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(
    collection(requireDb(), 'characters'),
    where('gameId', '==', gameId),
  )

  return onSnapshot(
    q,
    (snap) => {
      const characters = snap.docs
        .map((item) =>
          mapCharacter(item.id, item.data() as Record<string, unknown>),
        )
        .sort((a, b) => a.order - b.order)
      onData(characters)
    },
    (error) => onError(error),
  )
}

export function claimedCountForCharacter(
  character: Character,
  unlocked: UnlockedHint[],
): number {
  return unlocked.filter((item) => item.characterId === character.id).length
}

export function remainingHintsForCharacter(
  character: Character,
  unlocked: UnlockedHint[],
): number {
  return Math.max(0, character.maxHints - claimedCountForCharacter(character, unlocked))
}
