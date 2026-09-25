import type { City } from '../data/cities'
import { guideFor } from '../data/cityGuides'
import { SourceLinks } from './SourceLinks'

/** How to buy local tickets outside Oslo. The pay guide itself stays Norway-wide. */
export function CityTickets({ city }: { city: City }) {
  const guide = guideFor(city.id)
  if (!guide) return null
  return (
    <section className="card card--pad stack" aria-labelledby="city-tickets">
      <h2 id="city-tickets" className="verdict__title">
        Tickets in {city.name}
      </h2>
      <p>{guide.tickets.summary}</p>
      <ol className="steps">
        {guide.tickets.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <SourceLinks items={[guide.tickets.source]} />
      <p className="fineprint">A guide, not a checkout. Vei does not sell tickets.</p>
    </section>
  )
}
