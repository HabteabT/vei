import { ArrowRight, Bus, Footprints, Plane, Route, Ship, TrainFront, TramFront, Wallet, type LucideIcon } from 'lucide-react'
import { clockTime, formatMinutes } from '../domain/time'
import type { Journey, Leg, TransitMode } from '../services/transit/TransitService'
import { Badge } from '../ui/Feedback'

const MODE_ICON: Record<TransitMode, LucideIcon> = {
  foot: Footprints,
  bus: Bus,
  coach: Bus,
  tram: TramFront,
  metro: TrainFront,
  rail: TrainFront,
  water: Ship,
  air: Plane,
  other: Route,
}

const MODE_LABEL: Record<TransitMode, string> = {
  foot: 'Walk',
  bus: 'Bus',
  coach: 'Coach',
  tram: 'Tram',
  metro: 'Metro',
  rail: 'Train',
  water: 'Boat',
  air: 'Flight',
  other: 'Ride',
}

function LegRow({ leg }: { leg: Leg }) {
  const Icon = MODE_ICON[leg.mode]
  return (
    <li className={`leg leg--${leg.mode}`}>
      <span className="leg__icon">
        <Icon aria-hidden="true" />
      </span>
      <div className="leg__body">
        <div className="leg__title">
          {leg.mode === 'foot' ? `Walk ${leg.minutes} min` : `${MODE_LABEL[leg.mode]} ${leg.line?.code ?? ''}`.trim()}
          {leg.line?.operator && leg.mode !== 'air' && <span className="leg__operator"> {leg.line.operator}</span>}
        </div>
        <div className="leg__route">
          {clockTime(leg.start)} {leg.from} <ArrowRight aria-hidden="true" /> {clockTime(leg.end)} {leg.to}
        </div>
      </div>
      {leg.mode !== 'foot' && <span className="leg__min">{leg.minutes} min</span>}
    </li>
  )
}

/**
 * Ground transport tickets are sold by the operators, so point visitors at their apps.
 * Flights are different: the "operator" Entur lists is the airport company, so flights are booked with the airline.
 */
function ticketApps(journey: Journey): string[] {
  return [...new Set(journey.legs.filter((l) => l.line?.operator && l.mode !== 'air').map((l) => l.line!.operator))]
}

function ticketHint(journey: Journey): string | null {
  const apps = ticketApps(journey)
  const flies = journey.legs.some((l) => l.mode === 'air')
  const parts = [
    apps.length > 0 ? `buy in the ${apps.map((a) => `${a} app`).join(' and ')}` : null,
    flies ? 'book the flight with the airline' : null,
  ].filter(Boolean)
  return parts.length ? `Tickets: ${parts.join(', and ')}. Confirm the price before you pay.` : null
}

export function JourneyCard({ journey, best }: { journey: Journey; best?: boolean }) {
  const hint = ticketHint(journey)
  return (
    <article className={`journey card ${best ? 'card--best' : ''}`}>
      <header className="journey__head">
        <div className="journey__times">
          {clockTime(journey.start)} <ArrowRight aria-hidden="true" /> {clockTime(journey.end)}
        </div>
        <div className="journey__meta">
          {best && <Badge tone="good">Fastest</Badge>}
          <Badge>{formatMinutes(journey.minutes)}</Badge>
          <Badge>{journey.changes === 0 ? 'Direct' : `${journey.changes} change${journey.changes > 1 ? 's' : ''}`}</Badge>
        </div>
      </header>
      <ol className="journey__legs">
        {journey.legs.map((leg, i) => (
          <LegRow key={i} leg={leg} />
        ))}
      </ol>
      {hint && (
        <footer className="journey__foot">
          <Wallet aria-hidden="true" />
          <span>{hint}</span>
        </footer>
      )}
    </article>
  )
}
