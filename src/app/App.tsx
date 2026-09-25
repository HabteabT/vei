import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../layouts/AppShell'
import { AuthLayout } from '../layouts/AuthLayout'
import { MarketingLayout } from '../layouts/MarketingLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { SignupPage } from '../pages/auth/SignupPage'
import { MePage } from '../pages/app/MePage'
import { PlacePage } from '../pages/app/PlacePage'
import { Landing } from '../pages/landing/Landing'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ToastProvider } from '../ui/Toast'
import { AuthProvider } from './auth'
import { FEATURES } from './features'
import { GuestOnly, RequireAuth } from './guards'
import { useTheme } from './hooks'
import { useScrollToTop } from './useScrollToTop'

/** Hash routes keep this working on plain static hosting such as GitHub Pages. */
function AppRoutes() {
  useTheme() // applies the saved theme on every screen
  useScrollToTop()
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route index element={<Landing />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="signup" element={<GuestOnly><SignupPage /></GuestOnly>} />
      </Route>

      <Route path="app" element={<AppShell />}>
        {FEATURES.map((f) => {
          const element = f.requiresAuth ? <RequireAuth>{f.element}</RequireAuth> : f.element
          return f.path === '' ? <Route key={f.id} index element={element} /> : <Route key={f.id} path={f.path} element={element} />
        })}
        <Route path="me" element={<RequireAuth><MePage /></RequireAuth>} />
        <Route path="explore/:placeId" element={<PlacePage />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  )
}
