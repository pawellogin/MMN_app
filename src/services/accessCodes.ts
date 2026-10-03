import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore'
import { parseLocalized, type LocalizedString } from '../i18n/localized'
import { requireDb } from '../lib/firebase'
import type { AccessCodeDoc, Session, UnlockedHint } from '../types/game'
import { createUniqueJoinCode } from './joinCodes'

function mapUnlocked(raw: unknown): UnlockedHint[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    const row = item as Record<string, unknown>
    return {
      characterId: String(row.characterId ?? ''),
      characterName: parseLocalized(row.characterName, 'Character'),
      hintId: String(row.hintId ?? ''),
      hintText: parseLocalized(row.hintText),
      claimedAtMs: Number(row.claimedAtMs ?? 0),
    }
  })
}

export function mapAccessCode(id: string, data: Record<string, unknown>): AccessCodeDoc {
  return {
    id,
    code: String(data.code ?? id),
    gameId: String(data.gameId ?? ''),
    label: parseLocalized(data.label, id),
    hintsTotal: Number(data.hintsTotal ?? 0),
    hintsUsed: Number(data.hintsUsed ?? 0),
    active: Boolean(data.active ?? true),
    createdAtMs: Number(data.createdAtMs ?? 0),
    unlocked: mapUnlocked(data.unlocked),
  }
}

export function newAccessCodeDoc(
  code: string,
  gameId: string,
  label: LocalizedString,
  hintsTotal: number,
) {
  return {
    code,
    gameId,
    label,
    hintsTotal,
    hintsUsed: 0,
    active: true,
    unlocked: [],
    createdAtMs: Date.now(),
  }
}

function sortCodes(codes: AccessCodeDoc[]): AccessCodeDoc[] {
  return codes.sort((a, b) => a.createdAtMs - b.createdAtMs || a.code.localeCompare(b.code))
}

export async function loginWithAccessCode(rawCode: string): Promise<Session> {
  const code = rawCode.trim()
  if (!code) {
    throw new Error('enterCode')
  }

  const snap = await getDoc(doc(requireDb(), 'accessCodes', code))
  if (!snap.exists()) {
    throw new Error('invalidCode')
  }

  const access = mapAccessCode(snap.id, snap.data() as Record<string, unknown>)
  if (!access.active) {
    throw new Error('codeDisabled')
  }
  if (!access.gameId) {
    throw new Error('codeNotLinked')
  }

  return {
    code: access.code,
    gameId: access.gameId,
    label: access.label,
  }
}

export function subscribeAccessCode(
  code: string,
  onData: (access: AccessCodeDoc) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(requireDb(), 'accessCodes', code),
    (snap) => {
      if (!snap.exists()) {
        onError(new Error('codeGone'))
        return
      }
      onData(mapAccessCode(snap.id, snap.data() as Record<string, unknown>))
    },
    (error) => onError(error),
  )
}

export function subscribeGameCodes(
  gameId: string,
  onData: (codes: AccessCodeDoc[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(requireDb(), 'accessCodes'), where('gameId', '==', gameId)),
    (snap) => {
      onData(
        sortCodes(
          snap.docs.map((item) =>
            mapAccessCode(item.id, item.data() as Record<string, unknown>),
          ),
        ),
      )
    },
    (error) => onError(error),
  )
}

export async function listAllCodes(): Promise<AccessCodeDoc[]> {
  const snap = await getDocs(collection(requireDb(), 'accessCodes'))
  return sortCodes(
    snap.docs.map((item) => mapAccessCode(item.id, item.data() as Record<string, unknown>)),
  )
}

export async function createGameCode(gameId: string): Promise<string> {
  const db = requireDb()
  const gameSnap = await getDoc(doc(db, 'games', gameId))
  if (!gameSnap.exists()) {
    throw new Error('gameMissing')
  }

  const data = gameSnap.data()
  const code = await createUniqueJoinCode()
  await setDoc(
    doc(db, 'accessCodes', code),
    newAccessCodeDoc(
      code,
      gameId,
      parseLocalized(data.name, 'Game'),
      Number(data.hintLimit ?? 16),
    ),
  )
  return code
}

function getCodeHistory(code: string) {
  const db = requireDb()
  return Promise.all(
    ['claims', 'spins'].map((name) =>
      getDocs(query(collection(db, name), where('accessCode', '==', code))),
    ),
  )
}

export async function resetAccessCode(code: string): Promise<void> {
  const db = requireDb()
  const history = await getCodeHistory(code)

  const batch = writeBatch(db)
  batch.update(doc(db, 'accessCodes', code), {
    hintsUsed: 0,
    unlocked: [],
  })
  history.forEach((snap) => snap.docs.forEach((item) => batch.delete(item.ref)))
  await batch.commit()
}

export async function deleteAccessCode(code: string): Promise<void> {
  const db = requireDb()
  const history = await getCodeHistory(code)

  const batch = writeBatch(db)
  batch.delete(doc(db, 'accessCodes', code))
  history.forEach((snap) => snap.docs.forEach((item) => batch.delete(item.ref)))
  await batch.commit()
}
