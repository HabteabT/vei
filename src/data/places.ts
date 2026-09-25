import type { Interest } from '../domain/types'
import type { CityId } from './cities'
import type { Source } from './meta'

export interface Place {
  id: string
  cityId: CityId
  name: string
  area: string
  setting: 'indoor' | 'outdoor'
  /** true only where a public source lists the place as included. null means "check before you go". */
  osloPass: boolean | null
  interests: Interest[]
  blurb: string
  /** Street or place address a visitor can follow. */
  address: string
  /** Used for the weather at this place. Close to the address, not a surveyed pin. */
  lat: number
  lon: number
  source: Source
}

export const OSLO_PASS_SOURCE: Source = {
  label: 'Visit Oslo: Oslo Pass',
  url: 'https://www.visitoslo.com/activities-and-attractions/oslo-pass/prices',
}

const VISIT_OSLO: Source = { label: 'Visit Oslo', url: 'https://www.visitoslo.com/' }
const MUNCH: Source = { label: 'Munch Museum', url: 'https://www.munch.no/en/about/contact/' }
const NATIONAL: Source = { label: 'National Museum', url: 'https://www.nasjonalmuseet.no/en/about-the-national-museum/contact-us/' }
const FRAM: Source = { label: 'Fram Museum', url: 'https://frammuseum.no/en/contact/' }
const KONTIKI: Source = { label: 'Kon-Tiki Museum', url: 'https://www.kon-tiki.no/en/find-us' }
const FOLK: Source = { label: 'Norsk Folkemuseum', url: 'https://norskfolkemuseum.no/en/plan-your-visit' }
const OPERA: Source = { label: 'Oslo Opera House', url: 'https://www.operaen.no/en/about-us-oslo-operahouse/contact-us/' }
const DYREPARKEN_SITE: Source = { label: 'Dyreparken', url: 'https://www.dyreparken.no/kontakt-oss/' }
const FISKEBRYGGA: Source = { label: 'Visit Norway: Fiskebrygga', url: 'https://www.visitnorway.com/listings/fiskebrygga-the-fish-quay-in-kristiansand/19910/' }
const VISIT_KRISTIANSAND: Source = {
  label: 'Visit Norway: Kristiansand',
  url: 'https://www.visitnorway.com/places-to-go/southern-norway/kristiansand/',
}
const VISIT_BERGEN: Source = { label: 'Visit Bergen', url: 'https://en.visitbergen.com/' }
const VISIT_STAVANGER: Source = {
  label: 'Visit Norway: the Stavanger region',
  url: 'https://www.visitnorway.com/places-to-go/fjord-norway/the-stavanger-region/',
}

/** A small starter list. Opening hours and prices are left out on purpose until they can be verified. */
export const PLACES: Place[] = [
  { id: 'munch', cityId: 'oslo', name: 'Munch Museum', area: 'Bjørvika', setting: 'indoor', osloPass: true, interests: ['art'], blurb: 'Edvard Munch’s art in a tall waterfront museum.', address: 'Edvard Munchs plass 1, 0194 Oslo', lat: 59.9057, lon: 10.7552, source: MUNCH },
  { id: 'national', cityId: 'oslo', name: 'National Museum', area: 'City centre', setting: 'indoor', osloPass: true, interests: ['art', 'history'], blurb: 'Norway’s national art museum, a short walk from the harbour.', address: 'Brynjulf Bulls plass 3, 0250 Oslo', lat: 59.9098, lon: 10.7306, source: NATIONAL },
  { id: 'fram', cityId: 'oslo', name: 'Fram Museum', area: 'Bygdøy', setting: 'indoor', osloPass: true, interests: ['history', 'family'], blurb: 'Walk aboard the polar ship Fram.', address: 'Bygdøynesveien 39, 0286 Oslo', lat: 59.9034, lon: 10.6999, source: FRAM },
  { id: 'kontiki', cityId: 'oslo', name: 'Kon-Tiki Museum', area: 'Bygdøy', setting: 'indoor', osloPass: true, interests: ['history', 'family'], blurb: 'Thor Heyerdahl’s raft voyages, up close.', address: 'Bygdøynesveien 36, 0286 Oslo', lat: 59.9036, lon: 10.6982, source: KONTIKI },
  { id: 'folk', cityId: 'oslo', name: 'Norwegian Museum of Cultural History', area: 'Bygdøy', setting: 'outdoor', osloPass: true, interests: ['history', 'family'], blurb: 'An open-air museum of old Norwegian buildings (Norsk Folkemuseum).', address: 'Museumsveien 10, 0287 Oslo', lat: 59.9069, lon: 10.6855, source: FOLK },
  { id: 'nhm', cityId: 'oslo', name: 'Natural History Museum', area: 'Tøyen', setting: 'indoor', osloPass: true, interests: ['nature', 'family'], blurb: 'Fossils and minerals, plus a botanical garden.', address: 'Sars’ gate 1, 0562 Oslo', lat: 59.92, lon: 10.7716, source: VISIT_OSLO },
  { id: 'vigeland', cityId: 'oslo', name: 'Vigeland Park', area: 'Frogner', setting: 'outdoor', osloPass: null, interests: ['art', 'nature', 'family'], blurb: 'An open-air park full of Gustav Vigeland’s sculptures.', address: 'Frognerparken, 0268 Oslo', lat: 59.927, lon: 10.7008, source: VISIT_OSLO },
  { id: 'opera', cityId: 'oslo', name: 'Oslo Opera House', area: 'Bjørvika', setting: 'outdoor', osloPass: null, interests: ['art', 'nature'], blurb: 'Walk up the sloping white roof for a view over the fjord.', address: 'Kirsten Flagstads plass 1, 0150 Oslo', lat: 59.9076, lon: 10.753, source: OPERA },
  { id: 'cityhall', cityId: 'oslo', name: 'Oslo City Hall', area: 'City centre', setting: 'indoor', osloPass: null, interests: ['history', 'art'], blurb: 'Where the Nobel Peace Prize is given every year.', address: 'Rådhusplassen 1, 0037 Oslo', lat: 59.9118, lon: 10.7336, source: VISIT_OSLO },
  { id: 'dyreparken', cityId: 'kristiansand', name: 'Dyreparken', area: 'Kristiansand', setting: 'outdoor', osloPass: null, interests: ['family', 'nature'], blurb: 'The zoo and amusement park, with a water park in summer. A full day for families.', address: 'Dyreparkveien 1, 4609 Kardemomme by', lat: 58.1818, lon: 8.1475, source: DYREPARKEN_SITE },
  { id: 'fiskebrygga', cityId: 'kristiansand', name: 'Fiskebrygga', area: 'Harbour', setting: 'outdoor', osloPass: null, interests: ['food'], blurb: 'The fish quay: a harbour with canals, and a favourite spot on a sunny day.', address: 'Gravane 8, Kristiansand', lat: 58.1443, lon: 7.9942, source: FISKEBRYGGA },
  { id: 'posebyen', cityId: 'kristiansand', name: 'Posebyen', area: 'City centre', setting: 'outdoor', osloPass: null, interests: ['history'], blurb: 'The old town of white wooden houses, and a good place to start a walk.', address: 'Posebyen, Kristiansand', lat: 58.1482, lon: 7.9958, source: VISIT_KRISTIANSAND },
  { id: 'ravnedalen', cityId: 'kristiansand', name: 'Ravnedalen', area: 'Near the centre', setting: 'outdoor', osloPass: null, interests: ['nature'], blurb: 'A valley nature park, a short walk from the city centre.', address: 'Ravnedalen, Kristiansand', lat: 58.1558, lon: 7.9782, source: VISIT_KRISTIANSAND },
  { id: 'odderoya', cityId: 'kristiansand', name: 'Odderøya', area: 'Harbour', setting: 'outdoor', osloPass: null, interests: ['nature', 'art'], blurb: 'A former naval base by the harbour, with trails. Kilden concert hall is here.', address: 'Odderøya, Kristiansand', lat: 58.1368, lon: 8.0025, source: VISIT_KRISTIANSAND },
  { id: 'bystranda', cityId: 'kristiansand', name: 'Bystranda', area: 'City centre', setting: 'outdoor', osloPass: null, interests: ['nature', 'family'], blurb: 'The city beach, with sand, and the centre a short walk away.', address: 'Bystranda, Østre Strandgate, Kristiansand', lat: 58.1412, lon: 8.0032, source: VISIT_KRISTIANSAND },
  { id: 'bryggen', cityId: 'bergen', name: 'Bryggen', area: 'Harbour', setting: 'outdoor', osloPass: null, interests: ['history'], blurb: 'The old wharf on the harbour, and the usual start of a walk through the centre.', address: 'Bryggen, 5003 Bergen', lat: 60.3974, lon: 5.3238, source: VISIT_BERGEN },
  { id: 'floibanen', cityId: 'bergen', name: 'Fløibanen', area: 'City centre', setting: 'outdoor', osloPass: null, interests: ['nature'], blurb: 'The funicular from the centre up to Fløyen, for a view over the city.', address: 'Vetrlidsallmenningen, 5014 Bergen', lat: 60.3968, lon: 5.3285, source: VISIT_BERGEN },
  { id: 'fisketorget', cityId: 'bergen', name: 'Fish market', area: 'Harbour', setting: 'outdoor', osloPass: null, interests: ['food'], blurb: 'The harbour market, between Bryggen and the centre.', address: 'Torget, 5014 Bergen', lat: 60.3955, lon: 5.3245, source: VISIT_BERGEN },
  { id: 'pulpit', cityId: 'stavanger', name: 'Preikestolen', area: 'Lysefjord', setting: 'outdoor', osloPass: null, interests: ['nature'], blurb: 'The Pulpit Rock, a cliff over Lysefjord. A day trip by bus or boat, not a walk from the centre.', address: 'Preikestolen, Lysefjorden', lat: 58.9865, lon: 6.1904, source: VISIT_STAVANGER },
  { id: 'gamle', cityId: 'stavanger', name: 'Old Stavanger', area: 'City centre', setting: 'outdoor', osloPass: null, interests: ['history'], blurb: 'Wooden houses in a compact centre you can walk. Visit Norway suggests seeing the highlights on foot.', address: 'Øvre Strandgate, Gamle Stavanger', lat: 58.9727, lon: 5.7292, source: VISIT_STAVANGER },
  { id: 'jaeren', cityId: 'stavanger', name: 'Jæren beaches', area: 'Jæren', setting: 'outdoor', osloPass: null, interests: ['nature'], blurb: 'Long sandy beaches south of the city. The local train towards Egersund is the simple way out.', address: 'Jæren, Rogaland', lat: 58.848, lon: 5.548, source: VISIT_STAVANGER },
]

export function placesIn(cityId: CityId): Place[] {
  return PLACES.filter((place) => place.cityId === cityId)
}

export function getPlace(id: string): Place | undefined {
  return PLACES.find((place) => place.id === id)
}
