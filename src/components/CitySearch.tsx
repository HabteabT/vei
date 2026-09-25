import { MapPin, Search } from 'lucide-react'
import { useEffect, useId, useState, type KeyboardEvent } from 'react'
import { useCity } from '../app/hooks'
import { CITIES, searchCities, type City } from '../data/cities'

/** One search bar for choosing the city. The rest of the app follows this choice. */
export function CitySearch() {
  const [city, setCity] = useCity()
  const [draft, setDraft] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const id = useId()
  const listId = `${id}-list`
  const typing = draft !== null
  const text = typing ? draft : city.name
  const options = searchCities(typing ? draft : '')

  useEffect(() => setActive(0), [draft])

  const choose = (next: City) => {
    setCity(next.id)
    setDraft(null)
    setOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((index) => Math.min(options.length - 1, index + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => Math.max(0, index - 1))
    } else if (event.key === 'Enter') {
      const pick = (open && options[active]) || (options.length === 1 ? options[0] : undefined)
      if (pick) {
        event.preventDefault()
        choose(pick)
      }
    } else if (event.key === 'Escape') {
      setDraft(null)
      setOpen(false)
    }
  }

  return (
    <div className="citybar">
      <div className="place-search">
        <label className="sr-only" htmlFor={id}>
          Choose a city
        </label>
        <div className="field__control">
          <Search className="field__icon" aria-hidden="true" />
          <input
            id={id}
            className="field__input"
            role="combobox"
            aria-expanded={open && options.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && options[active] ? `${id}-opt-${active}` : undefined}
            autoComplete="off"
            placeholder="Search Oslo, Kristiansand, Bergen, Stavanger"
            value={text}
            onFocus={() => {
              setDraft('')
              setOpen(true)
            }}
            onBlur={() => window.setTimeout(() => { setOpen(false); setDraft(null) }, 120)}
            onChange={(event) => {
              const value = event.target.value
              setDraft(value)
              setOpen(true)
              const exact = CITIES.find((option) => option.name.toLowerCase() === value.trim().toLowerCase())
              if (exact) setCity(exact.id)
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        {open && options.length > 0 && (
          <ul className="place-search__list card" id={listId} role="listbox" aria-label="Cities">
            {options.map((option, index) => (
              <li
                key={option.id}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={option.id === city.id}
                className={index === active ? 'is-active' : ''}
                onMouseDown={(event) => {
                  event.preventDefault()
                  choose(option)
                }}
              >
                <MapPin aria-hidden="true" />
                <span>
                  <b>{option.name}</b>
                  <small className="citybar__meta">
                    {option.region} · {option.airport}
                  </small>
                </span>
              </li>
            ))}
          </ul>
        )}
        {open && typing && options.length === 0 && <p className="field__hint">No city matches. Try Oslo, Kristiansand, Bergen, or Stavanger.</p>}
      </div>
      <p className="citybar__now">Showing only {city.name}.</p>
    </div>
  )
}
