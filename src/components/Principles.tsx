import { Icon, type IconName } from './Icon'

const ITEMS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'compass',
    title: 'Sorted, not searched',
    text: 'You should not have to research how to catch a train. Vei gives one clear answer for your situation, with the reason.',
  },
  {
    icon: 'eye',
    title: 'Honest by design',
    text: 'No ads and no pay-to-rank. Anything sponsored will be labelled. Every fact shows its source and when we checked it.',
  },
  {
    icon: 'shield',
    title: 'Private by default',
    text: 'No account and no tracking. Fonts are hosted by us. The page only contacts a third party, Entur, when you ask for live departures.',
  },
]

export function Principles() {
  return (
    <section className="section" id="principles">
      <div className="container">
        <p className="kicker reveal">Principles</p>
        <h2 className="reveal">Three promises we build around.</h2>
        <div className="grid3">
          {ITEMS.map((it, i) => (
            <article className="pcard reveal" key={it.title} style={{ ['--d' as string]: `${i * 0.08}s` }}>
              <span className="badge">
                <Icon name={it.icon} />
              </span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
