import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  List,
  Modal,
  Row,
  Statistic,
  Typography,
  message,
} from 'antd'
import { Navigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { CharacterCover } from '../components/CharacterCover'
import { RouletteModal } from '../components/RouletteModal'
import { SiteLayout } from '../components/SiteLayout'
import { useLanguage } from '../context/LanguageContext'
import { useSession } from '../context/SessionContext'
import { pickLocalized } from '../i18n/localized'
import { translateError } from '../i18n/translations'
import { clearRouletteIntro, hasRouletteIntro } from '../lib/session'
import { subscribeAccessCode } from '../services/accessCodes'
import {
  claimedCountForCharacter,
  remainingHintsForCharacter,
  subscribeCharacters,
} from '../services/characters'
import { claimNextHint, spinForHint } from '../services/claims'
import { subscribeGame } from '../services/games'
import type { AccessCodeDoc, Character, Game, UnlockedHint } from '../types/game'
import {
  BodyText,
  Container,
  Eyebrow,
  PageHeading,
  PageShell,
  SectionTitle,
  SubTitle,
} from '../styles/layout'
import { colors } from '../styles/theme'

const { Paragraph, Text } = Typography

const CodeBadge = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 2px 10px;
  border: 1px solid ${colors.primary};
  color: ${colors.text};
  font-weight: 600;
  letter-spacing: 2px;
`

const CountBadge = styled.span<{ available: boolean }>`
  padding: 0 8px;
  border: 1px solid ${({ available }) => (available ? colors.primary : colors.border)};
  background: ${({ available }) => (available ? colors.primary : 'transparent')};
  color: ${({ available }) => (available ? colors.text : colors.textSubtle)};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
`

const HintsCounter = styled.div`
  .ant-statistic-title {
    margin-bottom: 0;
    color: ${colors.textMuted};
  }
`

const Section = styled.section`
  margin-bottom: 64px;
`

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  background: ${colors.black};
  border: 1px solid ${colors.border};
`

function resolveUnlocked(
  item: UnlockedHint,
  characters: Character[],
  lang: 'en' | 'pl',
): { title: string; text: string } {
  const character = characters.find((entry) => entry.id === item.characterId)
  const hint = character?.hints.find((entry) => entry.id === item.hintId)
  const name = character
    ? pickLocalized(character.name, lang)
    : pickLocalized(item.characterName, lang)
  const text = hint
    ? pickLocalized(hint.text, lang)
    : pickLocalized(item.hintText, lang)

  return {
    title: `${name} · ${item.hintId}`,
    text,
  }
}

export function PlayPage() {
  const { session, logout } = useSession()
  const { lang, t } = useLanguage()
  const [access, setAccess] = useState<AccessCodeDoc | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [error, setError] = useState<string | null>(null)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [lastHint, setLastHint] = useState<{
    characterName: string
    text: string
  } | null>(null)
  const [game, setGame] = useState<Game | null>(null)
  const [rouletteCharacter, setRouletteCharacter] = useState<Character | null>(null)
  const [rouletteOpen, setRouletteOpen] = useState(false)
  const [introPending, setIntroPending] = useState(() => hasRouletteIntro())

  useEffect(() => {
    if (!session) return

    const unsubCode = subscribeAccessCode(
      session.code,
      setAccess,
      (err) => setError(err.message),
    )
    const unsubChars = subscribeCharacters(
      session.gameId,
      setCharacters,
      (err) => setError(err.message),
    )
    const unsubGame = subscribeGame(
      session.gameId,
      setGame,
      (err) => setError(err.message),
    )

    return () => {
      unsubCode()
      unsubChars()
      unsubGame()
    }
  }, [session])

  const closeIntro = () => {
    clearRouletteIntro()
    setIntroPending(false)
  }

  const hintsLeft = useMemo(() => {
    if (!access) return 0
    return Math.max(0, access.hintsTotal - access.hintsUsed)
  }, [access])

  if (!session) {
    return <Navigate to="/" replace />
  }

  const onClaim = (character: Character) => {
    if (!access || hintsLeft <= 0 || remainingHintsForCharacter(character, access.unlocked) <= 0) {
      return
    }
    if (game?.rouletteEnabled) {
      setRouletteCharacter(character)
      setRouletteOpen(true)
      return
    }
    const name = pickLocalized(character.name, lang)

    Modal.confirm({
      title: t.takeHintConfirmTitle(name),
      content: t.takeHintConfirmBody(hintsLeft),
      okText: t.takeHint,
      onOk: async () => {
        setClaimingId(character.id)
        try {
          const result = await claimNextHint(session.code, character.id)
          setLastHint({
            characterName: pickLocalized(result.characterName, lang),
            text: pickLocalized(result.hint.text, lang),
          })
        } catch (err) {
          const raw = err instanceof Error ? err.message : 'claimFailed'
          message.error(translateError(lang, raw) || t.claimFailed)
        } finally {
          setClaimingId(null)
        }
      },
    })
  }

  return (
    <SiteLayout
      nav={[{ to: '/play', label: t.navPlay }]}
      actions={<Button onClick={logout}>{t.logOut}</Button>}
    >
      <PageShell>
        <Container>
          <PageHeading>
            <div>
              <Eyebrow>{t.playEyebrow}</Eyebrow>
              <SectionTitle style={{ marginBottom: 8 }}>
                {access
                  ? pickLocalized(access.label, lang)
                  : pickLocalized(session.label, lang)}
              </SectionTitle>
              <BodyText style={{ marginBottom: 0 }}>
                {t.codeLabel}: <CodeBadge>{session.code}</CodeBadge>
              </BodyText>
            </div>
            <HintsCounter>
              <Statistic
                title={t.hintsLeft}
                value={hintsLeft}
                suffix={`/ ${access?.hintsTotal ?? '—'}`}
              />
            </HintsCounter>
          </PageHeading>

          {error && (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              message={translateError(lang, error)}
              description={t.dataErrorHint}
            />
          )}

          {hintsLeft <= 0 && (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message={t.allHintsUsed}
            />
          )}

          <Section>
            <SubTitle>{t.characters}</SubTitle>
            <Row gutter={[24, 24]}>
              {characters.map((character) => {
                const unlocked = access?.unlocked ?? []
                const left = remainingHintsForCharacter(character, unlocked)
                const available = left > 0 && hintsLeft > 0
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={character.id}>
                    <Card
                      size="small"
                      hoverable
                      style={{ overflow: 'hidden' }}
                      cover={
                        <CharacterCover
                          src={character.imageUrl}
                          alt={pickLocalized(character.name, lang)}
                        />
                      }
                      title={pickLocalized(character.name, lang)}
                      extra={
                        <CountBadge available={available}>
                          {claimedCountForCharacter(character, unlocked)}/{character.maxHints}
                        </CountBadge>
                      }
                      actions={[
                        <Button
                          key="take"
                          type="primary"
                          disabled={!available}
                          loading={claimingId === character.id}
                          onClick={() => onClaim(character)}
                        >
                          {t.takeHint}
                        </Button>,
                      ]}
                    >
                      <Text type="secondary">
                        {available ? t.hintsAvailable(left) : t.noHintsOnCharacter}
                      </Text>
                    </Card>
                  </Col>
                )
              })}
            </Row>

            {characters.length === 0 && !error && (
              <Empty description={t.noCharacters} />
            )}
          </Section>

          <Section>
            <SubTitle>{t.unlockedHints}</SubTitle>
            <List
              bordered
              style={{ background: colors.black }}
              dataSource={[...(access?.unlocked ?? [])].reverse()}
              locale={{ emptyText: t.noUnlocked }}
              renderItem={(item) => {
                const resolved = resolveUnlocked(item, characters, lang)
                const character = characters.find((entry) => entry.id === item.characterId)
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={character?.imageUrl || '/character-placeholder.svg'}
                          alt=""
                        />
                      }
                      title={resolved.title}
                      description={
                        <Text style={{ color: colors.textMuted, fontSize: 16 }}>
                          {resolved.text}
                        </Text>
                      }
                    />
                  </List.Item>
                )
              }}
            />
          </Section>
        </Container>

        <Modal
          open={Boolean(lastHint)}
          title={lastHint ? `${t.hint} · ${lastHint.characterName}` : t.hint}
          onCancel={() => setLastHint(null)}
          onOk={() => setLastHint(null)}
          okText={t.gotIt}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <Paragraph style={{ fontSize: 18, lineHeight: '32px', marginBottom: 0 }}>
            {lastHint?.text}
          </Paragraph>
        </Modal>

        <RouletteModal
          open={rouletteOpen}
          characterName={rouletteCharacter ? pickLocalized(rouletteCharacter.name, lang) : ''}
          hintsLeft={hintsLeft}
          onSpin={(choice) => {
            if (!rouletteCharacter) return Promise.reject(new Error('characterMissing'))
            return spinForHint(session.code, rouletteCharacter.id, choice)
          }}
          onError={(err) => {
            const raw = err instanceof Error ? err.message : 'claimFailed'
            message.error(translateError(lang, raw) || t.claimFailed)
          }}
          onClose={() => setRouletteOpen(false)}
        />

        <Modal
          open={introPending && Boolean(game?.rouletteEnabled)}
          title={t.rouletteIntroTitle}
          onCancel={closeIntro}
          onOk={closeIntro}
          okText={t.gotIt}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <Paragraph>{t.rouletteIntroLead}</Paragraph>
          <ol style={{ paddingLeft: 20, marginBottom: 0 }}>
            {t.rouletteIntroSteps.map((step) => (
              <li key={step} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 16 }}>{step}</Text>
              </li>
            ))}
          </ol>
        </Modal>
      </PageShell>
    </SiteLayout>
  )
}
