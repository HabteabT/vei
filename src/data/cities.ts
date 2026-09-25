/** The cities in this version. Adding a city is a new entry here, plus its guide and places. */
export type CityId = 'oslo' | 'kristiansand' | 'bergen' | 'stavanger'

export interface City {
  id: CityId
  name: string
  region: string
  /** Airport name, used in the city search. */
  airport: string
  /** Airport position, so the trip planner starts in this city. */
  airportLat: number
  airportLon: number
  lat: number
  lon: number
  blurb: string
  /** Local public-transport app visitors should open. */
  transitApp: string
  transitHint: string
}

export const CITIES: City[] = [
  {
    id: 'oslo',
    name: 'Oslo',
    region: 'Oslo',
    airport: 'Oslo Airport, Gardermoen',
    airportLat: 60.1934,
    airportLon: 11.0979,
    lat: 59.91,
    lon: 10.75,
    blurb: 'The deepest guide so far: airport, tickets, pay, and a short list of places.',
    transitApp: 'Ruter',
    transitHint: 'Tickets bought in the app before you board are cheaper than paying on board.',
  },
  {
    id: 'kristiansand',
    name: 'Kristiansand',
    region: 'Agder',
    airport: 'Kristiansand Airport, Kjevik',
    airportLat: 58.2042,
    airportLon: 8.0854,
    lat: 58.146,
    lon: 8.0,
    blurb: 'Southern Norway. The airport bus is a normal city bus, and the centre is walkable.',
    transitApp: 'AKT Reise',
    transitHint: 'Agder kollektivtrafikk (AKT) runs the local buses. A Kjevik to city-centre ride is 1 zone.',
  },
  {
    id: 'bergen',
    name: 'Bergen',
    region: 'Vestland',
    airport: 'Bergen Airport, Flesland',
    airportLat: 60.2934,
    airportLon: 5.2181,
    lat: 60.391,
    lon: 5.324,
    blurb: 'The light rail runs from the airport to the centre. Bryggen and the harbour are the start of a walk.',
    transitApp: 'Skyss',
    transitHint: 'Skyss runs the light rail and local buses. Flybussen is a separate airport coach.',
  },
  {
    id: 'stavanger',
    name: 'Stavanger',
    region: 'Rogaland',
    airport: 'Stavanger Airport, Sola',
    airportLat: 58.8767,
    airportLon: 5.6378,
    lat: 58.97,
    lon: 5.733,
    blurb: 'A compact centre. An airport shuttle links Sola with the bus and train station.',
    transitApp: 'Kolumbus',
    transitHint: 'Kolumbus runs local buses. The airport shuttle is Flybussen, with its own ticket.',
  },
]

const BY_ID = new Map(CITIES.map((city) => [city.id, city]))

export function getCity(id: string | null | undefined): City | undefined {
  if (!id) return undefined
  return BY_ID.get(id as CityId)
}

/** Empty text returns every city. Otherwise match name, region, or airport. */
export function searchCities(query: string): City[] {
  const q = query.trim().toLowerCase()
  if (!q) return CITIES
  return CITIES.filter((city) => `${city.name} ${city.region} ${city.airport}`.toLowerCase().includes(q))
}
