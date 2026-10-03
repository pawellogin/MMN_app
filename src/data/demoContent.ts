import type { LocalizedString } from '../i18n/localized'

export const TEST_GAME_ID = 'test-game'
export const TEST_JOIN_CODE = 'TEST01'

const CHARACTERS: Array<{ en: string; pl: string; bg: string; accent: string }> = [
  { en: 'Ada', pl: 'Ada', bg: '#e7d7c4', accent: '#6b4f3a' },
  { en: 'Boris', pl: 'Borys', bg: '#d5e4f2', accent: '#355f86' },
  { en: 'Clara', pl: 'Klara', bg: '#f0d8dc', accent: '#8a3f52' },
  { en: 'Diego', pl: 'Diego', bg: '#dce8d5', accent: '#3f6b3a' },
  { en: 'Elena', pl: 'Elena', bg: '#ece4d0', accent: '#7a6230' },
  { en: 'Farid', pl: 'Farid', bg: '#ddd7ec', accent: '#52407a' },
  { en: 'Greta', pl: 'Greta', bg: '#d8ece8', accent: '#2f6b62' },
  { en: 'Hiro', pl: 'Hiro', bg: '#f0e0cc', accent: '#8a4b28' },
]

const HINT_TEMPLATES: Array<{ id: string; en: string; pl: string }> = [
  {
    id: 'h1',
    en: 'Look near the old map.',
    pl: 'Szukaj przy starej mapie.',
  },
  {
    id: 'h2',
    en: 'The password uses a colour.',
    pl: 'Hasło zawiera kolor.',
  },
  {
    id: 'h3',
    en: 'Count the windows twice.',
    pl: 'Policz okna dwa razy.',
  },
]

function portraitDataUrl(bg: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="${bg}"/><path fill="none" stroke="${accent}" stroke-width="34" stroke-linecap="round" d="M134 156c0-53 132-53 132 0 0 38-66 50-66 100"/><circle cx="200" cy="309" r="21" fill="${accent}"/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export type DemoCharacter = {
  name: LocalizedString
  imageUrl: string
  hints: Array<{ id: string; text: LocalizedString }>
}

export const TEST_CHARACTERS: DemoCharacter[] = CHARACTERS.map((character) => ({
  name: { en: character.en, pl: character.pl },
  imageUrl: portraitDataUrl(character.bg, character.accent),
  hints: HINT_TEMPLATES.map((hint) => ({
    id: hint.id,
    text: {
      en: `${character.en} hint ${hint.id.slice(1)}: ${hint.en}`,
      pl: `${character.pl}, wskazówka ${hint.id.slice(1)}: ${hint.pl}`,
    },
  })),
}))

export const TEST_GAME = {
  name: { en: 'Test game', pl: 'Gra testowa' } satisfies LocalizedString,
  languages: ['en', 'pl'] as Array<'en' | 'pl'>,
  active: true,
  hintLimit: 12,
}

export const TEST_ACCESS_CODE = {
  code: TEST_JOIN_CODE,
  gameId: TEST_GAME_ID,
  label: { en: 'Test team', pl: 'Zespół testowy' } satisfies LocalizedString,
  hintsTotal: 12,
  hintsUsed: 0,
  active: true,
  unlocked: [] as [],
}
