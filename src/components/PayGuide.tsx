import { Banknote, Bus, Check, Coffee, ShoppingBag, Smartphone, TriangleAlert, Lightbulb, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useCity } from '../app/hooks'
import type { CityId } from '../data/cities'
import { guideFor } from '../data/cityGuides'
import { PAY_SITUATIONS, type PaySituation } from '../data/payments'
import { SourceLinks } from './SourceLinks'

const ICONS: Record<PaySituation['icon'], LucideIcon> = {
  bus: Bus,
  shop: ShoppingBag,
  coffee: Coffee,
  phone: Smartphone,
  cash: Banknote,
}

function situationsFor(cityId: CityId, transitApp: string, transitHint: string): PaySituation[] {
  if (cityId === 'oslo') return PAY_SITUATIONS
  const guide = guideFor(cityId)
  const sources = guide
    ? [...new Map(guide.rides.flatMap((ride) => ride.sources).map((source) => [source.url, source])).values()]
    : []
  const local: PaySituation = {
    id: 'transit',
    label: 'Bus and local transport',
    icon: 'bus',
    headline: `In this city, buy the ticket in ${transitApp} before you board.`,
    works: [transitHint],
    watchOut: ['A ticket from another city’s app will not work on these buses.'],
    tip: 'Shops and restaurants here take the same cards as the rest of Norway.',
    sources,
  }
  return PAY_SITUATIONS.map((item) => (item.id === 'transit' ? local : item))
}

/** "Where are you standing?" then a plain answer: what works, what to watch out for, one tip. */
export function PayGuide() {
  const [city] = useCity()
  const situations = situationsFor(city.id, city.transitApp, city.transitHint)
  const [id, setId] = useState(situations[0].id)
  const current = situations.find((s) => s.id === id) ?? situations[0]

  return (
    <div className="stack">
      <div className="chips" role="group" aria-label="Where are you paying?">
        {situations.map((s) => {
          const Icon = ICONS[s.icon]
          return (
            <button key={s.id} type="button" className="chip" aria-pressed={s.id === id} onClick={() => setId(s.id)}>
              <Icon aria-hidden="true" />
              {s.label}
            </button>
          )
        })}
      </div>

      <article className="card card--pad answer" key={current.id}>
        <h2 className="answer__headline">{current.headline}</h2>

        <div className="answer__cols">
          <section>
            <h3 className="mini-title mini-title--good">Works</h3>
            <ul className="list list--good">
              {current.works.map((w) => (
                <li key={w}>
                  <Check aria-hidden="true" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mini-title mini-title--warn">Watch out</h3>
            <ul className="list list--warn">
              {current.watchOut.map((w) => (
                <li key={w}>
                  <TriangleAlert aria-hidden="true" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="tipbox">
          <Lightbulb aria-hidden="true" />
          <span>
            <b>Tip:</b> {current.tip}
          </span>
        </p>
        <SourceLinks items={current.sources} />
      </article>
    </div>
  )
}
