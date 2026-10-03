import { ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import plPL from 'antd/locale/pl_PL'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { SessionProvider } from './context/SessionContext'
import { LoginPage } from './pages/LoginPage'
import { PlayPage } from './pages/PlayPage'
import { AdminGuard } from './pages/admin/AdminGuard'
import { AdminGameEditorPage } from './pages/admin/AdminGameEditorPage'
import { AdminGamesPage } from './pages/admin/AdminGamesPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { appTheme } from './styles/theme'

ConfigProvider.config({
  holderRender: (children) => (
    <ConfigProvider theme={appTheme}>{children}</ConfigProvider>
  ),
})

function ThemedApp() {
  const { lang } = useLanguage()

  return (
    <ConfigProvider
      locale={lang === 'pl' ? plPL : enUS}
      theme={appTheme}
    >
      <SessionProvider>
        <AdminProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/play" element={<PlayPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route element={<AdminGuard />}>
                <Route path="/admin/games" element={<AdminGamesPage />} />
                <Route path="/admin/games/:gameId" element={<AdminGameEditorPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </SessionProvider>
    </ConfigProvider>
  )
}

function App() {
  return (
    <LanguageProvider>
      <ThemedApp />
    </LanguageProvider>
  )
}

export default App
