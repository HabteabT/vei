import { Icon, type IconName } from './Icon'

const COLUMNS: { id: string; title: string; icon: IconName; items: string[]; now?: boolean }[] = [
  {
    id: 'now',
    title: 'Now',
    icon: 'check',
    now: true,
    items: [
      'Airport to city, with sources',
      'Live airport trains from Entur (you tap to load)',
      '“How do I pay?” guide',
      'Which-ticket helper',
      'A small starter list of places',
    ],
  },
  {
    id: 'next',
    title: 'Next',
    icon: 'clock',
    items: [
      'Live door-to-door routes anywhere in Norway',
      'Works offline, add to your home screen',
      'Verified opening hours and prices',
      'Weather-aware suggestions',
      'German and Norwegian',
    ],
  },
  {
    id: 'later',
    title: 'Later',
    icon: 'pin',
    items: [
      'More Norwegian cities, then the Nordics',
      'A 6-hour cruise-stop mode',
      'A version for tourism boards',
      'A trip pass for the whole stay',
    ],
  },
]

export function Roadmap() {
  return (
    <section className="section section--alt" id="roadmap">
      <div className="container">
        <p className="kicker reveal">Roadmap</p>
        <h2 className="reveal">Small first. Proven before bigger.</h2>
        <p className="section__intro reveal">
          A plan, not a promise. We test each step with real visitors before we build the next one.
        </p>
        <div className="road">
          {COLUMNS.map((c, i) => (
            <article className={`col reveal ${c.now ? 'col--now' : ''}`} key={c.id} style={{ ['--d' as string]: `${i * 0.08}s` }}>
              <h3>{c.title}</h3>
              <ul>
                {c.items.map((it) => (
                  <li key={it}>
                    <Icon name={c.icon} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
