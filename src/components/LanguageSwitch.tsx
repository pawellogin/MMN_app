import { Select, Typography } from 'antd'
import styled from '@emotion/styled'
import { useLanguage } from '../context/LanguageContext'
import type { Lang } from '../i18n/localized'
import { colors } from '../styles/theme'

const { Text } = Typography

const Toggle = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${colors.inputBorder};
`

const ToggleButton = styled.button<{ isActive: boolean }>`
  padding: 6px 12px;
  border: 0;
  background: ${({ isActive }) => (isActive ? colors.primary : 'transparent')};
  color: ${colors.text};
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: ${({ isActive }) => (isActive ? colors.text : colors.primary)};
  }
`

const LANGS: Lang[] = ['pl', 'en']

type Props = {
  block?: boolean
  compact?: boolean
}

export function LanguageSwitch({ block = false, compact = false }: Props) {
  const { lang, setLang, t } = useLanguage()

  if (compact) {
    return (
      <Toggle role="group" aria-label={t.language}>
        {LANGS.map((code) => (
          <ToggleButton
            key={code}
            type="button"
            isActive={lang === code}
            aria-pressed={lang === code}
            onClick={() => setLang(code)}
          >
            {code}
          </ToggleButton>
        ))}
      </Toggle>
    )
  }

  return (
    <div>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        {t.language}
      </Text>
      <Select
        value={lang}
        onChange={setLang}
        style={{ width: block ? '100%' : 160 }}
        options={[
          { value: 'en', label: 'English' },
          { value: 'pl', label: 'Polski' },
        ]}
      />
    </div>
  )
}
