import type { ReactNode } from 'react'
import { AppFooter } from './AppFooter'
import { AppHeader, type NavItem } from './AppHeader'

type Props = {
  nav?: NavItem[]
  actions?: ReactNode
  children: ReactNode
}

export function SiteLayout({ nav, actions, children }: Props) {
  return (
    <>
      <AppHeader nav={nav} actions={actions} />
      {children}
      <AppFooter />
    </>
  )
}
