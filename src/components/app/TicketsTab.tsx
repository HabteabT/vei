import { useState } from 'react'
import { recommend, type Answers } from '../../data/tickets'
import { Sources } from './Sources'

type Option<T extends string> = { value: T; label: string }

const STAY: Option<Answers['stay']>[] = [
  { value: 'day', label: 'A day' },
  { value: 'short', label: '2–3 days' },
  { value: 'long', label: '4+ days' },
]
const MUSEUMS: Option<Answers['museums']>[] = [
  { value: 'few', label: '0–1' },
  { value: 'some', label: '2–3' },
  { value: 'many', label: '4 or more' },
]
const RIDES: Option<Answers['rides']>[] = [
  { value: 'few', label: 'A few' },
  { value: 'many', label: 'Lots' },
]

function Question<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="q">
      <div className="q__label" id={`q-${label}`}>
        {label}
      </div>
      <div className="seg" role="radiogroup" aria-labelledby={`q-${label}`}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TicketsTab() {
  const [answers, setAnswers] = useState<Answers>({ stay: 'short', museums: 'some', rides: 'few' })
  const result = recommend(answers)
  const set = <K extends keyof Answers>(key: K) => (v: Answers[K]) => setAnswers((a) => ({ ...a, [key]: v }))

  return (
    <div className="panel">
      <h3>Which ticket?</h3>
      <p className="app__sub">Three quick questions. The answer updates as you tap.</p>

      <Question label="How long are you in Oslo?" options={STAY} value={answers.stay} onChange={set('stay')} />
      <Question label="Museums you want to visit" options={MUSEUMS} value={answers.museums} onChange={set('museums')} />
      <Question label="Rides per day" options={RIDES} value={answers.rides} onChange={set('rides')} />

      <div className="answer" key={result.title} aria-live="polite">
        <span className="verdict__badge">{result.badge}</span>
        <h4>{result.title}</h4>
        <p className="why">{result.why}</p>
        <ol className="steps">
          {result.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <Sources items={result.sources} />
      </div>

      <p className="note">A rule of thumb, not a price quote. Check the price in the app before you buy.</p>
    </div>
  )
}
