import { Icon } from './Icon'

const STATS = [
  {
    big: '< 3%',
    text: 'of payments in Norway are made in cash. Some businesses will not take it at all.',
    src: { label: 'Life in Norway', url: 'https://www.lifeinnorway.net/norway-considers-forcing-businesses-to-accept-cash/' },
  },
  {
    big: 'Vipps',
    text: 'is how locals pay, but it needs a Norwegian bank account. A few kiosks and trail car parks accept only Vipps.',
    src: { label: 'Norway Explained', url: 'https://norwayexplained.com/how-to-get-vipps-as-a-tourist-in-norway/' },
  },
  {
    big: '6+',
    text: 'regional transport apps, plus Entur and Vy. One visitor guide lists them all, and says tickets and zones differ by region.',
    src: { label: 'Norway Explained', url: 'https://norwayexplained.com/norwegian-travel-apps-tourists-need/' },
  },
]

export function Problem() {
  return (
    <section className="section" id="why">
      <div className="container">
        <p className="kicker reveal">The problem</p>
        <h2 className="reveal" style={{ ['--d' as string]: '0.05s' }}>
          Easy to love. Oddly hard to arrive in.
        </h2>
        <p className="section__intro reveal" style={{ ['--d' as string]: '0.1s' }}>
          The scenery is the easy part. The first hour, working out the ticket, the zone and how to pay, is where visitors
          get stuck.
        </p>

        <div className="stats">
          {STATS.map((s, i) => (
            <article className="stat reveal" key={s.big} style={{ ['--d' as string]: `${0.1 + i * 0.08}s` }}>
              <div className="stat__big">{s.big}</div>
              <p>{s.text}</p>
              <a className="src" href={s.src.url} target="_blank" rel="noreferrer">
                Source: {s.src.label}
              </a>
            </article>
          ))}
        </div>

        <div className="pull reveal">
          <Icon name="info" />
          <p>
            And more people are coming. Norway logged a record 14.2 million foreign guest nights in 2025, up 14% on the year
            before.{' '}
            <a
              className="link"
              href="https://www.ssb.no/en/transport-og-reiseliv/reiseliv/statistikk/overnattingar/articles/record-number-of-guest-nights-in-2025"
              target="_blank"
              rel="noreferrer"
            >
              Statistics Norway
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
