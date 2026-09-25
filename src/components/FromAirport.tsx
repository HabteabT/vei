import { ChevronDown, Clock, Tag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCity } from '../app/hooks'
import { OSL_TO_CENTRE } from '../data/airport'
import { LAST_CHECKED } from '../data/meta'
import { Segmented } from '../ui/Segmented'
import { Alert, Badge } from '../ui/Feedback'
import { CityAirport } from './CityAirport'
import { LiveTrains } from './LiveTrains'
import { SourceLinks } from './SourceLinks'

type Sort = 'cheapest' | 'fastest'

/** Airport to the selected city. Oslo keeps the live-train comparison. */
export function FromAirport() {
  const [city] = useCity()
  if (city.id !== 'oslo') return <CityAirport city={city} />
  return <OsloFromAirport />
}

function OsloFromAirport() {
  const [sort, setSort] = useState<Sort>('cheapest')
  const [open, setOpen] = useState<string | null>(null)

  const options = useMemo(
    () => [...OSL_TO_CENTRE].sort((a, b) => (sort === 'cheapest' ? a.approxPriceNok - b.approxPriceNok : a.minutes - b.minutes)),
    [sort],
  )

  return (
    <div className="stack">
      <div className="row row--between">
        <h2 className="section-title">Three ways into town</h2>
        <Segmented
          label="Sort options"
          value={sort}
          onChange={setSort}
          options={[
            { value: 'cheapest', label: 'Cheapest', icon: Tag },
            { value: 'fastest', label: 'Fastest', icon: Clock },
          ]}
        />
      </div>

      <div className="stack stack--tight">
        {options.map((o, i) => {
          const isOpen = open === o.id
          return (
            <article key={o.id} className={`card option ${i === 0 ? 'card--best' : ''}`}>
              <button type="button" className="option__row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : o.id)}>
                <span className="option__main">
                  <span className="option__name">
                    {o.name} {i === 0 && <Badge tone="good">{sort === 'cheapest' ? 'Cheapest' : 'Fastest'}</Badge>}
                  </span>
                  <span className="option__meta">
                    {o.operator} · {o.minutesLabel} · {o.frequency}
                  </span>
                </span>
                <span className="option__price">
                  ≈ {o.approxPriceNok} kr<small>one way, adult</small>
                </span>
                <ChevronDown className="option__chev" aria-hidden="true" data-open={isOpen} />
              </button>
              {isOpen && (
                <div className="option__more">
                  <p>
                    <b>Where to buy:</b> {o.whereToBuy}
                  </p>
                  <p>
                    <b>Good to know:</b> {o.goodToKnow}
                  </p>
                  <SourceLinks items={[o.source]} />
                </div>
              )}
            </article>
          )
        })}
      </div>

      <Alert tone="warn">
        Prices are approximate, from travel guides checked {LAST_CHECKED}. Confirm the exact fare in the operator’s app before you pay.
      </Alert>

      <h2 className="section-title">Next trains, live</h2>
      <LiveTrains />
    </div>
  )
}
