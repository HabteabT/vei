import type { Interest } from '../domain/types'
import type { Source } from './meta'

export interface Place {
  id: string
  name: string
  area: string
  setting: 'indoor' | 'outdoor'
  /** true only where a public source lists the place as included. null means "check before you go". */
  osloPass: boolean | null
  interests: Interest[]
  blurb: string
}

export const OSLO_PASS_SOURCE: Source = {
  label: 'Visit Oslo: Oslo Pass',
  url: 'https://www.visitoslo.com/activities-and-attractions/oslo-pass/prices',
}

/** A small starter list. Opening hours and prices are left out on purpose until they can be verified. */
export const PLACES: Place[] = [
  { id: 'munch', name: 'Munch Museum', area: 'Bjørvika', setting: 'indoor', osloPass: true, interests: ['art'], blurb: 'Edvard Munch’s art in a tall waterfront museum.' },
  { id: 'national', name: 'National Museum', area: 'City centre', setting: 'indoor', osloPass: true, interests: ['art', 'history'], blurb: 'Norway’s national art museum, a short walk from the harbour.' },
  { id: 'fram', name: 'Fram Museum', area: 'Bygdøy', setting: 'indoor', osloPass: true, interests: ['history', 'family'], blurb: 'Walk aboard the polar ship Fram.' },
  { id: 'kontiki', name: 'Kon-Tiki Museum', area: 'Bygdøy', setting: 'indoor', osloPass: true, interests: ['history', 'family'], blurb: 'Thor Heyerdahl’s raft voyages, up close.' },
  { id: 'folk', name: 'Norwegian Museum of Cultural History', area: 'Bygdøy', setting: 'outdoor', osloPass: true, interests: ['history', 'family'], blurb: 'An open-air museum of old Norwegian buildings (Norsk Folkemuseum).' },
  { id: 'nhm', name: 'Natural History Museum', area: 'Tøyen', setting: 'indoor', osloPass: true, interests: ['nature', 'family'], blurb: 'Fossils and minerals, plus a botanical garden.' },
  { id: 'vigeland', name: 'Vigeland Park', area: 'Frogner', setting: 'outdoor', osloPass: null, interests: ['art', 'nature', 'family'], blurb: 'An open-air park full of Gustav Vigeland’s sculptures.' },
  { id: 'opera', name: 'Oslo Opera House', area: 'Bjørvika', setting: 'outdoor', osloPass: null, interests: ['art', 'nature'], blurb: 'Walk up the sloping white roof for a view over the fjord.' },
  { id: 'cityhall', name: 'Oslo City Hall', area: 'City centre', setting: 'indoor', osloPass: null, interests: ['history', 'art'], blurb: 'Where the Nobel Peace Prize is given every year.' },
]

export function getPlace(id: string): Place | undefined {
  return PLACES.find((place) => place.id === id)
}
