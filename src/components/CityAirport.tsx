import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { City } from '../data/cities'
import { guideFor, type CityRide } from '../data/cityGuides'
import { Alert } from '../ui/Feedback'
import { SourceLinks } from './SourceLinks'

function Ride({ ride, open, onToggle }: { ride: CityRide; open: boolean; onToggle: () => void }) {
  return (
    <article className="card option">
      <button type="button" className="option__row" aria-expanded={open} onClick={onToggle}>
        <span className="option__main">
          <span className="option__name">{ride.name}</span>
          <span className="option__meta">
            {ride.operator} · {ride.minutesLabel} · {ride.frequency}
          </span>
        </span>
        <span className="option__price">
          {ride.priceShort}
          <small>one way, adult</small>
        </span>
        <ChevronDown className="option__chev" aria-hidden="true" data-open={open} />
      </button>
      {open && (
        <div className="option__more">
          <p>
            <b>Where to board:</b> {ride.where}
          </p>
          <p>
            <b>Where to get off:</b> {ride.getOff}
          </p>
          <p>
            <b>Price:</b> {ride.priceLabel}
          </p>
          <p>
            <b>Ticket:</b> {ride.buy}
          </p>
          <p>
            <b>Good to know:</b> {ride.goodToKnow}
          </p>
          <SourceLinks items={ride.sources} />
        </div>
      )}
    </article>
  )
}

/** Airport to the centre for Kristiansand, Bergen, and Stavanger. */
export function CityAirport({ city, compact = false }: { city: City; compact?: boolean }) {
  const guide = guideFor(city.id)
  const [open, setOpen] = useState<string | null>(guide?.rides[0]?.id ?? null)
  if (!guide) return null
  const first = guide.rides[0]

  if (compact && first) {
    return (
      <div className="stack stack--tight">
        <p>
          <b>{first.name}.</b> {first.where} {first.getOff} {first.priceLabel}
        </p>
        <Link to="/app/go">Full airport guide for {city.name}</Link>
      </div>
    )
  }

  return (
    <div className="stack">
      <h2 className="section-title">From the airport to {city.name}</h2>
      <div className="stack stack--tight">
        {guide.rides.map((ride) => (
          <Ride key={ride.id} ride={ride} open={open === ride.id} onToggle={() => setOpen(open === ride.id ? null : ride.id)} />
        ))}
      </div>
      <Alert tone="warn">
        Fares and times can change. Confirm them with the operator before you pay. For any other trip, use the planner.
      </Alert>
    </div>
  )
}
