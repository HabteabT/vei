/**
 * Live departures from Entur, Norway's national journey planner.
 * Open data under the NLOD licence. Entur asks every client to identify itself with ET-Client-Name.
 * Docs: https://developer.entur.no/apis/open
 */

const ENDPOINT = 'https://api.entur.io/journey-planner/v3/graphql'
const CLIENT_NAME = 'vei-prototype'

/** Stop place IDs from Entur's National Stop Register. */
export const OSLO_AIRPORT = 'NSR:StopPlace:58211'
export const OSLO_S = 'NSR:StopPlace:59872'

export type LiveTrip = {
  /** ISO timestamps with offset, as returned by Entur. */
  start: string
  end: string
  minutes: number
  operator: string
  line: string
}

type TripResponse = {
  data?: {
    trip: {
      tripPatterns: {
        expectedStartTime: string
        expectedEndTime: string
        duration: number
        legs: { mode: string; line: { publicCode: string; authority: { name: string } } | null }[]
      }[]
    }
  }
  errors?: unknown
}

const QUERY = `{
  trip(
    from: { place: "${OSLO_AIRPORT}" }
    to: { place: "${OSLO_S}" }
    numTripPatterns: 10
    modes: { accessMode: foot, egressMode: foot, transportModes: [{ transportMode: rail }] }
  ) {
    tripPatterns {
      expectedStartTime
      expectedEndTime
      duration
      legs { mode line { publicCode authority { name } } }
    }
  }
}`

/** Next direct trains from Oslo Airport to Oslo Central Station (no changes). */
export async function fetchAirportTrains(timeoutMs = 8000): Promise<LiveTrip[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ET-Client-Name': CLIENT_NAME },
      body: JSON.stringify({ query: QUERY }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Entur responded with ${res.status}`)
    const json = (await res.json()) as TripResponse
    if (!json.data) throw new Error('Entur returned no data')

    return json.data.trip.tripPatterns
      .map((t) => ({ t, ride: t.legs.filter((l) => l.line) }))
      .filter(({ ride }) => ride.length === 1)
      .map(({ t, ride }) => ({
        start: t.expectedStartTime,
        end: t.expectedEndTime,
        minutes: Math.round(t.duration / 60),
        operator: ride[0].line!.authority.name,
        line: ride[0].line!.publicCode,
      }))
      .slice(0, 5)
  } finally {
    clearTimeout(timer)
  }
}

export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo' })
}

export function minutesUntil(iso: string, now = Date.now()): number {
  return Math.round((new Date(iso).getTime() - now) / 60000)
}
