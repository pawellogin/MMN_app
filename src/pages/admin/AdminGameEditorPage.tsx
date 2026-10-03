import { useEffect, useState } from 'react'
import {
  Button,
  Input,
  InputNumber,
  Modal,
  Radio,
  Space,
  Switch,
  Typography,
  message,
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import styled from '@emotion/styled'
import { CharacterImageField } from '../../components/CharacterImageField'
import { LocalizedPair } from '../../components/LocalizedPair'
import { SiteLayout } from '../../components/SiteLayout'
import { useAdmin } from '../../context/AdminContext'
import { useLanguage } from '../../context/LanguageContext'
import { translateError } from '../../i18n/translations'
import {
  deleteGame,
  emptyCharacter,
  emptyGameDraft,
  emptyHint,
  loadGameDraft,
  saveGame,
  type GameDraft,
  type GameDraftCharacter,
} from '../../services/games'
import { deleteCharacterImage } from '../../services/images'
import {
  Block,
  Container,
  Eyebrow,
  PageHeading,
  PageShell,
  SectionTitle,
  SubTitle,
} from '../../styles/layout'
import { colors } from '../../styles/theme'
import { GameCodesPanel } from './GameCodesPanel'

const { Text, Paragraph } = Typography

const FieldLabel = styled.span`
  display: block;
  margin-bottom: 10px;
  color: ${colors.text};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
`

const CharacterLabel = styled.span`
  color: ${colors.primary};
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
`

const HintRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: start;
  margin-bottom: 8px;
`

export function AdminGameEditorPage() {
  const { gameId } = useParams()
  const isNew = gameId === 'new' || !gameId
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { logout } = useAdmin()
  const [draft, setDraft] = useState<GameDraft>(emptyGameDraft())
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) {
      setDraft(emptyGameDraft())
      setLoading(false)
      return
    }

    let cancelled = false
    void loadGameDraft(gameId)
      .then((loaded) => {
        if (!cancelled) setDraft(loaded)
      })
      .catch((error: unknown) => {
        const raw = error instanceof Error ? error.message : 'gameMissing'
        message.error(translateError(lang, raw))
        navigate('/admin/games')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [gameId, isNew, lang, navigate])

  const setCharacter = (id: string, next: GameDraftCharacter) => {
    setDraft((current) => ({
      ...current,
      characters: current.characters.map((character) =>
        character.id === id ? next : character,
      ),
    }))
  }

  const onSave = async () => {
    setSaving(true)
    try {
      const result = await saveGame(draft)
      const loaded = await loadGameDraft(result.gameId)
      setDraft(loaded)
      message.success(
        result.joinCode ? `${t.gameSaved} ${t.joinCode}: ${result.joinCode}` : t.gameSaved,
      )
      if (isNew) {
        navigate(`/admin/games/${result.gameId}`, { replace: true })
      }
    } catch (error) {
      const raw = error instanceof Error ? error.message : 'loginFailed'
      message.error(translateError(lang, raw))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = () => {
    if (!draft.id) return
    Modal.confirm({
      title: t.deleteGame,
      content: t.deleteGameConfirm,
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteGame(draft.id as string)
        navigate('/admin/games')
      },
    })
  }

  const nav = [
    { to: '/admin/games', label: t.backToGames },
    { to: '/', label: t.backToLogin },
  ]
  const actions = <Button onClick={logout}>{t.adminLogout}</Button>

  if (loading) {
    return (
      <SiteLayout nav={nav} actions={actions}>
        <PageShell>
          <Container narrow={1200}>
            <Paragraph>{t.editGame}…</Paragraph>
          </Container>
        </PageShell>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout nav={nav} actions={actions}>
      <PageShell>
        <Container narrow={1200}>
          <PageHeading>
            <div>
              <Eyebrow>{t.adminEyebrow}</Eyebrow>
              <SectionTitle style={{ marginBottom: 0 }}>
                {isNew ? t.newGame : t.editGame}
              </SectionTitle>
            </div>
            <Space wrap>
              <Button onClick={() => navigate('/admin/games')}>{t.backToGames}</Button>
              <Button type="primary" loading={saving} onClick={() => void onSave()}>
                {t.saveGame}
              </Button>
              <Button danger disabled={!draft.id} onClick={onDelete}>
                {t.deleteGame}
              </Button>
            </Space>
          </PageHeading>

          <GameCodesPanel gameId={draft.id} />

          <Block>
            <FieldLabel>{t.gameName}</FieldLabel>
            <LocalizedPair
              en={draft.name.en}
              pl={draft.name.pl}
              onChange={(name) => setDraft((current) => ({ ...current, name }))}
            />
          </Block>

          <Block>
            <FieldLabel>{t.hintLimit}</FieldLabel>
            <Paragraph type="secondary">{t.hintLimitHelp}</Paragraph>
            <InputNumber
              min={1}
              value={draft.hintLimit}
              onChange={(value) =>
                setDraft((current) => ({ ...current, hintLimit: Number(value ?? 1) }))
              }
            />
          </Block>

          <Block>
            <FieldLabel>{t.rouletteSetting}</FieldLabel>
            <Paragraph type="secondary">{t.rouletteSettingHelp}</Paragraph>
            <Switch
              checked={draft.rouletteEnabled}
              onChange={(checked) =>
                setDraft((current) => ({ ...current, rouletteEnabled: checked }))
              }
            />
          </Block>

          <Block>
            <FieldLabel>{t.hintOrderAll}</FieldLabel>
            <Paragraph type="secondary">{t.hintOrderAllHelp}</Paragraph>
            <Radio.Group
              optionType="button"
              value={
                draft.characters.every(
                  (character) => character.hintOrder === draft.characters[0]?.hintOrder,
                )
                  ? draft.characters[0]?.hintOrder
                  : undefined
              }
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  characters: current.characters.map((character) => ({
                    ...character,
                    hintOrder: event.target.value,
                  })),
                }))
              }
              options={[
                { value: 'sequential', label: t.hintOrderSequential },
                { value: 'random', label: t.hintOrderRandom },
              ]}
            />
          </Block>

          <SubTitle style={{ marginTop: 48 }}>{t.characters}</SubTitle>
          {draft.characters.map((character, index) => (
            <Block key={character.id} style={{ borderLeft: `3px solid ${colors.primary}` }}>
              <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 20 }} wrap>
                <CharacterLabel>
                  {t.characters} {index + 1}
                </CharacterLabel>
                <Button
                  danger
                  onClick={() => {
                    const removed = draft.characters.find((item) => item.id === character.id)
                    if (removed?.imagePath) {
                      void deleteCharacterImage(removed.imagePath)
                    }
                    setDraft((current) => ({
                      ...current,
                      characters: current.characters.filter((item) => item.id !== character.id),
                    }))
                  }}
                  disabled={draft.characters.length <= 1}
                >
                  {t.removeCharacter}
                </Button>
              </Space>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                {t.characterName}
              </Text>
              <Input
                value={character.name.en || character.name.pl}
                placeholder={t.characterName}
                onChange={(event) =>
                  setCharacter(character.id, {
                    ...character,
                    name: { en: event.target.value, pl: event.target.value },
                  })
                }
              />
              <Text type="secondary" style={{ display: 'block', margin: '16px 0 8px' }}>
                {t.characterImage}
              </Text>
              <CharacterImageField
                imageUrl={character.imageUrl}
                imagePath={character.imagePath}
                onChange={(image) => setCharacter(character.id, { ...character, ...image })}
              />
              <Text type="secondary" style={{ display: 'block', margin: '16px 0 8px' }}>
                {t.hintOrder}
              </Text>
              <Radio.Group
                optionType="button"
                value={character.hintOrder}
                onChange={(event) =>
                  setCharacter(character.id, { ...character, hintOrder: event.target.value })
                }
                options={[
                  { value: 'sequential', label: t.hintOrderSequential },
                  { value: 'random', label: t.hintOrderRandom },
                ]}
              />
              <Text type="secondary" style={{ display: 'block', margin: '16px 0 8px' }}>
                {t.hintQuestion}
              </Text>
              {character.hints.map((hint) => (
                <HintRow key={hint.id}>
                  <LocalizedPair
                    textarea
                    en={hint.en}
                    pl={hint.pl}
                    onChange={(text) =>
                      setCharacter(character.id, {
                        ...character,
                        hints: character.hints.map((item) =>
                          item.id === hint.id ? { ...item, ...text } : item,
                        ),
                      })
                    }
                  />
                  <Button
                    onClick={() =>
                      setCharacter(character.id, {
                        ...character,
                        hints: character.hints.filter((item) => item.id !== hint.id),
                      })
                    }
                    disabled={character.hints.length <= 1}
                  >
                    {t.removeHint}
                  </Button>
                </HintRow>
              ))}
              <Button onClick={() => setCharacter(character.id, {
                ...character,
                hints: [...character.hints, emptyHint()],
              })}>
                {t.addHint}
              </Button>
            </Block>
          ))}

          <Button
            onClick={() =>
              setDraft((current) => ({
                ...current,
                characters: [...current.characters, emptyCharacter()],
              }))
            }
            style={{ marginBottom: 24 }}
          >
            {t.addCharacter}
          </Button>

          <Space wrap>
            <Button type="primary" size="large" loading={saving} onClick={() => void onSave()}>
              {t.saveGame}
            </Button>
            <Button danger disabled={!draft.id} onClick={onDelete}>
              {t.deleteGame}
            </Button>
          </Space>
        </Container>
      </PageShell>
    </SiteLayout>
  )
}
