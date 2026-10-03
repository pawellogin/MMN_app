export const LANGUAGES = ['en', 'pl'] as const

export type Lang = (typeof LANGUAGES)[number]

export type LocalizedString = {
  en: string
  pl: string
}

export function isLang(value: string): value is Lang {
  return value === 'en' || value === 'pl'
}

/** First supported language from the browser / OS, otherwise English. */
export function detectSystemLang(): Lang {
  const candidates: string[] = []
  if (typeof navigator !== 'undefined') {
    if (Array.isArray(navigator.languages)) {
      candidates.push(...navigator.languages)
    }
    if (navigator.language) {
      candidates.push(navigator.language)
    }
  }

  for (const raw of candidates) {
    const code = raw.trim().toLowerCase().split('-')[0]
    if (isLang(code)) return code
  }

  return 'en'
}

export function parseLocalized(
  value: unknown,
  fallback = '',
): LocalizedString {
  if (typeof value === 'string') {
    return { en: value, pl: value }
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const en = String(record.en ?? record.pl ?? fallback)
    const pl = String(record.pl ?? record.en ?? fallback)
    return { en, pl }
  }

  return { en: fallback, pl: fallback }
}

export function pickLocalized(value: LocalizedString | string, lang: Lang): string {
  if (typeof value === 'string') return value
  return value[lang] || value.en || value.pl
}
