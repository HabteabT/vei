import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCity, useObservable, useUserData } from '../app/hooks'
import { checklistFor } from '../data/checklists'
import { ProgressRing } from '../ui/ProgressRing'

/** Saves per account when signed in, and on this device for guests. */
export function Checklist() {
  const { checklist } = useUserData()
  const [city] = useCity()
  const items = checklistFor(city.id)
  const done = useObservable(checklist)
  const total = items.length
  const count = items.filter((item) => done[item.id]).length

  return (
    <section className="card card--pad checklist" aria-labelledby="checklist-title">
      <div className="checklist__head">
        <div>
          <h2 id="checklist-title" className="tile__title">
            Arrival checklist
          </h2>
          <p className="tile__hint">
            {count === total ? `All set. Enjoy ${city.name}.` : `${count} of ${total} done`}
          </p>
        </div>
        <ProgressRing value={count / total} label={`${count} of ${total} steps done`} />
      </div>

      <ul className="checklist__list">
        {items.map((item) => {
          const isDone = Boolean(done[item.id])
          return (
            <li key={item.id} className={isDone ? 'is-done' : ''}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isDone}
                className="checkbox"
                onClick={() => checklist.set(item.id, !isDone)}
                aria-label={item.title}
              >
                <Check aria-hidden="true" />
              </button>
              <div className="checklist__text">
                <span>{item.title}</span>
                <small>{item.hint}</small>
              </div>
              {item.to && (
                <Link to={item.to} className="checklist__go" aria-label={`Open: ${item.title}`}>
                  <ArrowRight aria-hidden="true" />
                </Link>
              )}
            </li>
          )
        })}
      </ul>
      {count > 0 && (
        <button type="button" className="linkbtn" onClick={() => checklist.reset()}>
          Start over
        </button>
      )}
    </section>
  )
}
