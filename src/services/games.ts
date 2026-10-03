import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore'
import { parseLocalized } from '../i18n/localized'
import { requireDb } from '../lib/firebase'
import {
  parseHintOrder,
  type AccessCodeDoc,
  type Character,
  type Game,
  type Hint,
  type HintOrder,
} from '../types/game'
import { listAllCodes, newAccessCodeDoc } from './accessCodes'
import { createUniqueJoinCode } from './joinCodes'

export type GameListItem = Game & {
  codes: AccessCodeDoc[]
}

export type GameDraftCharacter = {
  id: string
  persisted: boolean
  name: { en: string; pl: string }
  hintOrder: HintOrder
  hints: Array<{ id: string; en: string; pl: string }>
  imageUrl: string
  imagePath: string
}

export type GameDraft = {
  id: string | null
  name: { en: string; pl: string }
  hintLimit: number
  rouletteEnabled: boolean
  characters: GameDraftCharacter[]
}

function mapGame(id: string, data: Record<string, unknown>): Game {
  return {
    id,
    name: parseLocalized(data.name, 'Game'),
    languages: ['en', 'pl'],
    active: Boolean(data.active ?? true),
    hintLimit: Number(data.hintLimit ?? data.hintsTotal ?? 0),
    rouletteEnabled: Boolean(data.rouletteEnabled ?? false),
  }
}

export function subscribeGame(
  gameId: string,
  onData: (game: Game) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(requireDb(), 'games', gameId),
    (snap) => {
      if (!snap.exists()) {
        onError(new Error('gameMissing'))
        return
      }
      onData(mapGame(snap.id, snap.data() as Record<string, unknown>))
    },
    (error) => onError(error),
  )
}

function mapCharacter(id: string, data: Record<string, unknown>): Character {
  const hints: Hint[] = Array.isArray(data.hints)
    ? data.hints.map((hint: { id?: string; text?: unknown }) => ({
        id: String(hint.id),
        text: parseLocalized(hint.text),
      }))
    : []

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

export async function listGames(): Promise<GameListItem[]> {
  const db = requireDb()
  const gamesSnap = await getDocs(collection(db, 'games'))

  let codes: AccessCodeDoc[]
  try {
    codes = await listAllCodes()
  } catch {
    codes = []
  }

  return gamesSnap.docs
    .map((item) => {
      const game = mapGame(item.id, item.data() as Record<string, unknown>)
      return {
        ...game,
        codes: codes.filter((code) => code.gameId === game.id),
      }
    })
    .sort((a, b) => a.name.en.localeCompare(b.name.en))
}

export async function loadGameDraft(gameId: string): Promise<GameDraft> {
  const db = requireDb()
  const gameSnap = await getDoc(doc(db, 'games', gameId))
  if (!gameSnap.exists()) {
    throw new Error('gameMissing')
  }

  const game = mapGame(gameSnap.id, gameSnap.data() as Record<string, unknown>)
  const charsSnap = await getDocs(
    query(collection(db, 'characters'), where('gameId', '==', gameId)),
  )

  const characters = charsSnap.docs
    .map((item) => mapCharacter(item.id, item.data() as Record<string, unknown>))
    .sort((a, b) => a.order - b.order)
    .map((character) => ({
      id: character.id,
      persisted: true,
      name: { en: character.name.en, pl: character.name.pl },
      hintOrder: character.hintOrder,
      hints: character.hints.map((hint) => ({
        id: hint.id,
        en: hint.text.en,
        pl: hint.text.pl,
      })),
      imageUrl: character.imageUrl,
      imagePath: character.imagePath,
    }))

  return {
    id: game.id,
    name: { en: game.name.en, pl: game.name.pl },
    hintLimit: game.hintLimit || 16,
    rouletteEnabled: game.rouletteEnabled,
    characters,
  }
}

export function emptyGameDraft(): GameDraft {
  return {
    id: null,
    name: { en: '', pl: '' },
    hintLimit: 16,
    rouletteEnabled: false,
    characters: [emptyCharacter()],
  }
}

export function emptyCharacter(): GameDraftCharacter {
  return {
    id: crypto.randomUUID(),
    persisted: false,
    name: { en: '', pl: '' },
    hintOrder: 'sequential',
    hints: [emptyHint()],
    imageUrl: '',
    imagePath: '',
  }
}

export function emptyHint(): GameDraftCharacter['hints'][number] {
  return {
    id: `h-${crypto.randomUUID().slice(0, 8)}`,
    en: '',
    pl: '',
  }
}

export async function saveGame(
  draft: GameDraft,
): Promise<{ gameId: string; joinCode: string | null }> {
  const nameEn = draft.name.en.trim()
  const namePl = draft.name.pl.trim()
  if (!nameEn && !namePl) {
    throw new Error('nameRequired')
  }
  if (!Number.isFinite(draft.hintLimit) || draft.hintLimit < 1) {
    throw new Error('hintLimitRequired')
  }
  if (draft.characters.length < 1) {
    throw new Error('characterRequired')
  }
  for (const character of draft.characters) {
    if (!character.name.en.trim() && !character.name.pl.trim()) {
      throw new Error('characterNameRequired')
    }
    const filled = character.hints.some((hint) => hint.en.trim() || hint.pl.trim())
    if (!filled) {
      throw new Error('hintRequired')
    }
  }

  const name = {
    en: nameEn || namePl,
    pl: namePl || nameEn,
  }

  const db = requireDb()
  const gameRef = draft.id
    ? doc(db, 'games', draft.id)
    : doc(collection(db, 'games'))

  const [existingChars, existingCodes] = draft.id
    ? await Promise.all([
        getDocs(query(collection(db, 'characters'), where('gameId', '==', gameRef.id))),
        getDocs(query(collection(db, 'accessCodes'), where('gameId', '==', gameRef.id))),
      ])
    : [null, null]

  const keepIds = new Set(
    draft.characters.filter((character) => character.persisted).map((character) => character.id),
  )

  const firstCode = draft.id ? null : await createUniqueJoinCode()

  const batch = writeBatch(db)

  batch.set(
    gameRef,
    {
      name,
      languages: ['en', 'pl'],
      active: true,
      hintLimit: draft.hintLimit,
      rouletteEnabled: draft.rouletteEnabled,
      joinCode: deleteField(),
      updatedAt: serverTimestamp(),
      ...(draft.id ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  )

  existingCodes?.docs.forEach((item) => {
    batch.update(item.ref, {
      label: name,
      hintsTotal: draft.hintLimit,
    })
  })

  if (firstCode) {
    batch.set(
      doc(db, 'accessCodes', firstCode),
      newAccessCodeDoc(firstCode, gameRef.id, name, draft.hintLimit),
    )
  }

  existingChars?.docs.forEach((item) => {
    if (!keepIds.has(item.id)) {
      batch.delete(item.ref)
    }
  })

  draft.characters.forEach((character, index) => {
    const hints = character.hints
      .map((hint) => ({
        id: hint.id,
        text: {
          en: hint.en.trim(),
          pl: hint.pl.trim() || hint.en.trim(),
        },
      }))
      .filter((hint) => hint.text.en || hint.text.pl)
      .map((hint) => ({
        ...hint,
        text: {
          en: hint.text.en || hint.text.pl,
          pl: hint.text.pl || hint.text.en,
        },
      }))

    if (hints.length === 0) {
      throw new Error('hintRequired')
    }

    const charNameEn = character.name.en.trim()
    const charNamePl = character.name.pl.trim()
    if (!charNameEn && !charNamePl) {
      throw new Error('characterNameRequired')
    }

    const characterRef = character.persisted
      ? doc(db, 'characters', character.id)
      : doc(collection(db, 'characters'))

    batch.set(characterRef, {
      gameId: gameRef.id,
      name: {
        en: charNameEn || charNamePl,
        pl: charNamePl || charNameEn,
      },
      order: index + 1,
      maxHints: hints.length,
      hintOrder: character.hintOrder,
      hints,
      imageUrl: character.imageUrl || '',
      imagePath: character.imagePath || '',
    })
  })

  await batch.commit()

  return { gameId: gameRef.id, joinCode: firstCode }
}

export async function deleteGame(gameId: string): Promise<void> {
  const db = requireDb()
  const [codesSnap, charsSnap, claimsSnap, spinsSnap] = await Promise.all([
    getDocs(query(collection(db, 'accessCodes'), where('gameId', '==', gameId))),
    getDocs(query(collection(db, 'characters'), where('gameId', '==', gameId))),
    getDocs(query(collection(db, 'claims'), where('gameId', '==', gameId))),
    getDocs(query(collection(db, 'spins'), where('gameId', '==', gameId))),
  ])

  const batch = writeBatch(db)
  codesSnap.docs.forEach((item) => batch.delete(item.ref))
  charsSnap.docs.forEach((item) => batch.delete(item.ref))
  claimsSnap.docs.forEach((item) => batch.delete(item.ref))
  spinsSnap.docs.forEach((item) => batch.delete(item.ref))
  batch.delete(doc(db, 'games', gameId))
  await batch.commit()
}
