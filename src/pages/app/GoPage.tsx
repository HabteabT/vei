import { Plane, Route } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useCity } from '../../app/hooks'
import { FromAirport } from '../../components/FromAirport'
import { PageHeader } from '../../components/PageHeader'
import { TripPlanner } from '../../components/TripPlanner'
import { Segmented } from '../../ui/Segmented'

type Mode = 'airport' | 'planner'

export function GoPage() {
  const [params, setParams] = useSearchParams()
  const [city] = useCity()
  const mode: Mode = params.get('mode') === 'planner' ? 'planner' : 'airport'
  const setMode = (next: Mode) => setParams(next === 'airport' ? {} : { mode: next }, { replace: true })

  return (
    <>
      <PageHeader
        eyebrow="Get around"
        title={mode === 'airport' ? 'From the airport' : 'Plan a trip'}
        subtitle={
          mode === 'airport'
            ? `Compare the ways from ${city.airport} into ${city.name}.`
            : `Stops and addresses in ${city.name}, with real departures.`
        }
        actions={
          <Segmented
            label="Choose a view"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'airport', label: 'Airport', icon: Plane },
              { value: 'planner', label: 'Planner', icon: Route },
            ]}
          />
        }
      />
      {mode === 'airport' ? <FromAirport /> : <TripPlanner />}
    </>
  )
}
