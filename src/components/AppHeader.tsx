import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { useLanguage } from '../context/LanguageContext'
import { breakpoints, colors, sizes, transition } from '../styles/theme'
import { LanguageSwitch } from './LanguageSwitch'

export type NavItem = {
  to: string
  label: string
  external?: boolean
}

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  transition: ${transition};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 200px;
    background: linear-gradient(
      180deg,
      ${colors.headerGradientStart} 0,
      rgba(0, 0, 0, 0) 100%
    );
    pointer-events: none;
  }

  @media (min-width: 1001px) {
    &:hover {
      background-color: ${colors.overlay};
    }
  }
`

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1860px;
  height: ${sizes.headerHeight}px;
  margin: 0 auto;
  padding: 0 ${sizes.containerPadX}px;

  ${breakpoints.wide} {
    padding: 0 48px;
  }

  ${breakpoints.tablet} {
    height: 80px;
  }

  ${breakpoints.mobile} {
    padding: 0 20px;
  }
`

const Logo = styled.a`
  display: flex;
  align-items: center;
  padding-right: 48px;

  img {
    height: ${sizes.logoHeight}px;
    max-height: 85px;
    width: auto;
    display: block;

    ${breakpoints.tablet} {
      height: 56px;
    }
  }
`

const Menu = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 40px;

  ${breakpoints.tablet} {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    height: auto;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 32px 20px 40px;
    background: ${colors.overlay};
    box-shadow: ${colors.shadow};
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-16px)')};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transition: ${transition};
  }
`

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 32px;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;

  ${breakpoints.tablet} {
    flex-direction: column;
    gap: 20px;
    height: auto;
  }
`

const navLinkStyles = `
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  color: ${colors.text};
  font-size: ${sizes.nav}px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 1px;
  text-decoration: none;
  text-transform: uppercase;
  transition: ${transition};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 7px;
    background-color: ${colors.primary};
    opacity: 0;
    transition: ${transition};
  }

  &:hover::after,
  &.active::after {
    opacity: 1;
  }

  @media (max-width: 1000px) {
    &::after {
      display: none;
    }

    &:hover,
    &.active {
      color: ${colors.primary};
    }
  }
`

const NavItemLi = styled.li`
  height: 100%;

  a {
    ${navLinkStyles}
  }

  ${breakpoints.tablet} {
    height: auto;
  }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  ${breakpoints.tablet} {
    flex-direction: column;
  }
`

const Hamburger = styled.button<{ isOpen: boolean }>`
  display: none;
  position: relative;
  width: 32px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  span,
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 32px;
    height: 2px;
    background: ${colors.text};
    border-radius: 5px;
    transition: all 0.5s ease-in-out;
  }

  span {
    top: 19px;
    width: 24px;
    left: 8px;
    opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
  }

  &::before {
    top: ${({ isOpen }) => (isOpen ? '19px' : '10px')};
    transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg)' : 'none')};
    background: ${({ isOpen }) => (isOpen ? colors.primary : colors.text)};
  }

  &::after {
    top: ${({ isOpen }) => (isOpen ? '19px' : '28px')};
    transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg)' : 'none')};
    background: ${({ isOpen }) => (isOpen ? colors.primary : colors.text)};
  }

  ${breakpoints.tablet} {
    display: block;
  }
`

type Props = {
  nav?: NavItem[]
  actions?: ReactNode
}

export function AppHeader({ nav = [], actions }: Props) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <Bar>
      <Inner>
        <Logo
          href="https://murdermysterynight.pl/"
          target="_blank"
          rel="noreferrer"
          title={t.logoLinkTitle}
          aria-label={t.logoLinkTitle}
        >
          <img src="/brand/logo.webp" alt={t.appName} />
        </Logo>
        <Menu isOpen={open}>
          {nav.length > 0 && (
            <NavList>
              {nav.map((item) => (
                <NavItemLi key={item.to}>
                  {item.external ? (
                    <a href={item.to} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <NavLink to={item.to} end onClick={() => setOpen(false)}>
                      {item.label}
                    </NavLink>
                  )}
                </NavItemLi>
              ))}
            </NavList>
          )}
          <Actions>
            <LanguageSwitch compact />
            {actions}
          </Actions>
        </Menu>
        <Hamburger
          type="button"
          isOpen={open}
          aria-label={t.menu}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
        </Hamburger>
      </Inner>
    </Bar>
  )
}
