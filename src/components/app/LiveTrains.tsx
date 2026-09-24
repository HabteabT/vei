import { useState } from 'react'
import { clockTime, fetchAirportTrains, minutesUntil, type LiveTrip } from '../../data/entur'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ok'; trips: LiveTrip[]; at: number }

/** Opt-in: nothing is sent to Entur until the visitor taps the button. */
export function LiveTrains() {
  const [state, setState] = useState<State>({ status: 'idle' })

  const load = async () => {
    setState({ status: 'loading' })
    try {
      const trips = await fetchAirportTrains()
      setState({ status: 'ok', trips, at: Date.now() })
    } catch {
      setState({ status: 'error' })
    }
  }

  return (
    <section className="live" aria-live="polite">
      <div className="label">Live from the airport</div>

      {state.status === 'idle' && (
        <>
          <button type="button" className="btn btn--primary btn--sm live__btn" onClick={load}>
            Show next trains
          </button>
          <p className="live__hint">Asks Entur, Norway’s national journey planner, for real departures. Nothing else is sent.</p>
        </>
      )}

      {state.status === 'loading' && <p className="live__hint">Asking Entur…</p>}

      {state.status === 'error' && (
        <>
          <p className="live__hint">Could not reach Entur. The guide above still works.</p>
          <button type="button" className="btn btn--ghost btn--sm live__btn" onClick={load}>
            Try again
          </button>
        </>
      )}

      {state.status === 'ok' && (
        <>
          {state.trips.length === 0 ? (
            <p className="live__hint">No direct trains found right now. Try the airport bus.</p>
          ) : (
            <ul className="live__list">
              {state.trips.map((t) => {
                const mins = minutesUntil(t.start, state.at)
                return (
                  <li key={t.start + t.line}>
                    <span className="live__time">{clockTime(t.start)}</span>
                    <span className="live__what">
                      {t.operator} {t.line}
                      <small>
                        {t.minutes} min, arrives {clockTime(t.end)}
                      </small>
                    </span>
                    <span className="live__in">{mins <= 0 ? 'now' : `in ${mins} min`}</span>
                  </li>
                )
              })}
            </ul>
          )}
          <p className="live__hint">
            Updated {clockTime(new Date(state.at).toISOString())}. Data:{' '}
            <a className="link" href="https://developer.entur.no/apis/open" target="_blank" rel="noreferrer">
              Entur ↗
            </a>{' '}
            (open data, NLOD).{' '}
            <button type="button" className="linkbtn" onClick={load}>
              Refresh
            </button>
          </p>
        </>
      )}
    </section>
  )
}
