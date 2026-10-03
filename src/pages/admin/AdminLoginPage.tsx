import { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { Navigate } from 'react-router-dom'
import { SiteLayout } from '../../components/SiteLayout'
import { useAdmin } from '../../context/AdminContext'
import { useLanguage } from '../../context/LanguageContext'
import { translateError } from '../../i18n/translations'
import { firebaseReady } from '../../lib/firebase'
import { Eyebrow, Hero, HeroContent, HeroTitle, Lead, Panel } from '../../styles/layout'

export function AdminLoginPage() {
  const { isAdmin, login } = useAdmin()
  const { lang, t } = useLanguage()
  const [submitting, setSubmitting] = useState(false)

  if (isAdmin) {
    return <Navigate to="/admin/games" replace />
  }

  const onFinish = (values: { pin: string }) => {
    setSubmitting(true)
    try {
      login(values.pin)
    } catch (error) {
      const raw = error instanceof Error ? error.message : 'wrongPin'
      message.error(translateError(lang, raw))
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
          <Eyebrow>{t.adminEyebrow}</Eyebrow>
          <HeroTitle>{t.adminTitle}</HeroTitle>
          <Lead>{t.adminLead}</Lead>

          <Panel>
            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item
                label={t.adminPin}
                name="pin"
                rules={[{ required: true, message: t.adminPinRequired }]}
              >
                <Input.Password
                  size="large"
                  disabled={!firebaseReady}
                  autoComplete="current-password"
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
                {t.adminEnter}
              </Button>
            </Form>
          </Panel>
        </HeroContent>
      </Hero>
    </SiteLayout>
  )
}
