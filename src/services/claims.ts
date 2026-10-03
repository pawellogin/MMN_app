import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  type DocumentReference,
  type Firestore,
  type Transaction,
} from 'firebase/firestore'
import { parseLocalized } from '../i18n/localized'
import { requireDb } from '../lib/firebase'
import { parseHintOrder, type Hint, type UnlockedHint } from '../types/game'

export type ClaimResult = {
  characterName: Hint['text']
  hint: Hint
}

export type RouletteColor = 'red' | 'black'

export type SpinResult = {
  choice: RouletteColor
  landed: RouletteColor
  won: boolean
  characterName: Hint['text']
  hint: Hint | null
}

type PreparedClaim = {
  codeRef: DocumentReference
  gameId: string
  hintsUsed: number
  unlocked: UnlockedHint[]
  characterName: Hint['text']
  nextHint: Hint
}

async function prepareClaim(
  db: Firestore,
  tx: Transaction,
  accessCode: string,
  characterId: string,
): Promise<PreparedClaim> {
  const codeRef = doc(db, 'accessCodes', accessCode)
  const characterRef = doc(db, 'characters', characterId)

  const [codeSnap, characterSnap] = await Promise.all([
    tx.get(codeRef),
    tx.get(characterRef),
  ])

  if (!codeSnap.exists()) {
    throw new Error('codeMissing')
  }
  if (!characterSnap.exists()) {
    throw new Error('characterMissing')
  }

  const codeData = codeSnap.data()
  const characterData = characterSnap.data()

  if (codeData.active === false) {
    throw new Error('codeDisabled')
  }

  const hintsTotal = Number(codeData.hintsTotal ?? 0)
  const hintsUsed = Number(codeData.hintsUsed ?? 0)
  if (hintsUsed >= hintsTotal) {
    throw new Error('noTeamHints')
  }

  if (characterData.gameId !== codeData.gameId) {
    throw new Error('wrongGame')
  }

  const hints: Hint[] = Array.isArray(characterData.hints)
    ? characterData.hints.map((hint: { id?: string; text?: unknown }) => ({
        id: String(hint.id),
        text: parseLocalized(hint.text),
      }))
    : []
  const unlocked: UnlockedHint[] = Array.isArray(codeData.unlocked)
    ? [...(codeData.unlocked as UnlockedHint[])]
    : []
  const claimedHintIds = unlocked
    .filter((item) => item.characterId === characterId)
    .map((item) => String(item.hintId))
  const maxHints = Number(characterData.maxHints ?? hints.length)

  if (claimedHintIds.length >= maxHints) {
    throw new Error('characterEmpty')
  }

  const unusedHints = hints.filter((hint) => !claimedHintIds.includes(hint.id))
  const nextHint =
    parseHintOrder(characterData.hintOrder) === 'random'
      ? unusedHints[Math.floor(Math.random() * unusedHints.length)]
      : unusedHints[0]
  if (!nextHint) {
    throw new Error('noUnusedHint')
  }

  return {
    codeRef,
    gameId: String(codeData.gameId),
    hintsUsed,
    unlocked,
    characterName: parseLocalized(characterData.name, 'Character'),
    nextHint,
  }
}

function commitClaim(
  db: Firestore,
  tx: Transaction,
  accessCode: string,
  characterId: string,
  prepared: PreparedClaim,
): void {
  const { codeRef, gameId, hintsUsed, unlocked, characterName, nextHint } = prepared

  tx.update(codeRef, {
    hintsUsed: hintsUsed + 1,
    unlocked: [
      ...unlocked,
      {
        characterId,
        characterName,
        hintId: nextHint.id,
        hintText: nextHint.text,
        claimedAtMs: Date.now(),
      },
    ],
  })

  tx.set(doc(db, 'claims', `${accessCode}_${characterId}_${nextHint.id}`), {
    accessCode,
    gameId,
    characterId,
    characterName,
    hintId: nextHint.id,
    hintText: nextHint.text,
    claimedAt: serverTimestamp(),
  })
}

export async function claimNextHint(
  accessCode: string,
  characterId: string,
): Promise<ClaimResult> {
  const db = requireDb()

  return runTransaction(db, async (tx) => {
    const prepared = await prepareClaim(db, tx, accessCode, characterId)
    commitClaim(db, tx, accessCode, characterId, prepared)
    return {
      characterName: prepared.characterName,
      hint: prepared.nextHint,
    }
  })
}

export async function spinForHint(
  accessCode: string,
  characterId: string,
  choice: RouletteColor,
): Promise<SpinResult> {
  const db = requireDb()

  return runTransaction(db, async (tx) => {
    const prepared = await prepareClaim(db, tx, accessCode, characterId)
    const landed: RouletteColor = Math.random() < 0.5 ? 'red' : 'black'
    const won = landed === choice

    if (won) {
      commitClaim(db, tx, accessCode, characterId, prepared)
    } else {
      tx.update(prepared.codeRef, { hintsUsed: prepared.hintsUsed + 1 })
    }

    tx.set(doc(collection(db, 'spins')), {
      accessCode,
      gameId: prepared.gameId,
      characterId,
      choice,
      landed,
      won,
      spunAt: serverTimestamp(),
    })

    return {
      choice,
      landed,
      won,
      characterName: prepared.characterName,
      hint: won ? prepared.nextHint : null,
    }
  })
}
