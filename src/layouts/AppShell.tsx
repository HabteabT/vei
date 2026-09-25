import { Lock } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../app/auth'
import { FEATURES } from '../app/features'
import { useServices } from '../app/services'
import { CitySearch } from '../components/CitySearch'
import { LiveDataSwitch } from '../components/LiveDataSwitch'
import { ThemeToggle } from '../components/ThemeToggle'
import { UserMenu } from '../components/UserMenu'
import { Alert } from '../ui/Feedback'
import { Logo } from '../ui/Logo'

function Nav({ variant }: { variant: 'side' | 'bottom' }) {
  const { user } = useAuth()
  return (
    <nav className={variant === 'side' ? 'sidenav' : 'bottomnav'} aria-label={variant === 'side' ? 'Main' : 'Main (mobile)'}>
      {FEATURES.map(({ id, path, label, icon: Icon, requiresAuth }) => (
        <NavLink key={id} to={path === '' ? '/app' : `/app/${path}`} end={path === ''} className="navitem">
          <Icon aria-hidden="true" />
          <span>{variant === 'bottom' && label === 'Pay & tickets' ? 'Pay' : label}</span>
          {requiresAuth && !user && <Lock className="navitem__lock" aria-label="Sign in required" />}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppShell() {
  const { persistent } = useServices()
  return (
    <div className="shell">
      <a className="skip-link" href="#app-main">
        Skip to content
      </a>

      <aside className="shell__side">
        <Logo to="/" />
        <Nav variant="side" />
        <div className="shell__side-foot">
          <LiveDataSwitch />
          <div className="shell__side-row">
            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <header className="shell__top">
        <Logo to="/" />
        <div className="shell__top-actions">
          <LiveDataSwitch compact />
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <main className="shell__main" id="app-main">
        {!persistent && (
          <Alert tone="warn">Your browser is blocking storage, so nothing you save will survive a reload.</Alert>
        )}
        <CitySearch />
        <Outlet />
      </main>

      <Nav variant="bottom" />
    </div>
  )
}
