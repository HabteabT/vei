import { describeWeather } from '../../domain/weather'
import type { CurrentWeather, WeatherService } from './WeatherService'

/**
 * Open-Meteo: free, needs no key, and allows browser calls. Its free tier is for non-commercial use,
 * so a commercial launch needs their paid plan or another provider behind this same interface.
 */
const URL_BASE = 'https://api.open-meteo.com/v1/forecast'

type Fetch = typeof fetch

interface Raw {
  current: { temperature_2m: number; weather_code: number; is_day: number }
  hourly: { precipitation_probability: number[] }
}

export class OpenMeteoWeatherService implements WeatherService {
  constructor(private readonly fetchFn: Fetch = (...args) => fetch(...args)) {}

  async current(lat: number, lon: number, signal?: AbortSignal): Promise<CurrentWeather> {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'temperature_2m,weather_code,is_day',
      hourly: 'precipitation_probability',
      forecast_hours: '6',
      timezone: 'Europe/Oslo',
    })
    const res = await this.fetchFn(`${URL_BASE}?${params}`, { signal })
    if (!res.ok) throw new Error(`Weather failed (${res.status})`)
    const raw = (await res.json()) as Raw
    const chances = raw.hourly.precipitation_probability.filter((n) => typeof n === 'number')
    return {
      ...describeWeather(raw.current.weather_code),
      temperatureC: Math.round(raw.current.temperature_2m),
      isDay: raw.current.is_day === 1,
      rainChanceNextHours: chances.length ? Math.max(...chances) : 0,
    }
  }
}
