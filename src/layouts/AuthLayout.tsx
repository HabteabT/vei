import { Check } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { HeroScene } from '../pages/landing/HeroScene'
import { Logo } from '../ui/Logo'

export function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth__art" aria-hidden="false">
        <Logo />
        <div className="auth__scene">
          <HeroScene />
        </div>
        <div className="auth__copy">
          <h2>
            Arrive sorted. <span className="gradient-text">Every time.</span>
          </h2>
          <ul>
            {['Save places and plan your days', 'Your data stays yours: export or delete anytime', 'No ads, no tracking'].map((t) => (
              <li key={t}>
                <Check aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="auth__panel" id="main">
        <div className="auth__top">
          <span className="auth__mobile-logo">
            <Logo />
          </span>
          <ThemeToggle />
        </div>
        <div className="auth__card">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
