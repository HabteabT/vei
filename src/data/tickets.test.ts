import { describe, expect, it } from 'vitest'
import { recommend } from './tickets'

describe('recommend', () => {
  it('suggests the Oslo Pass for many museums', () => {
    const r = recommend({ stay: 'short', museums: 'many', rides: 'few' })
    expect(r.title).toContain('Oslo Pass')
    expect(r.title).toContain('48 or 72-hour')
  })

  it('matches the pass length to a one-day stay', () => {
    expect(recommend({ stay: 'day', museums: 'many', rides: 'few' }).title).toContain('24-hour')
  })

  it('asks the visitor to do the sum for a few museums', () => {
    expect(recommend({ stay: 'short', museums: 'some', rides: 'many' }).badge).toBe('Do the sum')
  })

  it('suggests a time-based ticket for lots of riding', () => {
    expect(recommend({ stay: 'short', museums: 'few', rides: 'many' }).title).toContain('24-hour ticket')
  })

  it('suggests a longer ticket for a long stay with few museums', () => {
    expect(recommend({ stay: 'long', museums: 'few', rides: 'few' }).title).toContain('7-day')
  })

  it('keeps it simple for a short, light visit', () => {
    expect(recommend({ stay: 'day', museums: 'few', rides: 'few' }).title).toContain('Single tickets')
  })

  it('always links a source', () => {
    const r = recommend({ stay: 'short', museums: 'some', rides: 'few' })
    expect(r.sources.length).toBeGreaterThan(0)
  })
})
