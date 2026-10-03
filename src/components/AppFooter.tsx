import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { useLanguage } from '../context/LanguageContext'
import { breakpoints, colors, sizes, transition } from '../styles/theme'

const SITE_URL = 'https://murdermysterynight.pl/'
const EMAIL = 'murdermysterynightpl@gmail.com'

const Wrapper = styled.footer`
  position: relative;
  background-color: ${colors.black};
  color: ${colors.text};
  border-top: 1px solid ${colors.border};
`

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 48px;
  max-width: ${sizes.containerMax}px;
  margin: 0 auto;
  padding: ${sizes.sectionGap}px ${sizes.containerPadX}px 64px;

  ${breakpoints.wide} {
    padding-left: 48px;
    padding-right: 48px;
  }

  ${breakpoints.mobile} {
    flex-direction: column;
    padding: 56px 20px 40px;
  }
`

const Column = styled.div`
  min-width: 200px;
  flex: 1 1 0;

  &:first-of-type {
    flex: 1.4 1 0;
    max-width: 420px;
  }
`

const ColumnTitle = styled.p`
  margin: 0 0 20px;
  font-size: ${sizes.footerTitle}px;
  line-height: 1.6;
  letter-spacing: 1px;
  text-transform: uppercase;
`

const Text = styled.p`
  margin: 0 0 16px;
  color: ${colors.textMuted};
  font-size: 16px;
  line-height: 24px;
`

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  a {
    color: ${colors.textMuted};
    font-size: ${sizes.footerLink}px;
    letter-spacing: 1px;
    text-decoration: none;
    transition: ${transition};

    &:hover {
      color: ${colors.primary};
      text-decoration: underline;
    }
  }
`

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  color: ${colors.text};
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;

  svg {
    width: 20px;
    height: 20px;
    min-width: 20px;
  }

  &[href]:hover {
    color: ${colors.primary};
  }
`

const Copyright = styled.div`
  max-width: ${sizes.containerMax}px;
  margin: 0 auto;
  padding: 24px ${sizes.containerPadX}px 32px;
  font-size: ${sizes.small}px;
  color: ${colors.textMuted};

  ${breakpoints.wide} {
    padding-left: 48px;
    padding-right: 48px;
  }

  ${breakpoints.mobile} {
    padding: 20px;
  }
`

function PinIcon() {
  return (
    <svg viewBox="0 0 24 26" fill="none" aria-hidden="true">
      <path
        d="M5.7 16.25C4.03 16.94 3 17.9 3 18.96 3 21.05 7.03 22.75 12 22.75s9-1.7 9-3.79c0-1.06-1.03-2.02-2.7-2.71M12 9.75h.01M18 9.75c0 4.4-4.5 6.5-6 9.75-1.5-3.25-6-5.35-6-9.75 0-3.59 2.69-6.5 6-6.5s6 2.91 6 6.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.75 5.25 3 6v12l.75.75h16.5L21 18V6l-.75-.75H3.75ZM4.5 7.7v9.55h15V7.7L12 14.51 4.5 7.7Zm13.81-.95H5.69L12 12.49l6.31-5.74Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function AppFooter() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <Wrapper>
      <Inner>
        <Column>
          <ColumnTitle>{t.appName}</ColumnTitle>
          <Text>{t.footerAbout}</Text>
        </Column>
        <Column>
          <ColumnTitle>{t.footerContact}</ColumnTitle>
          <ContactItem as="div">
            <PinIcon />
            Szczecin, Polska
          </ContactItem>
          <ContactItem href={`mailto:${EMAIL}`}>
            <MailIcon />
            {EMAIL}
          </ContactItem>
        </Column>
        <Column>
          <ColumnTitle>{t.footerMenu}</ColumnTitle>
          <LinkList>
            <li>
              <Link to="/">{t.backToLogin}</Link>
            </li>
            <li>
              <Link to="/admin">{t.openAdmin}</Link>
            </li>
            <li>
              <a href={SITE_URL} target="_blank" rel="noreferrer">
                {t.navStories}
              </a>
            </li>
            <li>
              <a href={`${SITE_URL}kontakt`} target="_blank" rel="noreferrer">
                {t.writeToUs}
              </a>
            </li>
          </LinkList>
        </Column>
      </Inner>
      <Copyright>
        © {year} {t.footerRights}
      </Copyright>
    </Wrapper>
  )
}
