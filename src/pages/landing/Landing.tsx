import {
  ArrowRight,
  Check,
  Compass,
  Download,
  Luggage,
  PlaneLanding,
  Radio,
  Route,
  ShieldCheck,
  Sparkles,
  Ticket,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/auth'
import { useReveal } from '../../components/useReveal'
import { scrollToSection } from '../../layouts/MarketingLayout'
import { DEMO_ACCOUNT } from '../../services/auth/DemoAccount'
import { Button, LinkButton } from '../../ui/Button'
import { Alert } from '../../ui/Feedback'
import { HeroScene } from './HeroScene'

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: PlaneLanding, title: 'Airport to city', text: 'Train, express or bus side by side, with live departures from Norway’s national journey planner.' },
  { icon: Wallet, title: 'How to pay', text: 'Plain answers for buses, shops, kiosks and Vipps, so you never get stuck at a payment screen.' },
  { icon: Ticket, title: 'Which ticket?', text: 'Three questions to pick between single tickets, a day ticket and the Oslo Pass.' },
  { icon: Route, title: 'Trip planner', text: 'Any place to any place in Norway, with the changes and the app that sells each ticket.' },
  { icon: Compass, title: 'Explore', text: 'A short list for the city you picked, with its own page for each place. Save the ones you love.' },
  { icon: Luggage, title: 'My trip', text: 'Turn saved places into a simple morning, afternoon and evening plan, kept in your account.' },
]

const STEPS = [
  { n: '01', title: 'Land', text: 'Pick your way from the airport and see the next trains.' },
  { n: '02', title: 'Pay', text: 'Know which ticket to buy and how to pay for it, before you reach the machine.' },
  { n: '03', title: 'Go', text: 'Plan the day, save places and let the weather nudge you indoors when it rains.' },
]

const PRIVACY: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: 'Private by default', text: 'No ads and no tracking. Fonts are hosted by us, so nothing is sent to third parties until you say so.' },
  { icon: Radio, title: 'Live data is your choice', text: 'One switch lets your browser ask Entur and Open-Meteo. It is off until you turn it on, and explained in plain words.' },
  { icon: Download, title: 'Your data, your call', text: 'Download everything Vei holds about you, or delete your account and all of it, from your profile.' },
]

const ROADMAP = [
  { title: 'Now', tone: 'now', items: ['Airport to city with live trains', 'Trip planner across Norway', 'Pay guide and ticket helper', 'Accounts, saved places and a day plan'] },
  { title: 'Next', tone: '', items: ['Real accounts on an EU-hosted service', 'Verified opening hours and prices', 'Reviews, photos, and a day-by-day journal', 'More cities beyond the first four'] },
  { title: 'Later', tone: '', items: ['Cruise-stop mode: six hours, one plan', 'A version for tourism boards', 'A trip pass for the whole stay'] },
]

export function Landing() {
  useReveal()
  const { user, signInDemo } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tryDemo = async () => {
    setBusy(true)
    setError(null)
    try {
      await signInDemo()
      navigate('/app')
    } catch {
      setError('Could not start the demo. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main id="top">
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="pill-tag">
              <Sparkles aria-hidden="true" /> Early prototype · Four cities
            </p>
            <h1>
              Land. Pay. <span className="gradient-text">Go.</span>
            </h1>
            <p className="hero__lead">
              Vei sorts the boring parts of arriving in Norway: getting into town, buying the right ticket and paying like a local.
            </p>
            <div className="hero__cta">
              <LinkButton to="/app" size="lg">
                Open the app <ArrowRight aria-hidden="true" />
              </LinkButton>
              {!user && (
                <Button size="lg" variant="secondary" onClick={tryDemo} loading={busy}>
                  Try the demo account
                </Button>
              )}
            </div>
            {error && <Alert tone="error">{error}</Alert>}
            <ul className="hero__checks" aria-label="Promises">
              {['Free to use', 'No ads', 'No tracking', 'Delete your data anytime'].map((t) => (
                <li key={t}>
                  <Check aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero__visual">
            <HeroScene />
            <div className="float float--a" aria-hidden="true">
              <span className="float__icon">
                <PlaneLanding />
              </span>
              <div>
                <b>Landed at OSL</b>
                <small>Train in 11 min</small>
              </div>
            </div>
            <div className="float float--b" aria-hidden="true">
              <span className="float__icon float__icon--violet">
                <Wallet />
              </span>
              <div>
                <b>Tap your card</b>
                <small>Vipps not needed</small>
              </div>
            </div>
            <div className="float float--c" aria-hidden="true">
              <span className="float__icon float__icon--green">
                <Ticket />
              </span>
              <div>
                <b>Oslo Pass?</b>
                <small>Answer in 3 taps</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Problem strip ---------- */}
      <section className="strip" aria-label="Why Vei">
        <div className="container strip__row">
          <div>
            <strong>&lt; 3%</strong>
            <span>of payments in Norway are made in cash</span>
          </div>
          <div>
            <strong>6+</strong>
            <span>regional transport apps, plus Entur and Vy</span>
          </div>
          <div>
            <strong>14.2M</strong>
            <span>foreign guest nights in 2025, up 14%</span>
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="section" id="features">
        <div className="container">
          <p className="kicker reveal">What you get</p>
          <h2 className="section__title reveal">Everything for your first hours, in one calm place.</h2>
          <div className="features">
            {FEATURES.map(({ icon: Icon, title, text }, i) => (
              <article key={title} className="feature card card--interactive reveal" style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <span className="feature__icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="section section--band" id="how">
        <div className="container">
          <p className="kicker reveal">How it works</p>
          <h2 className="section__title reveal">Three steps, from the plane to the plan.</h2>
          <ol className="steps3">
            {STEPS.map((s, i) => (
              <li key={s.n} className="step reveal" style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <span className="step__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Privacy ---------- */}
      <section className="section" id="privacy">
        <div className="container">
          <p className="kicker reveal">Privacy</p>
          <h2 className="section__title reveal">Built so you stay in control.</h2>
          <div className="features features--3">
            {PRIVACY.map(({ icon: Icon, title, text }, i) => (
              <article key={title} className="feature card reveal" style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <span className="feature__icon feature__icon--good">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Try it ---------- */}
      <section className="section">
        <div className="container">
          <div className="cta reveal">
            <div>
              <h2>Try Vei right now.</h2>
              <p>
                Use the one-tap demo account, or create your own. Accounts in this demo live only in your browser.
              </p>
              <p className="cta__creds">
                Demo login: <code>{DEMO_ACCOUNT.email}</code> · <code>{DEMO_ACCOUNT.password}</code>
              </p>
            </div>
            <div className="cta__actions">
              {user ? (
                <LinkButton to="/app" size="lg" variant="aurora">
                  Open the app <ArrowRight aria-hidden="true" />
                </LinkButton>
              ) : (
                <>
                  <Button size="lg" variant="aurora" onClick={tryDemo} loading={busy}>
                    Continue as demo user
                  </Button>
                  <LinkButton to="/signup" size="lg" variant="secondary">
                    Create an account
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Roadmap ---------- */}
      <section className="section section--band" id="roadmap">
        <div className="container">
          <p className="kicker reveal">Roadmap</p>
          <h2 className="section__title reveal">Small first. Proven before bigger.</h2>
          <div className="road">
            {ROADMAP.map((col, i) => (
              <article key={col.title} className={`road__col card reveal ${col.tone ? 'road__col--now' : ''}`} style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <h3>{col.title}</h3>
                <ul>
                  {col.items.map((it) => (
                    <li key={it}>
                      <Check aria-hidden="true" /> {it}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="road__note">
            A plan, not a promise. Each step is tested with real visitors before the next one.{' '}
            <button type="button" className="linkbtn" onClick={() => scrollToSection('top')}>
              Back to top
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}
