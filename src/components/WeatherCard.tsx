import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  Umbrella,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCity, useLiveData, useRequest } from '../app/hooks'
import { useServices } from '../app/services'
import type { WeatherKind } from '../domain/weather'
import { Skeleton } from './Skeleton'

const ICONS: Record<WeatherKind, LucideIcon> = {
  clear: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
}

/** Current weather. Without coordinates, this is the selected city. A place page passes its own. */
export function WeatherCard({ lat, lon, name }: { lat?: number; lon?: number; name?: string }) {
  const { weather } = useServices()
  const [city] = useCity()
  const [live] = useLiveData()
  const point = { lat: lat ?? city.lat, lon: lon ?? city.lon }
  const label = name ?? city.name
  const { state } = useRequest(live ? (signal) => weather.current(point.lat, point.lon, signal) : null, [weather, point.lat, point.lon])

  if (!live) {
    return (
      <section className="card card--pad tile tile--muted" aria-label="Weather">
        <h2 className="tile__title">{label} weather</h2>
        <p className="tile__hint">Turn on live data to see the weather and get rainy-day suggestions.</p>
      </section>
    )
  }

  if (state.status === 'error') {
    return (
      <section className="card card--pad tile" aria-label="Weather">
        <h2 className="tile__title">{label} weather</h2>
        <p className="tile__hint">Could not load the weather. Check your connection.</p>
      </section>
    )
  }

  if (state.status !== 'ok') {
    return (
      <section className="card card--pad tile" aria-label="Weather" aria-busy="true">
        <Skeleton height={20} width="40%" />
        <Skeleton height={48} width="60%" />
      </section>
    )
  }

  const w = state.data
  const Icon = w.kind === 'clear' && !w.isDay ? Moon : ICONS[w.kind]
  return (
    <section className="card card--pad tile weather" aria-label="Weather">
      <h2 className="tile__title">{label} right now</h2>
      <div className="weather__now">
        <Icon className="weather__icon" aria-hidden="true" />
        <div>
          <div className="weather__temp">{w.temperatureC}°</div>
          <div className="weather__label">{w.label}</div>
        </div>
      </div>
      <p className="tile__hint">Chance of rain in the next hours: {w.rainChanceNextHours}%</p>
      {(w.wet || w.rainChanceNextHours >= 50) && (
        <Link to="/app/explore?filter=indoor" className="weather__nudge">
          <Umbrella aria-hidden="true" /> Wet out there. See indoor places
        </Link>
      )}
    </section>
  )
}
