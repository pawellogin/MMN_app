import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Collapse,
  Empty,
  List,
  Modal,
  Space,
  Tag,
  Typography,
  message,
} from 'antd'
import styled from '@emotion/styled'
import { RightOutlined } from '@ant-design/icons'
import { useLanguage } from '../../context/LanguageContext'
import { pickLocalized } from '../../i18n/localized'
import { translateError } from '../../i18n/translations'
import {
  createGameCode,
  deleteAccessCode,
  resetAccessCode,
  subscribeGameCodes,
} from '../../services/accessCodes'
import { Block } from '../../styles/layout'
import { colors } from '../../styles/theme'
import type { AccessCodeDoc } from '../../types/game'

const { Paragraph, Text } = Typography

const FieldLabel = styled.span`
  display: block;
  color: ${colors.text};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
`

const PanelToggle = styled.button<{ expanded: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  .anticon {
    color: ${colors.primary};
    font-size: 14px;
    transition: transform 0.2s;
    transform: rotate(${({ expanded }) => (expanded ? 90 : 0)}deg);
  }

  &:hover > span:last-of-type {
    color: ${colors.primary};
  }
`

const CodeBadge = styled.span`
  padding: 2px 10px;
  border: 1px solid ${colors.primary};
  color: ${colors.text};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
`

const CodeCard = styled.div`
  padding: 16px 0;
  border-top: 1px solid ${colors.border};

  &:first-of-type {
    border-top: none;
  }
`

const CodeHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`

function formatTime(ms: number, lang: 'en' | 'pl'): string {
  if (!ms) return ''
  return new Date(ms).toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function GameCodesPanel({ gameId }: { gameId: string | null }) {
  const { lang, t } = useLanguage()
  const [codes, setCodes] = useState<AccessCodeDoc[]>([])
  const [loading, setLoading] = useState(Boolean(gameId))
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!gameId) return
    setLoading(true)
    return subscribeGameCodes(
      gameId,
      (next) => {
        setCodes(next)
        setError(null)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )
  }, [gameId])

  const onAdd = async () => {
    if (!gameId) return
    setAdding(true)
    try {
      const code = await createGameCode(gameId)
      setExpanded(true)
      message.success(t.codeAdded(code))
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'codeGenFailed'
      message.error(translateError(lang, raw))
    } finally {
      setAdding(false)
    }
  }

  const onCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    message.success(t.copied)
  }

  const onReset = (code: string) => {
    Modal.confirm({
      title: t.resetCode,
      content: t.resetCodeConfirm(code),
      okText: t.resetCode,
      okButtonProps: { danger: true },
      onOk: async () => {
        await resetAccessCode(code)
        message.success(t.resetDone)
      },
    })
  }

  const onDelete = (code: string) => {
    Modal.confirm({
      title: t.deleteCode,
      content: t.deleteCodeConfirm(code),
      okText: t.deleteCode,
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteAccessCode(code)
        message.success(t.codeDeleted)
      },
    })
  }

  return (
    <Block>
      <Space
        wrap
        align="center"
        style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }}
      >
        <PanelToggle
          type="button"
          expanded={expanded}
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          <RightOutlined />
          <FieldLabel>
            {t.gameCodes} ({codes.length})
          </FieldLabel>
        </PanelToggle>
        <Button type="primary" disabled={!gameId} loading={adding} onClick={() => void onAdd()}>
          {t.addCode}
        </Button>
      </Space>

      {expanded && (
        <>
          <Paragraph type="secondary">{gameId ? t.gameCodesHelp : t.joinCodeOnSave}</Paragraph>

          {error && (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              message={translateError(lang, error)}
            />
          )}

          {gameId && !loading && codes.length === 0 && !error && (
            <Empty description={t.noCodes} />
          )}

          {codes.map((access) => {
            const unlocked = [...access.unlocked].sort((a, b) => a.claimedAtMs - b.claimedAtMs)
            return (
              <CodeCard key={access.code}>
                <CodeHeader>
                  <Space wrap align="center">
                    <CodeBadge>{access.code}</CodeBadge>
                    <Tag color={access.hintsUsed >= access.hintsTotal ? 'red' : undefined}>
                      {t.usedHints}: {access.hintsUsed} / {access.hintsTotal}
                    </Tag>
                  </Space>
                  <Space wrap>
                    <Button onClick={() => void onCopy(access.code)}>{t.copyCode}</Button>
                    <Button danger onClick={() => onReset(access.code)}>
                      {t.resetCode}
                    </Button>
                    <Button danger onClick={() => onDelete(access.code)}>
                      {t.deleteCode}
                    </Button>
                  </Space>
                </CodeHeader>
                <Collapse
                  size="small"
                  items={[
                    {
                      key: 'hints',
                      label: t.takenHints(unlocked.length),
                      children: (
                        <List
                          size="small"
                          dataSource={unlocked}
                          locale={{ emptyText: t.noUnlocked }}
                          renderItem={(item, index) => (
                            <List.Item
                              extra={
                                <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
                                  {formatTime(item.claimedAtMs, lang)}
                                </Text>
                              }
                            >
                              <div>
                                <Text strong>
                                  {index + 1}. {pickLocalized(item.characterName, lang)}
                                </Text>
                                <div style={{ color: colors.textMuted }}>
                                  {pickLocalized(item.hintText, lang)}
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      ),
                    },
                  ]}
                />
              </CodeCard>
            )
          })}
        </>
      )}
    </Block>
  )
}
