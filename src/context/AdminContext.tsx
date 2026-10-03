import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearAdminSession,
  isAdminLoggedIn,
  setAdminLoggedIn,
  verifyAdminPin,
} from '../lib/adminSession'

type AdminContextValue = {
  isAdmin: boolean
  login: (pin: string) => void
  logout: () => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => isAdminLoggedIn())

  const login = useCallback((pin: string) => {
    if (!verifyAdminPin(pin)) {
      throw new Error('wrongPin')
    }
    setAdminLoggedIn()
    setIsAdmin(true)
  }, [])

  const logout = useCallback(() => {
    clearAdminSession()
    setIsAdmin(false)
  }, [])

  const value = useMemo(
    () => ({
      isAdmin,
      login,
      logout,
    }),
    [isAdmin, login, logout],
  )

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  )
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return ctx
}
