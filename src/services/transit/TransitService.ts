export interface PlaceRef {
  name: string
  /** A stop-place ID such as "NSR:StopPlace:58211". Absent for plain addresses and "my location". */
  placeId?: string
  lat: number
  lon: number
}

export type TransitMode = 'foot' | 'bus' | 'coach' | 'tram' | 'metro' | 'rail' | 'water' | 'air' | 'other'

export interface Leg {
  mode: TransitMode
  minutes: number
  from: string
  to: string
  start: string
  end: string
  distanceMeters: number
  line?: { code: string; operator: string }
}

export interface Journey {
  start: string
  end: string
  minutes: number
  legs: Leg[]
  /** Number of times you change vehicle. */
  changes: number
}

export interface DirectTrain {
  start: string
  end: string
  minutes: number
  operator: string
  line: string
}

export interface TransitService {
  searchPlaces(text: string, signal?: AbortSignal): Promise<PlaceRef[]>
  planTrip(from: PlaceRef, to: PlaceRef, signal?: AbortSignal): Promise<Journey[]>
  nextAirportTrains(signal?: AbortSignal): Promise<DirectTrain[]>
}

export const OSLO_AIRPORT: PlaceRef = {
  name: 'Oslo Airport (Gardermoen)',
  placeId: 'NSR:StopPlace:58211',
  lat: 60.1934,
  lon: 11.0979,
}

export const OSLO_CENTRAL: PlaceRef = {
  name: 'Oslo Central Station',
  placeId: 'NSR:StopPlace:59872',
  lat: 59.9111,
  lon: 10.7528,
}
