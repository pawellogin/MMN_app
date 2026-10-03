const ADMIN_KEY = 'mmn_admin'

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(ADMIN_KEY) === '1'
}

export function setAdminLoggedIn(): void {
  sessionStorage.setItem(ADMIN_KEY, '1')
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_KEY)
}

export function getExpectedAdminPin(): string {
  const pin = import.meta.env.VITE_ADMIN_PIN
  return typeof pin === 'string' && pin.length > 0 ? pin : 'mmn-admin'
}

export function verifyAdminPin(pin: string): boolean {
  return pin.trim() === getExpectedAdminPin()
}
