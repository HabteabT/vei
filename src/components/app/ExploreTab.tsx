import { useState } from 'react'
import { OSLO_PASS_SOURCE, PLACES } from '../../data/places'
import { Icon } from '../Icon'
import { Sources } from './Sources'

type Filter = 'all' | 'indoor' | 'outdoor' | 'pass'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'indoor', label: 'Rainy day' },
  { id: 'outdoor', label: 'Outdoors' },
  { id: 'pass', label: 'On Oslo Pass' },
]

export function ExploreTab() {
  const [filter, setFilter] = useState<Filter>('all')

  const shown = PLACES.filter((p) => {
    if (filter === 'indoor') return p.setting === 'indoor'
    if (filter === 'outdoor') return p.setting === 'outdoor'
    if (filter === 'pass') return p.osloPass === true
    return true
  })

  return (
    <div className="panel">
      <h3>Next best thing</h3>
      <p className="app__sub">A short starter list, not 10,000 pins.</p>

      <div className="chips" role="group" aria-label="Filter places">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" className="pill" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {shown.map((p) => (
        <article className="card place" key={p.id}>
          <div className="place__top">
            <div>
              <div className="card__name">{p.name}</div>
              <span className="place__area">
                <Icon name="pin" /> {p.area}
              </span>
            </div>
            <div>
              <span className={`tag ${p.setting === 'indoor' ? 'tag--blue' : ''}`}>
                {p.setting === 'indoor' ? 'Indoor' : 'Outdoor'}
              </span>
            </div>
          </div>
          <p>{p.blurb}</p>
          <p>
            {p.osloPass ? (
              <span className="tag">On Oslo Pass</span>
            ) : (
              <span className="tag tag--warn">Oslo Pass: check first</span>
            )}
          </p>
        </article>
      ))}

      <p className="note">
        Opening hours and entry fees are not shown yet, because we only show what we can verify. Always check the
        official website before you go.
      </p>
      <Sources items={[OSLO_PASS_SOURCE]} />
    </div>
  )
}
