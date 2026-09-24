import { Radio } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLiveData } from '../app/hooks'
import { Button } from '../ui/Button'

/** Shows its children only when live data is on. Otherwise explains why, with a one-tap way to turn it on. */
export function LiveGate({ what, children }: { what: string; children: ReactNode }) {
  const [enabled, setEnabled] = useLiveData()
  if (enabled) return <>{children}</>
  return (
    <div className="livegate card card--pad">
      <span className="livegate__icon">
        <Radio aria-hidden="true" />
      </span>
      <div>
        <h3>{what} needs live data</h3>
        <p>
          Turning it on lets your browser ask Entur (Norway’s journey planner) and Open-Meteo (weather). They can see your
          IP address, and nothing else is sent. It stays off until you choose.
        </p>
      </div>
      <Button onClick={() => setEnabled(true)}>Turn on live data</Button>
    </div>
  )
}
