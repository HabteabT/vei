export type WeatherKind = 'clear' | 'partly' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm'

export interface WeatherDescription {
  kind: WeatherKind
  label: string
  /** True when it is a good moment to suggest indoor plans. */
  wet: boolean
}

/** Maps a WMO weather code (used by Open-Meteo) to something a visitor understands. */
export function describeWeather(code: number): WeatherDescription {
  if (code === 0) return { kind: 'clear', label: 'Clear', wet: false }
  if (code === 1 || code === 2) return { kind: 'partly', label: 'Partly cloudy', wet: false }
  if (code === 3) return { kind: 'cloudy', label: 'Cloudy', wet: false }
  if (code === 45 || code === 48) return { kind: 'fog', label: 'Foggy', wet: false }
  if (code >= 51 && code <= 57) return { kind: 'drizzle', label: 'Drizzle', wet: true }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { kind: 'rain', label: 'Rain', wet: true }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { kind: 'snow', label: 'Snow', wet: true }
  if (code >= 95) return { kind: 'storm', label: 'Thunderstorm', wet: true }
  return { kind: 'cloudy', label: 'Unsettled', wet: false }
}
