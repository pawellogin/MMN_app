import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'
import { requireDb } from '../lib/firebase'
import {
  TEST_ACCESS_CODE,
  TEST_CHARACTERS,
  TEST_GAME,
  TEST_GAME_ID,
  TEST_JOIN_CODE,
} from '../data/demoContent'

/** Writes / overwrites the sample test game with portraits. Safe to run next to other games. */
export async function seedTestGame(): Promise<string> {
  const db = requireDb()
  const existingChars = await getDocs(
    query(collection(db, 'characters'), where('gameId', '==', TEST_GAME_ID)),
  )

  const batch = writeBatch(db)

  existingChars.docs.forEach((item) => {
    batch.delete(item.ref)
  })

  batch.set(doc(db, 'games', TEST_GAME_ID), TEST_GAME)
  batch.set(doc(db, 'accessCodes', TEST_JOIN_CODE), {
    ...TEST_ACCESS_CODE,
    createdAtMs: Date.now(),
  })

  TEST_CHARACTERS.forEach((character, index) => {
    batch.set(doc(db, 'characters', `test-char-${index + 1}`), {
      gameId: TEST_GAME_ID,
      name: character.name,
      order: index + 1,
      maxHints: character.hints.length,
      hints: character.hints,
      imageUrl: character.imageUrl,
      imagePath: '',
    })
  })

  await batch.commit()
  return TEST_JOIN_CODE
}
