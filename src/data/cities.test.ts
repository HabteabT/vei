import { describe, expect, it } from 'vitest'
import { CITIES, getCity, searchCities } from './cities'

describe('cities', () => {
  it('ships four cities and can find each one', () => {
    expect(CITIES.map((city) => city.id)).toEqual(['oslo', 'kristiansand', 'bergen', 'stavanger'])
    expect(getCity('bergen')?.name).toBe('Bergen')
    expect(getCity('tromso')).toBeUndefined()
  })

  it('searches by name, region, and airport', () => {
    expect(searchCities('').map((city) => city.id)).toEqual(['oslo', 'kristiansand', 'bergen', 'stavanger'])
    expect(searchCities('kjevik').map((city) => city.id)).toEqual(['kristiansand'])
    expect(searchCities('VEST').map((city) => city.id)).toEqual(['bergen'])
    expect(searchCities('zzz')).toEqual([])
  })
})
