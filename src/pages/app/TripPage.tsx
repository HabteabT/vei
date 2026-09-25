import { CalendarDays, Compass, Heart, Luggage, Plus, Sun, Sunrise, Sunset, Trash2, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCity, useObservable, useUserData } from '../../app/hooks'
import { PageHeader } from '../../components/PageHeader'
import { getPlace } from '../../data/places'
import { TRIP_SLOTS, type TripItem, type TripSlot } from '../../domain/types'
import { Button, IconButton, LinkButton } from '../../ui/Button'
import { EmptyState } from '../../ui/Feedback'
import { useToast } from '../../ui/Toast'
import { TextField } from '../../ui/Field'

const SLOT_ICONS: Record<TripSlot, LucideIcon> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  anytime: CalendarDays,
}

function SlotSelect({ value, onChange, label }: { value: TripSlot; onChange: (slot: TripSlot) => void; label: string }) {
  return (
    <select className="select" aria-label={label} value={value} onChange={(e) => onChange(e.target.value as TripSlot)}>
      {TRIP_SLOTS.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  )
}

function PlanItem({ item }: { item: TripItem }) {
  const { trip } = useUserData()
  const [note, setNote] = useState(item.note)
  const area = item.placeId ? getPlace(item.placeId)?.area : null
  return (
    <li className="plan-item card">
      <div className="plan-item__main">
        <div className="plan-item__title">
          {item.title}
          {area && <span className="plan-item__area">{area}</span>}
        </div>
        <input
          className="plan-item__note"
          placeholder="Add a note (time, ticket, who is joining)"
          aria-label={`Note for ${item.title}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== item.note && trip.update(item.id, { note })}
        />
      </div>
      <SlotSelect label={`When: ${item.title}`} value={item.slot} onChange={(slot) => trip.update(item.id, { slot })} />
      <IconButton label={`Remove ${item.title}`} small onClick={() => trip.remove(item.id)}>
        <Trash2 aria-hidden="true" />
      </IconButton>
    </li>
  )
}

export function TripPage() {
  const data = useUserData()
  const [city] = useCity()
  const items = useObservable(data.trip)
  const favorites = useObservable(data.favorites)
  const notify = useToast()
  const [title, setTitle] = useState('')
  const [slot, setSlot] = useState<TripSlot>('anytime')

  const saved = favorites
    .map(getPlace)
    .filter((p): p is NonNullable<typeof p> => Boolean(p && p.cityId === city.id))
  const visibleItems = items.filter((item) => {
    if (!item.placeId) return true
    return getPlace(item.placeId)?.cityId === city.id
  })

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    data.trip.add({ title, slot })
    setTitle('')
    notify('Added to your plan')
  }

  return (
    <>
      <PageHeader
        eyebrow="My trip"
        title={`Your plan for ${city.name}`}
        subtitle="Saved places and a simple day plan. Stored in your account."
        actions={
          <LinkButton to="/app/explore" variant="secondary" size="sm">
            <Compass aria-hidden="true" /> Find places
          </LinkButton>
        }
      />

      <div className="stack stack--loose">
        <section aria-labelledby="saved-h" className="stack">
          <h2 id="saved-h" className="section-title">
            <Heart aria-hidden="true" /> Saved places
          </h2>
          {saved.length === 0 ? (
            <EmptyState icon={Heart} title="No saved places yet" action={<LinkButton to="/app/explore" size="sm">Browse places</LinkButton>}>
              Tap the heart on a place in Explore and it shows up here.
            </EmptyState>
          ) : (
            <ul className="saved">
              {saved.map((p) => {
                const inPlan = items.some((i) => i.placeId === p.id)
                return (
                  <li key={p.id} className="saved__item card">
                    <div>
                      <strong>{p.name}</strong>
                      <small>{p.area}</small>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={inPlan}
                      onClick={() => data.trip.add({ title: p.name, placeId: p.id })}
                    >
                      <Plus aria-hidden="true" /> {inPlan ? 'In plan' : 'Add to plan'}
                    </Button>
                    <IconButton label={`Remove ${p.name} from saved`} small onClick={() => data.favorites.toggle(p.id)}>
                      <Trash2 aria-hidden="true" />
                    </IconButton>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="plan-h" className="stack">
          <h2 id="plan-h" className="section-title">
            <Luggage aria-hidden="true" /> Day plan
          </h2>

          <form className="card card--pad addform" onSubmit={add}>
            <TextField label="Add something" placeholder="For example: Walk along the harbour" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="addform__row">
              <SlotSelect label="When" value={slot} onChange={setSlot} />
              <Button type="submit" disabled={!title.trim()}>
                <Plus aria-hidden="true" /> Add
              </Button>
            </div>
          </form>

          {visibleItems.length === 0 ? (
            <EmptyState icon={Luggage} title="Your plan is empty">
              Add a place from Explore, or type your own item above. See <Link to="/app/go">how to get around</Link> too.
            </EmptyState>
          ) : (
            TRIP_SLOTS.map((s) => {
              const inSlot = visibleItems.filter((i) => i.slot === s.id)
              if (inSlot.length === 0) return null
              const Icon = SLOT_ICONS[s.id]
              return (
                <div key={s.id} className="slot">
                  <h3 className="slot__title">
                    <Icon aria-hidden="true" /> {s.label}
                  </h3>
                  <ul className="plan">
                    {inSlot.map((item) => (
                      <PlanItem key={item.id} item={item} />
                    ))}
                  </ul>
                </div>
              )
            })
          )}
        </section>
      </div>
    </>
  )
}
