import { useState } from 'react'
import { recommend, type Answers } from '../data/tickets'
import { Badge } from '../ui/Feedback'
import { Segmented, type SegmentedOption } from '../ui/Segmented'
import { SourceLinks } from './SourceLinks'

const STAY: SegmentedOption<Answers['stay']>[] = [
  { value: 'day', label: 'A day' },
  { value: 'short', label: '2–3 days' },
  { value: 'long', label: '4+ days' },
]
const MUSEUMS: SegmentedOption<Answers['museums']>[] = [
  { value: 'few', label: '0–1' },
  { value: 'some', label: '2–3' },
  { value: 'many', label: '4 or more' },
]
const RIDES: SegmentedOption<Answers['rides']>[] = [
  { value: 'few', label: 'A few' },
  { value: 'many', label: 'Lots' },
]

/** Three questions, one recommendation. It is a rule of thumb, never a price quote. */
export function TicketHelper() {
  const [answers, setAnswers] = useState<Answers>({ stay: 'short', museums: 'some', rides: 'few' })
  const result = recommend(answers)
  const set = <K extends keyof Answers>(key: K) => (value: Answers[K]) => setAnswers((a) => ({ ...a, [key]: value }))

  return (
    <div className="ticket-grid">
      <section className="card card--pad stack">
        <div className="q">
          <h3 className="q__label">How long are you in Oslo?</h3>
          <Segmented label="Length of stay" block options={STAY} value={answers.stay} onChange={set('stay')} />
        </div>
        <div className="q">
          <h3 className="q__label">Museums you want to visit</h3>
          <Segmented label="Museums" block options={MUSEUMS} value={answers.museums} onChange={set('museums')} />
        </div>
        <div className="q">
          <h3 className="q__label">Rides per day</h3>
          <Segmented label="Rides" block options={RIDES} value={answers.rides} onChange={set('rides')} />
        </div>
      </section>

      <section className="card card--pad verdict" aria-live="polite" key={result.title}>
        <Badge tone="good">{result.badge}</Badge>
        <h2 className="verdict__title">{result.title}</h2>
        <p className="verdict__why">{result.why}</p>
        <ol className="steps">
          {result.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <SourceLinks items={result.sources} />
        <p className="fineprint">A rule of thumb, not a price quote. Check the price in the app before you buy.</p>
      </section>
    </div>
  )
}
