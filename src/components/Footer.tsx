import { LAST_CHECKED } from '../data/meta'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__row">
        <div>
          <Logo />
          <p style={{ marginTop: 14 }}>
            Vei is an early prototype and is not a booking or ticket service. Facts and prices were last checked{' '}
            {LAST_CHECKED} from public sources and can change. Always confirm with the operator before you pay.
          </p>
          <p>
            Not affiliated with Ruter, Vy, Flytoget, Flybussen, Visit Oslo or Vipps. Names belong to their owners.
          </p>
        </div>
        <p>
          <a href="https://github.com/HabteabT/vei" target="_blank" rel="noreferrer">
            Follow the build on GitHub ↗
          </a>
        </p>
      </div>
    </footer>
  )
}
