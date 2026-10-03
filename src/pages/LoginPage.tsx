import { useState } from 'react'
import { Alert, Button, Form, Input, message } from 'antd'
import { Navigate } from 'react-router-dom'
import { SiteLayout } from '../components/SiteLayout'
import { useLanguage } from '../context/LanguageContext'
import { useSession } from '../context/SessionContext'
import { translateError } from '../i18n/translations'
import { firebaseReady } from '../lib/firebase'
import { Eyebrow, Hero, HeroContent, HeroTitle, Lead, Panel } from '../styles/layout'

export function LoginPage() {
  const { session, login } = useSession()
  const { lang, t } = useLanguage()
  const [submitting, setSubmitting] = useState(false)

  if (session) {
    return <Navigate to="/play" replace />
  }

  const onFinish = async (values: { code: string }) => {
    setSubmitting(true)
    try {
      await login(values.code)
      message.success(t.loggedIn)
    } catch (error) {
      const raw = error instanceof Error ? error.message : 'loginFailed'
      message.error(translateError(lang, raw) || t.loginFailed)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SiteLayout
      nav={[
        { to: '/', label: t.backToLogin },
        { to: '/admin', label: t.openAdmin },
      ]}
    >
      <Hero>
        <HeroContent>
          <Eyebrow>{t.heroEyebrow}</Eyebrow>
          <HeroTitle>{t.appName}</HeroTitle>
          <Lead>{t.loginLead}</Lead>

          <Panel>
            {!firebaseReady && (
              <Alert
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
                message={t.firebaseMissing}
                description={t.firebaseMissingHint}
              />
            )}

            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item
                label={t.accessCode}
                name="code"
                rules={[{ required: true, message: t.accessCodeRequired }]}
              >
                <Input
                  size="large"
                  placeholder={t.accessCodePlaceholder}
                  autoComplete="off"
                  disabled={!firebaseReady}
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={submitting}
                disabled={!firebaseReady}
              >
                {t.logIn}
              </Button>
            </Form>
          </Panel>
        </HeroContent>
      </Hero>
    </SiteLayout>
  )
}
