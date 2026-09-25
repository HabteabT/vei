import {
  OSLO_AIRPORT,
  OSLO_CENTRAL,
  type DirectTrain,
  type Journey,
  type Leg,
  type PlaceRef,
  type TransitMode,
  type TransitService,
} from './TransitService'

/**
 * Entur is Norway's national journey planner. Its data is open (NLOD licence) and free, and browser
 * calls are allowed. Entur asks every client to identify itself with the ET-Client-Name header.
 * Docs: https://developer.entur.no/apis/open
 */
const JOURNEY_URL = 'https://api.entur.io/journey-planner/v3/graphql'
const GEOCODER_URL = 'https://api.entur.io/geocoder/v1/autocomplete'
const CLIENT_NAME = 'vei-prototype'

/** Used when a caller does not name a city. Otherwise search stays inside that city. */
const FOCUS = { lat: 59.91, lon: 10.75, radiusKm: 55 }

type Fetch = typeof fetch

const TRIP_QUERY = `query ($from: Location!, $to: Location!, $modes: Modes) {
  trip(from: $from, to: $to, numTripPatterns: 8, modes: $modes) {
    tripPatterns {
      expectedStartTime
      expectedEndTime
      duration
      legs {
        mode
        duration
        distance
        expectedStartTime
        expectedEndTime
        fromPlace { name }
        toPlace { name }
        line { publicCode authority { name } }
      }
    }
  }
}`

interface RawLeg {
  mode: string
  duration: number
  distance?: number
  expectedStartTime: string
  expectedEndTime: string
  fromPlace?: { name?: string | null } | null
  toPlace?: { name?: string | null } | null
  line: { publicCode?: string | null; authority?: { name?: string | null } | null } | null
}
interface RawPattern {
  expectedStartTime: string
  expectedEndTime: string
  duration: number
  legs?: RawLeg[] | null
}
interface RawGeocoderFeature {
  geometry?: { coordinates?: [number, number] }
  properties?: { id?: string; label?: string; name?: string }
}

export class EnturTransitService implements TransitService {
  constructor(private readonly fetchFn: Fetch = (...args) => fetch(...args)) {}

  async searchPlaces(text: string, signal?: AbortSignal, focus?: { lat: number; lon: number; radiusKm?: number }): Promise<PlaceRef[]> {
    const query = text.trim()
    if (query.length < 2) return []
    const point = focus ?? FOCUS
    const params = new URLSearchParams({
      text: query,
      size: '6',
      lang: 'en',
      'boundary.country': 'NOR',
      'focus.point.lat': String(point.lat),
      'focus.point.lon': String(point.lon),
      'boundary.circle.lat': String(point.lat),
      'boundary.circle.lon': String(point.lon),
      'boundary.circle.radius': String(point.radiusKm ?? FOCUS.radiusKm),
    })
    const res = await this.fetchFn(`${GEOCODER_URL}?${params}`, { headers: { 'ET-Client-Name': CLIENT_NAME }, signal })
    if (!res.ok) throw new Error(`Place search failed (${res.status})`)
    const json = (await res.json()) as { features?: RawGeocoderFeature[] }
    return (json.features ?? []).flatMap((f) => {
      const coords = f.geometry?.coordinates
      const props = f.properties
      if (!coords || coords.length < 2 || !props || (!props.name && !props.label)) return []
      const id = props.id ?? ''
      return [
        {
          name: props.label || props.name || 'Unnamed place',
          placeId: id.startsWith('NSR:') ? id : undefined,
          lat: coords[1],
          lon: coords[0],
        },
      ]
    })
  }

  async planTrip(from: PlaceRef, to: PlaceRef, signal?: AbortSignal): Promise<Journey[]> {
    const patterns = await this.queryTrips({ from: toLocation(from), to: toLocation(to) }, signal)
    return patterns.map(toJourney).slice(0, 5)
  }

  async nextAirportTrains(signal?: AbortSignal): Promise<DirectTrain[]> {
    const patterns = await this.queryTrips(
      {
        from: toLocation(OSLO_AIRPORT),
        to: toLocation(OSLO_CENTRAL),
        modes: { accessMode: 'foot', egressMode: 'foot', transportModes: [{ transportMode: 'rail' }] },
      },
      signal,
    )
    return patterns
      .map((p) => ({ p, rides: (p.legs ?? []).filter((leg) => leg.line) }))
      .filter(({ rides }) => rides.length === 1) // direct trains only
      .map(({ p, rides }) => ({
        start: p.expectedStartTime,
        end: p.expectedEndTime,
        minutes: Math.round(p.duration / 60),
        operator: rides[0].line?.authority?.name || 'Train',
        line: rides[0].line?.publicCode || '',
      }))
      .slice(0, 5)
  }

  private async queryTrips(variables: Record<string, unknown>, signal?: AbortSignal): Promise<RawPattern[]> {
    const res = await this.fetchFn(JOURNEY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ET-Client-Name': CLIENT_NAME },
      body: JSON.stringify({ query: TRIP_QUERY, variables }),
      signal,
    })
    if (!res.ok) throw new Error(`Journey planner failed (${res.status})`)
    const json = (await res.json()) as { data?: { trip?: { tripPatterns?: RawPattern[] | null } | null }; errors?: unknown }
    const patterns = json.data?.trip?.tripPatterns
    if (!patterns) throw new Error('Journey planner returned no data')
    return patterns
  }
}

function toLocation(place: PlaceRef) {
  return place.placeId
    ? { place: place.placeId }
    : { name: place.name, coordinates: { latitude: place.lat, longitude: place.lon } }
}

const MODES: Record<string, TransitMode> = {
  foot: 'foot',
  bus: 'bus',
  trolleybus: 'bus',
  coach: 'coach',
  tram: 'tram',
  metro: 'metro',
  rail: 'rail',
  water: 'water',
  air: 'air',
}

function lineOf(leg: RawLeg): Leg['line'] {
  if (!leg.line) return undefined
  const code = leg.line.publicCode?.trim() ?? ''
  const operator = leg.line.authority?.name?.trim() ?? ''
  if (!code && !operator) return undefined
  return { code, operator }
}

function toJourney(pattern: RawPattern): Journey {
  const legs: Leg[] = (pattern.legs ?? []).map((leg) => ({
    mode: MODES[leg.mode] ?? 'other',
    minutes: Math.max(1, Math.round((leg.duration ?? 0) / 60)),
    from: leg.fromPlace?.name || 'Unknown stop',
    to: leg.toPlace?.name || 'Unknown stop',
    start: leg.expectedStartTime,
    end: leg.expectedEndTime,
    distanceMeters: Math.round(leg.distance ?? 0),
    line: lineOf(leg),
  }))
  return {
    start: pattern.expectedStartTime,
    end: pattern.expectedEndTime,
    minutes: Math.round(pattern.duration / 60),
    legs,
    changes: Math.max(0, legs.filter((l) => l.mode !== 'foot').length - 1),
  }
}
