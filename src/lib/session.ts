import type { Session } from '../types/game'

const SESSION_KEY = 'mmn_session'

export function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed.code || !parsed.gameId) return null
    return parsed
  } catch {
    return null
  }
}

export function saveSession(session: Session): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
  clearRouletteIntro()
}

const ROULETTE_INTRO_KEY = 'mmn_roulette_intro'

export function markRouletteIntro(): void {
  sessionStorage.setItem(ROULETTE_INTRO_KEY, '1')
}

export function hasRouletteIntro(): boolean {
  return sessionStorage.getItem(ROULETTE_INTRO_KEY) === '1'
}

export function clearRouletteIntro(): void {
  sessionStorage.removeItem(ROULETTE_INTRO_KEY)
}
