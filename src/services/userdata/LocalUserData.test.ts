import { describe, expect, it } from 'vitest'
import { cryptoIds } from '../auth/LocalAuthService'
import { MemoryStore } from '../storage/MemoryStore'
import { LocalUserDataProvider } from './LocalUserData'

function setup() {
  const store = new MemoryStore()
  return { store, provider: new LocalUserDataProvider(store, cryptoIds, () => 42) }
}

describe('LocalUserData', () => {
  it('toggles favourites', () => {
    const { provider } = setup()
    const data = provider.forUser('u1')
    expect(data.favorites.toggle('munch')).toBe(true)
    expect(data.favorites.get()).toEqual(['munch'])
    expect(data.favorites.toggle('munch')).toBe(false)
    expect(data.favorites.get()).toEqual([])
  })

  it('keeps each user and the guest space separate', () => {
    const { provider } = setup()
    provider.forUser('u1').favorites.toggle('munch')
    expect(provider.forUser('u2').favorites.get()).toEqual([])
    expect(provider.forUser(null).favorites.get()).toEqual([])
  })

  it('returns the same object until data changes (needed by React)', () => {
    const { provider } = setup()
    const data = provider.forUser('u1')
    const first = data.favorites.get()
    expect(data.favorites.get()).toBe(first)
    data.favorites.toggle('fram')
    expect(data.favorites.get()).not.toBe(first)
  })

  it('adds, edits and removes trip items', () => {
    const { provider } = setup()
    const { trip } = provider.forUser('u1')
    const item = trip.add({ title: '  Fram Museum ', placeId: 'fram', slot: 'morning' })
    expect(item).toMatchObject({ title: 'Fram Museum', slot: 'morning', createdAt: 42 })
    trip.update(item.id, { note: 'Bring the rain jacket', slot: 'afternoon' })
    expect(trip.get()[0]).toMatchObject({ note: 'Bring the rain jacket', slot: 'afternoon' })
    trip.remove(item.id)
    expect(trip.get()).toEqual([])
  })

  it('saves checklist progress and resets it', () => {
    const { provider } = setup()
    const { checklist } = provider.forUser('u1')
    checklist.set('ruter-app', true)
    expect(checklist.get()).toEqual({ 'ruter-app': true })
    checklist.reset()
    expect(checklist.get()).toEqual({})
  })

  it('merges preference changes', () => {
    const { provider } = setup()
    const { preferences } = provider.forUser('u1')
    preferences.update({ interests: ['art'] })
    preferences.update({ budget: 'low' })
    expect(preferences.get()).toEqual({ interests: ['art'], budget: 'low' })
  })

  it('exports a snapshot and purges everything', () => {
    const { provider } = setup()
    const data = provider.forUser('u1')
    data.favorites.toggle('munch')
    data.trip.add({ title: 'Walk' })
    expect(data.snapshot().favorites).toEqual(['munch'])
    expect(data.snapshot().trip).toHaveLength(1)

    data.purge()
    expect(data.snapshot()).toEqual({
      favorites: [],
      trip: [],
      checklist: {},
      preferences: { interests: [], budget: null },
    })
  })
})
