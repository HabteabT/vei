import { describe, expect, it, vi } from 'vitest'
import { EnturTransitService } from './EnturTransitService'
import { OSLO_AIRPORT } from './TransitService'

const json = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(body) } as Response)

const leg = (over: object = {}) => ({
  mode: 'rail',
  duration: 1140,
  distance: 50000,
  expectedStartTime: '2026-09-24T16:20:00+02:00',
  expectedEndTime: '2026-09-24T16:39:00+02:00',
  fromPlace: { name: 'Oslo lufthavn stasjon' },
  toPlace: { name: 'Oslo S' },
  line: { publicCode: 'FLY2', authority: { name: 'Flytoget' } },
  ...over,
})

describe('EnturTransitService', () => {
  it('identifies itself to Entur and returns only direct trains', async () => {
    const fetchFn = vi.fn(() =>
      json({
        data: {
          trip: {
            tripPatterns: [
              { expectedStartTime: '2026-09-24T16:20:00+02:00', expectedEndTime: '2026-09-24T16:39:00+02:00', duration: 1140, legs: [leg()] },
              {
                // Needs a change, so it is not a "direct" train.
                expectedStartTime: '2026-09-24T16:25:00+02:00',
                expectedEndTime: '2026-09-24T17:00:00+02:00',
                duration: 2100,
                legs: [leg(), leg({ mode: 'bus', line: { publicCode: '31', authority: { name: 'Ruter' } } })],
              },
            ],
          },
        },
      }),
    )
    const trains = await new EnturTransitService(fetchFn as unknown as typeof fetch).nextAirportTrains()

    expect(trains).toEqual([
      { start: '2026-09-24T16:20:00+02:00', end: '2026-09-24T16:39:00+02:00', minutes: 19, operator: 'Flytoget', line: 'FLY2' },
    ])
    const [, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit]
    expect((init.headers as Record<string, string>)['ET-Client-Name']).toBe('vei-prototype')
  })

  it('turns a journey into legs and counts changes, ignoring walking', async () => {
    const fetchFn = vi.fn(() =>
      json({
        data: {
          trip: {
            tripPatterns: [
              {
                expectedStartTime: '2026-09-24T20:10:00+02:00',
                expectedEndTime: '2026-09-24T20:46:00+02:00',
                duration: 2160,
                legs: [leg({ duration: 1560 }), leg({ mode: 'foot', duration: 600, line: null, distance: 700 })],
              },
            ],
          },
        },
      }),
    )
    const [journey] = await new EnturTransitService(fetchFn as unknown as typeof fetch).planTrip(OSLO_AIRPORT, {
      name: 'Karl Johans gate',
      lat: 59.9133,
      lon: 10.7389,
    })
    expect(journey.minutes).toBe(36)
    expect(journey.changes).toBe(0)
    expect(journey.legs.map((l) => l.mode)).toEqual(['rail', 'foot'])
    expect(journey.legs[0].line).toEqual({ code: 'FLY2', operator: 'Flytoget' })
  })

  it('maps place search results and skips tiny queries', async () => {
    const fetchFn = vi.fn(() =>
      json({
        features: [
          { geometry: { coordinates: [10.75, 59.91] }, properties: { id: 'NSR:StopPlace:59872', label: 'Oslo S, Oslo', name: 'Oslo S' } },
          { geometry: { coordinates: [10.7, 59.9] }, properties: { id: 'KVE:TopographicPlace:1-Karl Johan', label: 'Karl Johan, Oslo', name: 'Karl Johan' } },
        ],
      }),
    )
    const service = new EnturTransitService(fetchFn as unknown as typeof fetch)
    expect(await service.searchPlaces('o')).toEqual([])
    expect(fetchFn).not.toHaveBeenCalled()

    const places = await service.searchPlaces('oslo')
    expect(places[0]).toMatchObject({ name: 'Oslo S, Oslo', placeId: 'NSR:StopPlace:59872', lat: 59.91, lon: 10.75 })
    expect(places[1].placeId).toBeUndefined()
  })

  it('returns no places when the geocoder payload is empty', async () => {
    const service = new EnturTransitService((() => json({})) as unknown as typeof fetch)
    await expect(service.searchPlaces('oslo')).resolves.toEqual([])
  })

  it('plans a trip when a line has no operator name', async () => {
    const fetchFn = vi.fn(() =>
      json({
        data: {
          trip: {
            tripPatterns: [
              {
                expectedStartTime: '2026-09-24T20:10:00+02:00',
                expectedEndTime: '2026-09-24T20:30:00+02:00',
                duration: 1200,
                legs: [leg({ line: { publicCode: '31', authority: null } })],
              },
            ],
          },
        },
      }),
    )
    const [journey] = await new EnturTransitService(fetchFn as unknown as typeof fetch).planTrip(OSLO_AIRPORT, {
      name: 'Oslo S',
      lat: 59.91,
      lon: 10.75,
    })
    expect(journey.legs[0].line).toEqual({ code: '31', operator: '' })
    expect(journey.changes).toBe(0)
  })

  it('throws a clear error when Entur fails', async () => {
    const service = new EnturTransitService((() => json({}, false, 503)) as unknown as typeof fetch)
    await expect(service.nextAirportTrains()).rejects.toThrow('503')
  })
})
