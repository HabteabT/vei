import { Radio } from 'lucide-react'
import { useId } from 'react'
import { useLiveData } from '../app/hooks'

/** The one switch that lets the page talk to Entur and Open-Meteo. Off until the visitor turns it on. */
export function LiveDataSwitch({ compact }: { compact?: boolean }) {
  const [enabled, setEnabled] = useLiveData()
  const id = useId()
  return (
    <div className={`live-switch ${compact ? 'live-switch--compact' : ''}`}>
      <span className="live-switch__icon" data-on={enabled}>
        <Radio aria-hidden="true" />
      </span>
      <div className="live-switch__text">
        <label htmlFor={id}>Live data</label>
        {!compact && (
          <small>
            {enabled
              ? 'On. Your browser asks Entur and Open-Meteo, which can see your IP address.'
              : 'Off. Turn on for real train times, routes and weather.'}
          </small>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={enabled}
        className="switch"
        onClick={() => setEnabled(!enabled)}
      >
        <span className="switch__knob" />
      </button>
    </div>
  )
}
