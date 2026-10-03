import { doc, getDoc } from 'firebase/firestore'
import { requireDb } from '../lib/firebase'

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function createJoinCode(): string {
  let code = ''
  for (let i = 0; i < 6; i += 1) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return code
}

export async function createUniqueJoinCode(): Promise<string> {
  const db = requireDb()

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = createJoinCode()
    const snap = await getDoc(doc(db, 'accessCodes', code))
    if (!snap.exists()) return code
  }

  throw new Error('codeGenFailed')
}
