import { Icon } from './Icon'

/** Faint contour lines, a nod to a Norwegian trail map. Purely decorative. */
function Topo() {
  return (
    <svg className="hero__topo" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M-20 520 C 200 440, 300 560, 520 500 S 860 380, 1220 470" />
        <path d="M-20 470 C 210 390, 320 510, 530 450 S 850 330, 1220 420" />
        <path d="M-20 420 C 220 340, 330 460, 540 400 S 840 280, 1220 370" />
        <path d="M-20 370 C 230 290, 340 410, 550 350 S 830 230, 1220 320" />
        <path d="M-20 320 C 240 240, 350 360, 560 300 S 820 180, 1220 270" />
        <path d="M-20 270 C 250 190, 360 310, 570 250 S 810 130, 1220 220" />
        <path d="M-20 220 C 260 140, 370 260, 580 200 S 800 80, 1220 170" />
      </g>
    </svg>
  )
}

/** The winding "vei" (way) that links the three steps behind the phone card. */
function RouteArt() {
  return (
    <svg className="hero__path" viewBox="0 0 520 560" aria-hidden="true">
      <path
        className="route"
        d="M 46 508 C 46 400, 250 440, 230 320 S 420 210, 470 62"
        pathLength={300}
      />
      <circle className="node" cx="46" cy="508" r="10" />
      <circle className="node" cx="230" cy="320" r="10" />
      <circle className="node node--end" cx="470" cy="62" r="12" />
    </svg>
  )
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <Topo />
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            Early prototype · Oslo first
          </p>
          <h1>
            Land. <span className="accent">Pay.</span> Go.
          </h1>
          <p className="lead">
            Vei sorts the boring parts of arriving in Norway: getting into town, buying the right ticket, and paying like
            a local.
          </p>
          <div className="cta-row">
            <a className="btn btn--primary" href="#try">
              Try Vei for Oslo <Icon name="arrow" />
            </a>
            <a className="btn btn--ghost" href="#why">
              Why Norway is tricky
            </a>
          </div>
          <ul className="hero__facts" aria-label="Promises">
            <li>
              <Icon name="check" /> No account
            </li>
            <li>
              <Icon name="check" /> No ads
            </li>
            <li>
              <Icon name="check" /> No tracking
            </li>
          </ul>
        </div>

        <div className="hero__visual">
          <RouteArt />
          <div className="mini" aria-hidden="true">
            <div className="mini__top">
              <span>OSL → Oslo centre</span>
              <span>Landed</span>
            </div>
            <h3>Pick your way in</h3>
            <div className="mini__item mini__item--best">
              <strong>
                Regional train <span className="chip">Cheapest</span>
              </strong>
              <span>≈ 23 min · about 3 an hour</span>
              <b className="price">≈ 129 kr</b>
            </div>
            <div className="mini__item">
              <strong>Airport Express</strong>
              <span>19 min · every 10 min</span>
              <b className="price">≈ 260 kr</b>
            </div>
            <div className="mini__item">
              <strong>Airport bus</strong>
              <span>50–60 min · runs all night</span>
              <b className="price">≈ 269 kr</b>
            </div>
            <div className="mini__pay">
              <Icon name="card" />
              Tap your bank card. Vipps needs a Norwegian bank account.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
