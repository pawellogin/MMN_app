import { Input } from 'antd'
import styled from '@emotion/styled'
import { useLanguage } from '../context/LanguageContext'

const Pair = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

type Props = {
  en: string
  pl: string
  onChange: (next: { en: string; pl: string }) => void
  textarea?: boolean
  placeholderEn?: string
  placeholderPl?: string
}

export function LocalizedPair({
  en,
  pl,
  onChange,
  textarea = false,
  placeholderEn,
  placeholderPl,
}: Props) {
  const { t } = useLanguage()
  const Field = textarea ? Input.TextArea : Input

  return (
    <Pair>
      <Field
        value={en}
        placeholder={`${t.english}${placeholderEn ? ` — ${placeholderEn}` : ''}`}
        onChange={(event) => onChange({ en: event.target.value, pl })}
        autoSize={textarea ? { minRows: 2, maxRows: 6 } : undefined}
      />
      <Field
        value={pl}
        placeholder={`${t.polish}${placeholderPl ? ` — ${placeholderPl}` : ''}`}
        onChange={(event) => onChange({ en, pl: event.target.value })}
        autoSize={textarea ? { minRows: 2, maxRows: 6 } : undefined}
      />
    </Pair>
  )
}
