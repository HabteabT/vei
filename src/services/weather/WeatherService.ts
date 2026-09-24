import type { WeatherDescription } from '../../domain/weather'

export interface CurrentWeather extends WeatherDescription {
  temperatureC: number
  isDay: boolean
  /** Highest chance of rain in the next few hours, 0 to 100. */
  rainChanceNextHours: number
}

export interface WeatherService {
  current(lat: number, lon: number, signal?: AbortSignal): Promise<CurrentWeather>
}
