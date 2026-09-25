import { ArrowLeft, MapPin } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCity } from '../../app/hooks'
import { PageHeader } from '../../components/PageHeader'
import { PlaceReviews } from '../../components/PlaceReviews'
import { SourceLinks } from '../../components/SourceLinks'
import { WeatherCard } from '../../components/WeatherCard'
import { getCity } from '../../data/cities'
import { getPlace } from '../../data/places'
import { Alert } from '../../ui/Feedback'
import { LinkButton } from '../../ui/Button'

/** One attraction: address, weather, how to get there, and signed-in reviews. */
export function PlacePage() {
  const { placeId } = useParams()
  const place = getPlace(placeId ?? '')
  const [selected, setCity] = useCity()
  useEffect(() => {
    if (place && place.cityId !== selected.id) setCity(place.cityId)
  }, [place, selected.id, setCity])
  if (!place) {
    return (
      <>
        <PageHeader title="Place not found" subtitle="That place is not in the guide." />
        <LinkButton to="/app/explore" variant="secondary">
          <ArrowLeft aria-hidden="true" /> Back to Explore
        </LinkButton>
      </>
    )
  }
  const city = getCity(place.cityId) ?? selected

  return (
    <>
      <PageHeader
        eyebrow={city.name}
        title={place.name}
        subtitle={place.blurb}
        actions={
          <LinkButton to="/app/explore" variant="secondary" size="sm">
            <ArrowLeft aria-hidden="true" /> All places
          </LinkButton>
        }
      />
      <div className="stack">
        <p className="place__area">
          <MapPin aria-hidden="true" /> {place.address}
        </p>
        <p>
          <a href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=16/${place.lat}/${place.lon}`} target="_blank" rel="noreferrer">
            Show {place.name} on the map
          </a>
        </p>
        <WeatherCard lat={place.lat} lon={place.lon} name={place.name} />
        <section className="card card--pad stack" aria-labelledby="get-there">
          <h2 id="get-there" className="card-title">
            From the city centre
          </h2>
          <p>
            Open the planner, set the start to {city.name} city centre, and the destination to {place.name}. With live data on, Entur shows the bus, the changes, and the time.
          </p>
          <Link to="/app/go?mode=planner">Plan this trip</Link>
        </section>
        <PlaceReviews placeId={place.id} placeName={place.name} />
        <Alert tone="info">
          Opening hours, entry fees, and photos are not shown yet. Check the official page before you go.
        </Alert>
        <SourceLinks items={[place.source]} />
      </div>
    </>
  )
}
