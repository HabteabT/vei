import { Banknote, Bus, Check, Coffee, ShoppingBag, Smartphone, TriangleAlert, Lightbulb, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { PAY_SITUATIONS, type PaySituation } from '../data/payments'
import { SourceLinks } from './SourceLinks'

const ICONS: Record<PaySituation['icon'], LucideIcon> = {
  bus: Bus,
  shop: ShoppingBag,
  coffee: Coffee,
  phone: Smartphone,
  cash: Banknote,
}

/** "Where are you standing?" then a plain answer: what works, what to watch out for, one tip. */
export function PayGuide() {
  const [id, setId] = useState(PAY_SITUATIONS[0].id)
  const current = PAY_SITUATIONS.find((s) => s.id === id) ?? PAY_SITUATIONS[0]

  return (
    <div className="stack">
      <div className="chips" role="group" aria-label="Where are you paying?">
        {PAY_SITUATIONS.map((s) => {
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
