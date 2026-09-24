import { Icon } from './Icon'
import { Logo } from './Logo'

export function Header() {
  return (
    <header className="header">
      <div className="container header__row">
        <Logo />
        <nav className="nav" aria-label="Main">
          <a href="#why">Why Norway is tricky</a>
          <a href="#principles">Principles</a>
          <a href="#roadmap">Roadmap</a>
          <a className="btn btn--primary btn--sm" href="#try">
            Try Oslo <Icon name="arrow" />
          </a>
        </nav>
      </div>
    </header>
  )
}
