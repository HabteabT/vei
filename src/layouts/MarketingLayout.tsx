import { ArrowRight } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../app/auth'
import { ThemeToggle } from '../components/ThemeToggle'
import { UserMenu } from '../components/UserMenu'
import { LinkButton } from '../ui/Button'
import { Logo } from '../ui/Logo'

/** The app uses hash URLs, so in-page links scroll with JavaScript instead of "#section" anchors. */
export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const LINKS = [
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How it works' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'roadmap', label: 'Roadmap' },
]

export function MarketingLayout() {
  const { user } = useAuth()
  return (
    <>
      <a className="skip-link" href="#top" onClick={(e) => (e.preventDefault(), scrollToSection('top'))}>
        Skip to content
      </a>
      <header className="mheader">
        <div className="container mheader__row">
          <Logo />
          <nav className="mheader__nav" aria-label="Sections">
            {LINKS.map((l) => (
              <button key={l.id} type="button" onClick={() => scrollToSection(l.id)}>
                {l.label}
              </button>
            ))}
          </nav>
          <div className="mheader__actions">
            <ThemeToggle />
            {user ? (
              <>
                <UserMenu />
                <LinkButton to="/app" size="sm">
                  Open app <ArrowRight aria-hidden="true" />
                </LinkButton>
              </>
            ) : (
              <>
                <LinkButton to="/login" variant="ghost" size="sm" className="mheader__signin">
                  Sign in
                </LinkButton>
                <LinkButton to="/app" size="sm">
                  Open app <ArrowRight aria-hidden="true" />
                </LinkButton>
              </>
            )}
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="mfooter">
        <div className="container mfooter__row">
          <div>
            <Logo />
            <p>
              Vei is an early prototype, not a booking or ticket service. Facts and prices come from public sources and can change, so
              confirm with the operator before you pay. Not affiliated with Ruter, Vy, Flytoget, Flybussen, Visit Oslo or Vipps.
            </p>
          </div>
          <a href="https://github.com/HabteabT/vei" target="_blank" rel="noreferrer">
            Follow the build on GitHub
          </a>
        </div>
      </footer>
    </>
  )
}
