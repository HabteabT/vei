import { ArrowLeftRight, Flag, MapPin, Route } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCity, useRequest } from '../app/hooks'
import { useServices } from '../app/services'
import { OSLO_AIRPORT, type PlaceRef } from '../services/transit/TransitService'
import { Button, IconButton } from '../ui/Button'
import { Alert, EmptyState } from '../ui/Feedback'
import { JourneyCard } from './JourneyCard'
import { LiveGate } from './LiveGate'
import { PlaceSearch } from './PlaceSearch'
import { Skeleton } from './Skeleton'

/** Door to door inside the chosen city, using Entur's journey planner. */
function airportOf(city: { id: string; airport: string; airportLat: number; airportLon: number }): PlaceRef {
  if (city.id === 'oslo') return OSLO_AIRPORT
  return { name: city.airport, lat: city.airportLat, lon: city.airportLon }
}

export function TripPlanner() {
  const { transit } = useServices()
  const [city] = useCity()
  const [from, setFrom] = useState<PlaceRef | null>(() => airportOf(city))
  const [to, setTo] = useState<PlaceRef | null>(null)
  const [query, setQuery] = useState<{ from: PlaceRef; to: PlaceRef } | null>(null)

  useEffect(() => {
    setFrom(airportOf(city))
    setTo(null)
    setQuery(null)
  }, [city])

  const { state } = useRequest(query ? (signal) => transit.planTrip(query.from, query.to, signal) : null, [query, transit])

  const swap = () => {
    setFrom(to)
    setTo(from)
    setQuery(null)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (from && to) setQuery({ from, to })
  }

  return (
    <LiveGate what="The trip planner">
      <form className="planner card card--pad" onSubmit={submit}>
        <PlaceSearch label="From" value={from} onChange={setFrom} icon={MapPin} allowLocate />
        <div className="planner__swap">
          <IconButton label="Swap from and to" small onClick={swap}>
            <ArrowLeftRight aria-hidden="true" style={{ transform: 'rotate(90deg)' }} />
          </IconButton>
        </div>
        <PlaceSearch label="To" value={to} onChange={setTo} icon={Flag} />
        <Button type="submit" disabled={!from || !to} loading={state.status === 'loading'} block>
          <Route aria-hidden="true" /> Find routes
        </Button>
      </form>

      <div className="planner__results" aria-live="polite">
        {state.status === 'idle' && (
          <EmptyState icon={Route} title="Where to?">
            Pick a start and a destination anywhere in Norway. You will see real departures, changes and which app sells the ticket.
          </EmptyState>
        )}
        {state.status === 'loading' && (
          <>
            <Skeleton height={120} />
            <Skeleton height={120} />
          </>
        )}
        {state.status === 'error' && <Alert tone="warn">Could not plan that trip right now. Check your connection and try again.</Alert>}
        {state.status === 'ok' &&
          (state.data.length === 0 ? (
            <Alert>No routes found for that time. Try a different place.</Alert>
          ) : (
            [...state.data]
              .sort((a, b) => a.minutes - b.minutes)
              .map((journey, i) => <JourneyCard key={journey.start + i} journey={journey} best={i === 0} />)
          ))}
      </div>
    </LiveGate>
  )
}
