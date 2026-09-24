import { RefreshCw } from 'lucide-react'
import { useLiveData, useRequest } from '../app/hooks'
import { useServices } from '../app/services'
import { clockTime, minutesUntil } from '../domain/time'
import { IconButton } from '../ui/Button'
import { Alert } from '../ui/Feedback'
import { LiveGate } from './LiveGate'
import { Skeleton } from './Skeleton'

/** The next direct trains from Oslo Airport to Oslo Central Station, straight from Entur. */
export function LiveTrains({ limit = 5 }: { limit?: number }) {
  const { transit } = useServices()
  const [live] = useLiveData()
  const { state, reload } = useRequest(live ? (signal) => transit.nextAirportTrains(signal) : null, [transit])

  if (!live) return <LiveGate what="Live train times">{null}</LiveGate>

  if (state.status === 'error') {
    return (
      <Alert tone="warn">
        Could not reach Entur just now. The guide still works.{' '}
        <button type="button" className="linkbtn" onClick={reload}>
          Try again
        </button>
      </Alert>
    )
  }

  if (state.status !== 'ok') {
    return (
      <div className="trains" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={58} />
        ))}
      </div>
    )
  }

  const trains = state.data.slice(0, limit)
  return (
    <div>
      {trains.length === 0 ? (
        <Alert>No direct trains found right now. The airport bus runs around the clock.</Alert>
      ) : (
        <ul className="trains">
          {trains.map((t) => {
            const mins = minutesUntil(t.start, state.at)
            return (
              <li key={t.start + t.line} className="train">
                <span className="train__time">{clockTime(t.start)}</span>
                <span className="train__what">
                  {t.operator} <b>{t.line}</b>
                  <small>
                    {t.minutes} min, arrives {clockTime(t.end)}
                  </small>
                </span>
                <span className="train__in">{mins <= 0 ? 'now' : `in ${mins} min`}</span>
              </li>
            )
          })}
        </ul>
      )}
      <div className="trains__foot">
        <small>
          Updated {clockTime(state.at)}. Data from{' '}
          <a href="https://developer.entur.no/apis/open" target="_blank" rel="noreferrer">
            Entur
          </a>{' '}
          (open data).
        </small>
        <IconButton label="Refresh train times" small onClick={reload}>
          <RefreshCw aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  )
}
