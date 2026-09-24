import { describe, expect, it } from 'vitest'
import { describeWeather } from './weather'

describe('describeWeather', () => {
  it('reads clear and cloudy codes', () => {
    expect(describeWeather(0)).toMatchObject({ kind: 'clear', wet: false })
    expect(describeWeather(3)).toMatchObject({ kind: 'cloudy', wet: false })
  })

  it('marks wet weather so indoor plans can be suggested', () => {
    expect(describeWeather(61)).toMatchObject({ kind: 'rain', wet: true })
    expect(describeWeather(81)).toMatchObject({ kind: 'rain', wet: true })
    expect(describeWeather(73)).toMatchObject({ kind: 'snow', wet: true })
    expect(describeWeather(95)).toMatchObject({ kind: 'storm', wet: true })
    expect(describeWeather(53)).toMatchObject({ kind: 'drizzle', wet: true })
  })

  it('does not crash on unknown codes', () => {
    expect(describeWeather(999).label).toBeTruthy()
    expect(describeWeather(-1).wet).toBe(false)
  })
})
