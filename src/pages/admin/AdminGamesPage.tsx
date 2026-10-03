import { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Empty, List, Space, Tag, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { SiteLayout } from '../../components/SiteLayout'
import { useAdmin } from '../../context/AdminContext'
import { useLanguage } from '../../context/LanguageContext'
import { pickLocalized } from '../../i18n/localized'
import { translateError } from '../../i18n/translations'
import { listGames, type GameListItem } from '../../services/games'
import { seedTestGame } from '../../services/seedDemo'
import {
  Container,
  Eyebrow,
  PageHeading,
  PageShell,
  SectionTitle,
} from '../../styles/layout'
import { colors } from '../../styles/theme'

const GameTitle = styled.span`
  font-size: 22px;
  font-weight: 400;
  color: ${colors.text};
`

const JoinCode = styled.span`
  margin-left: 6px;
  padding: 1px 8px;
  border: 1px solid ${colors.primary};
  color: ${colors.text};
  font-weight: 600;
  letter-spacing: 2px;
`

export function AdminGamesPage() {
  const { logout } = useAdmin()
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const [games, setGames] = useState<GameListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [seeding, setSeeding] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setListError(null)
    try {
      setGames(await listGames())
    } catch (error) {
      const raw = error instanceof Error ? error.message : 'loginFailed'
      setListError(raw)
      message.error(translateError(lang, raw))
    } finally {
      setLoading(false)
    }
  }, [lang])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <SiteLayout
      nav={[
        { to: '/admin/games', label: t.gamesTitle },
        { to: '/', label: t.backToLogin },
      ]}
      actions={<Button onClick={logout}>{t.adminLogout}</Button>}
    >
      <PageShell>
        <Container narrow={1200}>
          <PageHeading>
            <div>
              <Eyebrow>{t.adminEyebrow}</Eyebrow>
              <SectionTitle style={{ marginBottom: 0 }}>{t.gamesTitle}</SectionTitle>
            </div>
            <Space wrap>
              <Button type="primary" size="large" onClick={() => navigate('/admin/games/new')}>
                {t.newGame}
              </Button>
              <Button
                size="large"
                loading={seeding}
                onClick={() => {
                  void (async () => {
                    setSeeding(true)
                    try {
                      await seedTestGame()
                      message.success(t.demoReady)
                      await load()
                    } catch (error) {
                      const raw = error instanceof Error ? error.message : 'loginFailed'
                      message.error(translateError(lang, raw))
                    } finally {
                      setSeeding(false)
                    }
                  })()
                }}
              >
                {t.loadDemo}
              </Button>
            </Space>
          </PageHeading>

          {listError ? (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
              message={t.firestoreListDeniedTitle}
              description={t.firestoreListDeniedBody}
              action={
                <Button size="small" onClick={() => void load()}>
                  {t.retry}
                </Button>
              }
            />
          ) : null}

          <List
            loading={loading}
            bordered
            size="large"
            style={{ background: colors.black }}
            dataSource={games}
            locale={{ emptyText: <Empty description={t.noGames} /> }}
            renderItem={(game) => (
              <List.Item
                actions={[
                  <Button key="edit" onClick={() => navigate(`/admin/games/${game.id}`)}>
                    {t.editGame}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={<GameTitle>{pickLocalized(game.name, lang)}</GameTitle>}
                  description={
                    <Space direction="vertical" size="small">
                      <Tag>
                        {t.hintLimit}: {game.hintLimit || '—'}
                      </Tag>
                      <Space wrap size="middle">
                        <span style={{ color: colors.textMuted }}>{t.gameCodes}:</span>
                        {game.codes.length === 0 && <span>—</span>}
                        {game.codes.map((code) => (
                          <span key={code.code} style={{ color: colors.textMuted }}>
                            <JoinCode>{code.code}</JoinCode> {code.hintsUsed}/{code.hintsTotal}
                          </span>
                        ))}
                      </Space>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Container>
      </PageShell>
    </SiteLayout>
  )
}
