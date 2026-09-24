import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from '../ui/Feedback'
import { useAuth } from './auth'

function Splash() {
  return (
    <div className="splash">
      <Spinner label="Checking your session" />
    </div>
  )
}

/** Pages only for signed-in visitors. Everyone else is sent to sign in, then brought back here. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, user, leftOnPurpose } = useAuth()
  const location = useLocation()
  if (status === 'loading') return <Splash />
  // Signed out on purpose (or account deleted): go home. Otherwise ask them to sign in, and come back after.
  if (!user && leftOnPurpose) return <Navigate to="/" replace />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <>{children}</>
}

/** Sign in and sign up pages. A signed-in visitor has no reason to be here. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { status, user } = useAuth()
  if (status === 'loading') return <Splash />
  if (user) return <Navigate to="/app" replace />
  return <>{children}</>
}
