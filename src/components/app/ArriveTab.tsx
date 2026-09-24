import { useMemo, useState } from 'react'
import { OSL_TO_CENTRE } from '../../data/airport'
import { LAST_CHECKED } from '../../data/meta'
import { Sources } from './Sources'

type Sort = 'cheapest' | 'fastest'

export function ArriveTab() {
  const [sort, setSort] = useState<Sort>('cheapest')
  const [open, setOpen] = useState<string | null>(null)

  const options = useMemo(
    () =>
      [...OSL_TO_CENTRE].sort((a, b) =>
        sort === 'cheapest' ? a.approxPriceNok - b.approxPriceNok : a.minutes - b.minutes,
      ),
    [sort],
  )

  return (
    <div className="panel">
      <h3>Oslo Airport → city</h3>
      <p className="app__sub">Three ways in. Tap one for where to buy and what to know.</p>

      <div className="seg" role="group" aria-label="Sort options">
        <button type="button" aria-pressed={sort === 'cheapest'} onClick={() => setSort('cheapest')}>
          Cheapest
        </button>
        <button type="button" aria-pressed={sort === 'fastest'} onClick={() => setSort('fastest')}>
          Fastest
        </button>
      </div>

      {options.map((o, i) => {
        const isOpen = open === o.id
        return (
          <div className={`card ${i === 0 ? 'card--best' : ''}`} key={o.id}>
            <button
              type="button"
              className="card__row"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : o.id)}
            >
              <span className="card__name">
                {o.name}
                {i === 0 && <span className="tag">{sort === 'cheapest' ? 'Cheapest' : 'Fastest'}</span>}
              </span>
              <span className="card__price">
                ≈ {o.approxPriceNok} kr<small>one way, adult</small>
              </span>
              <span className="card__meta">
                {o.operator} · {o.minutesLabel} · {o.frequency}
              </span>
            </button>
            {isOpen && (
              <div className="card__more">
                <p>
                  <b>Where to buy:</b> {o.whereToBuy}
                </p>
                <p>
                  <b>Good to know:</b> {o.goodToKnow}
                </p>
                <Sources items={[o.source]} />
              </div>
            )}
          </div>
        )
      })}

      <p className="note">
        Prices are approximate and come from travel guides, checked {LAST_CHECKED}. Confirm the exact fare in the
        operator’s app before you pay.
      </p>
    </div>
  )
}
