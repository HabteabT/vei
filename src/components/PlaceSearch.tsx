import { LocateFixed, MapPin, Search, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useCity } from '../app/hooks'
import { useServices } from '../app/services'
import type { PlaceRef } from '../services/transit/TransitService'
import { Spinner } from '../ui/Feedback'

/** A search box with suggestions from Entur's place search. Fully usable with the keyboard. */
export function PlaceSearch({
  label,
  value,
  onChange,
  icon: Icon = Search,
  allowLocate,
}: {
  label: string
  value: PlaceRef | null
  onChange: (place: PlaceRef | null) => void
  icon?: LucideIcon
  allowLocate?: boolean
}) {
  const { transit } = useServices()
  const [city] = useCity()
  const id = useId()
  const listId = `${id}-list`
  const [text, setText] = useState(value?.name ?? '')
  const [options, setOptions] = useState<PlaceRef[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const typed = useRef(false)

  // Follow outside changes, such as "swap" or a prefilled start.
  useEffect(() => {
    if (value && value.name !== text) {
      typed.current = false
      setText(value.name)
    }
    if (!value && !typed.current) setText('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Look up suggestions shortly after typing stops.
  useEffect(() => {
    if (!typed.current || text.trim().length < 2) {
      setOptions([])
      if (text.trim().length < 2) setMessage(null)
      return
    }
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setLoading(true)
      transit
        .searchPlaces(text, controller.signal, { lat: city.lat, lon: city.lon, radiusKm: 55 })
        .then((found) => {
          setOptions(found)
          setActive(-1)
          setMessage(found.length ? null : 'No places found. Try another spelling.')
        })
        .catch(() => {
          if (!controller.signal.aborted) setMessage('Place search is unavailable right now.')
        })
        .finally(() => !controller.signal.aborted && setLoading(false))
    }, 250)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [text, transit, city.lat, city.lon])

  const choose = (place: PlaceRef) => {
    typed.current = false
    setText(place.name)
    setOpen(false)
    setOptions([])
    onChange(place)
  }

  const locate = () => {
    if (!navigator.geolocation) {
      setMessage('Your browser cannot share your location.')
      return
    }
    setMessage('Finding you…')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMessage(null)
        choose({ name: 'My location', lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      () => setMessage('Could not get your location. You can type an address instead.'),
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' && open && active >= 0 && options[active]) {
      e.preventDefault()
      choose(options[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="place-search">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        <Icon className="field__icon" aria-hidden="true" />
        <input
          id={id}
          className={`field__input ${allowLocate ? 'field__input--trailing' : ''}`}
          role="combobox"
          aria-expanded={open && options.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          autoComplete="off"
          placeholder="Search a place or address"
          value={text}
          onChange={(e) => {
            typed.current = true
            setText(e.target.value)
            setOpen(true)
            setMessage(null)
            if (value) onChange(null)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
        />
        {loading && (
          <span className="place-search__spin">
            <Spinner label="Searching" />
          </span>
        )}
        {allowLocate && (
          <button type="button" className="field__toggle" onClick={locate} aria-label="Use my location" title="Use my location">
            <LocateFixed aria-hidden="true" />
          </button>
        )}
      </div>
      {message && <p className="field__hint">{message}</p>}
      {open && options.length > 0 && (
        <ul className="place-search__list card" id={listId} role="listbox" aria-label={`${label} suggestions`}>
          {options.map((o, i) => (
            <li
              key={`${o.placeId ?? o.name}-${i}`}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'is-active' : ''}
              onMouseDown={(e) => {
                e.preventDefault()
                choose(o)
              }}
            >
              <MapPin aria-hidden="true" />
              <span>{o.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
