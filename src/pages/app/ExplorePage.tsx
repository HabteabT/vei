import { Check, Heart, MapPin, Plus, Search, Sparkles, Ticket } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCity, useObservable, useUserData } from '../../app/hooks'
import { useServices } from '../../app/services'
import { PageHeader } from '../../components/PageHeader'
import { SourceLinks } from '../../components/SourceLinks'
import { useAuthGate } from '../../components/useAuthGate'
import { averageRating } from '../../domain/reviews'
import { OSLO_PASS_SOURCE, placesIn, type Place } from '../../data/places'
import { Alert, Badge, EmptyState } from '../../ui/Feedback'
import { useToast } from '../../ui/Toast'

type Filter = 'all' | 'indoor' | 'outdoor' | 'pass' | 'saved' | 'foryou'

function uniqueSources(places: Place[]) {
  return [...new Map(places.map((place) => [place.source.url, place.source])).values()]
}

export function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const [city] = useCity()
  const places = placesIn(city.id)
  const requested = (params.get('filter') as Filter) || 'all'
  const filter: Filter = requested === 'pass' && city.id !== 'oslo' ? 'all' : requested
  const [query, setQuery] = useState('')
  const data = useUserData()
  const favorites = useObservable(data.favorites)
  const trip = useObservable(data.trip)
  const preferences = useObservable(data.preferences)
  const [gate, gateModal] = useAuthGate()
  const notify = useToast()
  const { reviews } = useServices()
  const allReviews = useObservable(reviews)

  const setFilter = (next: Filter) => setParams(next === 'all' ? {} : { filter: next }, { replace: true })
  const interests = preferences.interests

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = (p: Place) => p.interests.filter((i) => interests.includes(i)).length
    return placesIn(city.id).filter((p) => {
      if (q && !`${p.name} ${p.area} ${p.blurb}`.toLowerCase().includes(q)) return false
      switch (filter) {
        case 'indoor':
          return p.setting === 'indoor'
        case 'outdoor':
          return p.setting === 'outdoor'
        case 'pass':
          return p.osloPass === true
        case 'saved':
          return favorites.includes(p.id)
        case 'foryou':
          return matches(p) > 0
        default:
          return true
      }
    }).sort((a, b) => matches(b) - matches(a))
  }, [query, filter, favorites, interests, city.id])

  const savedHere = favorites.filter((id) => places.some((place) => place.id === id)).length

  const filters: { id: Filter; label: string; icon?: typeof Heart }[] = [
    { id: 'all', label: 'All' },
    { id: 'indoor', label: 'Rainy day' },
    { id: 'outdoor', label: 'Outdoors' },
    ...(city.id === 'oslo' ? [{ id: 'pass' as const, label: 'On Oslo Pass', icon: Ticket }] : []),
    ...(interests.length ? [{ id: 'foryou' as const, label: 'For you', icon: Sparkles }] : []),
    { id: 'saved', label: `Saved${savedHere ? ` (${savedHere})` : ''}`, icon: Heart },
  ]

  const toggleFavorite = (place: Place) =>
    gate(() => {
      const nowFavorite = data.favorites.toggle(place.id)
      notify(nowFavorite ? `Saved ${place.name}` : `Removed ${place.name}`)
    })

  const addToTrip = (place: Place) =>
    gate(() => {
      data.trip.add({ title: place.name, placeId: place.id })
      notify(`Added ${place.name} to your trip`)
    })

  return (
    <>
      <PageHeader eyebrow={city.name} title="Next best thing" subtitle={`A short list for ${city.name}. Open a place for how to get there.`} />

      <div className="stack">
        <div className="field__control">
          <Search className="field__icon" aria-hidden="true" />
          <input
            className="field__input"
            type="search"
            placeholder="Search places"
            aria-label="Search places"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="chips" role="group" aria-label="Filter places">
          {filters.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" className="chip" aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {Icon && <Icon aria-hidden="true" />}
              {label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <EmptyState icon={filter === 'saved' ? Heart : Search} title={filter === 'saved' ? 'Nothing saved yet' : 'No places match'}>
            {filter === 'saved' ? 'Tap the heart on a place to keep it here.' : 'Try another filter or a different search.'}
          </EmptyState>
        ) : (
          <div className="places">
            {shown.map((p) => {
              const saved = favorites.includes(p.id)
              const inTrip = trip.some((t) => t.placeId === p.id)
              const match = p.interests.some((i) => interests.includes(i))
              const score = averageRating(allReviews.filter((review) => review.placeId === p.id).map((review) => review.rating))
              return (
                <article key={p.id} className="card place card--interactive">
                  <div className={`place__art place__art--${p.setting}`} aria-hidden="true">
                    <MapPin />
                  </div>
                  <div className="place__body">
                    <div className="place__top">
                      <div>
                        <h2 className="place__name">
                          <Link to={`/app/explore/${p.id}`}>{p.name}</Link>
                        </h2>
                        <span className="place__area">
                          <MapPin aria-hidden="true" /> {p.address}
                        </span>
                        {score !== null && <span className="place__area">{score} out of 5</span>}
                      </div>
                      <button
                        type="button"
                        className={`heart ${saved ? 'is-on' : ''}`}
                        aria-pressed={saved}
                        aria-label={saved ? `Remove ${p.name} from saved` : `Save ${p.name}`}
                        onClick={toggleFavorite(p)}
                      >
                        <Heart aria-hidden="true" />
                      </button>
                    </div>
                    <p className="place__blurb">{p.blurb}</p>
                    <div className="place__foot">
                      <div className="place__tags">
                        <Badge tone={p.setting === 'indoor' ? 'info' : undefined}>{p.setting === 'indoor' ? 'Indoor' : 'Outdoor'}</Badge>
                        {city.id === 'oslo' && (p.osloPass ? <Badge tone="good">On Oslo Pass</Badge> : <Badge tone="warn">Pass: check first</Badge>)}
                        {match && <Badge tone="brand" icon={Sparkles}>Matches you</Badge>}
                      </div>
                      <button type="button" className="chip chip--sm" onClick={addToTrip(p)} disabled={inTrip}>
                        {inTrip ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                        {inTrip ? 'In your trip' : 'Add to trip'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <Alert tone="info">
          Opening hours and entry fees are not shown yet, because Vei only shows what it can verify. Check the official site before you go.
        </Alert>
        <SourceLinks items={city.id === 'oslo' ? [OSLO_PASS_SOURCE, ...uniqueSources(places)] : uniqueSources(places)} />
      </div>
      {gateModal}
    </>
  )
}
