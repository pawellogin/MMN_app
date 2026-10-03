import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearSession,
  loadSession,
  markRouletteIntro,
  saveSession,
} from '../lib/session'
import { loginWithAccessCode } from '../services/accessCodes'
import type { Session } from '../types/game'

type SessionContextValue = {
  session: Session | null
  login: (code: string) => Promise<void>
  logout: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => loadSession())

  const login = useCallback(async (code: string) => {
    const next = await loginWithAccessCode(code)
    saveSession(next)
    markRouletteIntro()
    setSession(next)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      login,
      logout,
    }),
    [session, login, logout],
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return ctx
}
