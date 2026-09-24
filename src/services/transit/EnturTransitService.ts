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

/** Nudges search results toward Oslo, so "Karl Johan" finds the street people mean. */
const FOCUS = { lat: 59.91, lon: 10.75 }

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
  distance: number
  expectedStartTime: string
  expectedEndTime: string
  fromPlace: { name: string }
  toPlace: { name: string }
  line: { publicCode: string; authority: { name: string } } | null
}
interface RawPattern {
  expectedStartTime: string
  expectedEndTime: string
  duration: number
  legs: RawLeg[]
}
interface RawGeocoderFeature {
  geometry: { coordinates: [number, number] }
  properties: { id: string; label: string; name: string }
}

export class EnturTransitService implements TransitService {
  constructor(private readonly fetchFn: Fetch = (...args) => fetch(...args)) {}

  async searchPlaces(text: string, signal?: AbortSignal): Promise<PlaceRef[]> {
    const query = text.trim()
    if (query.length < 2) return []
    const params = new URLSearchParams({
      text: query,
      size: '6',
      lang: 'en',
      'boundary.country': 'NOR',
      'focus.point.lat': String(FOCUS.lat),
      'focus.point.lon': String(FOCUS.lon),
    })
    const res = await this.fetchFn(`${GEOCODER_URL}?${params}`, { headers: { 'ET-Client-Name': CLIENT_NAME }, signal })
    if (!res.ok) throw new Error(`Place search failed (${res.status})`)
    const json = (await res.json()) as { features: RawGeocoderFeature[] }
    return json.features.map((f) => ({
      name: f.properties.label || f.properties.name,
      placeId: f.properties.id.startsWith('NSR:') ? f.properties.id : undefined,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
    }))
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
      .map((p) => ({ p, rides: p.legs.filter((leg) => leg.line) }))
      .filter(({ rides }) => rides.length === 1) // direct trains only
      .map(({ p, rides }) => ({
        start: p.expectedStartTime,
        end: p.expectedEndTime,
        minutes: Math.round(p.duration / 60),
        operator: rides[0].line!.authority.name,
        line: rides[0].line!.publicCode,
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
    const json = (await res.json()) as { data?: { trip: { tripPatterns: RawPattern[] } }; errors?: unknown }
    if (!json.data) throw new Error('Journey planner returned no data')
    return json.data.trip.tripPatterns
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

function toJourney(pattern: RawPattern): Journey {
  const legs: Leg[] = pattern.legs.map((leg) => ({
    mode: MODES[leg.mode] ?? 'other',
    minutes: Math.max(1, Math.round(leg.duration / 60)),
    from: leg.fromPlace.name,
    to: leg.toPlace.name,
    start: leg.expectedStartTime,
    end: leg.expectedEndTime,
    distanceMeters: Math.round(leg.distance),
    line: leg.line ? { code: leg.line.publicCode, operator: leg.line.authority.name } : undefined,
  }))
  return {
    start: pattern.expectedStartTime,
    end: pattern.expectedEndTime,
    minutes: Math.round(pattern.duration / 60),
    legs,
    changes: Math.max(0, legs.filter((l) => l.mode !== 'foot').length - 1),
  }
}
