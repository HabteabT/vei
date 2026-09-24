import { describe, expect, it } from 'vitest'
import { clockTime, formatMinutes, greeting, minutesUntil, osloHour } from './time'

describe('time helpers', () => {
  it('shows Norwegian local time regardless of the offset in the input', () => {
    expect(clockTime('2026-09-24T16:20:00+02:00')).toBe('16:20')
    expect(clockTime('2026-09-24T14:20:00Z')).toBe('16:20')
  })

  it('counts minutes until a departure', () => {
    const now = Date.parse('2026-09-24T14:00:00Z')
    expect(minutesUntil('2026-09-24T14:12:00Z', now)).toBe(12)
    expect(minutesUntil('2026-09-24T13:58:00Z', now)).toBe(-2)
  })

  it('formats durations', () => {
    expect(formatMinutes(19)).toBe('19 min')
    expect(formatMinutes(60)).toBe('1 h')
    expect(formatMinutes(95)).toBe('1 h 35 min')
  })

  it('greets by the time of day', () => {
    expect(greeting(3)).toBe('Good night')
    expect(greeting(9)).toBe('Good morning')
    expect(greeting(14)).toBe('Good afternoon')
    expect(greeting(20)).toBe('Good evening')
  })

  it('reads the hour in Oslo', () => {
    expect(osloHour(new Date('2026-09-24T14:30:00Z'))).toBe(16)
  })
})
