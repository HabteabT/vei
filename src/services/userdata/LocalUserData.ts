import type { Preferences, TripItem } from '../../domain/types'
import { JsonRecord } from '../storage/JsonRecord'
import type { KeyValueStore } from '../storage/KeyValueStore'
import type { IdGenerator } from '../auth/LocalAuthService'
import type {
  ChecklistRepository,
  FavoritesRepository,
  PreferencesRepository,
  TripRepository,
  UserData,
  UserDataProvider,
  UserDataSnapshot,
} from './repositories'

const DEFAULT_PREFERENCES: Preferences = { interests: [], budget: null }

class LocalFavorites implements FavoritesRepository {
  constructor(private readonly record: JsonRecord<string[]>) {
    this.get = this.get.bind(this)
    this.subscribe = this.subscribe.bind(this)
  }
  get() {
    return this.record.get()
  }
  subscribe(listener: () => void) {
    return this.record.subscribe(listener)
  }
  toggle(placeId: string): boolean {
    const current = this.record.get()
    const isFavorite = current.includes(placeId)
    this.record.set(isFavorite ? current.filter((id) => id !== placeId) : [...current, placeId])
    return !isFavorite
  }
}

class LocalTrip implements TripRepository {
  constructor(
    private readonly record: JsonRecord<TripItem[]>,
    private readonly ids: IdGenerator,
    private readonly now: () => number,
  ) {
    this.get = this.get.bind(this)
    this.subscribe = this.subscribe.bind(this)
  }
  get() {
    return this.record.get()
  }
  subscribe(listener: () => void) {
    return this.record.subscribe(listener)
  }
  add(input: { title: string; placeId?: string | null; slot?: TripItem['slot']; note?: string }): TripItem {
    const item: TripItem = {
      id: this.ids.id(),
      title: input.title.trim(),
      placeId: input.placeId ?? null,
      slot: input.slot ?? 'anytime',
      note: input.note ?? '',
      createdAt: this.now(),
    }
    this.record.set([...this.record.get(), item])
    return item
  }
  update(id: string, patch: Partial<Pick<TripItem, 'title' | 'slot' | 'note'>>) {
    this.record.set(this.record.get().map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }
  remove(id: string) {
    this.record.set(this.record.get().filter((item) => item.id !== id))
  }
}

class LocalChecklist implements ChecklistRepository {
  constructor(private readonly record: JsonRecord<Record<string, boolean>>) {
    this.get = this.get.bind(this)
    this.subscribe = this.subscribe.bind(this)
  }
  get() {
    return this.record.get()
  }
  subscribe(listener: () => void) {
    return this.record.subscribe(listener)
  }
  set(id: string, done: boolean) {
    this.record.set({ ...this.record.get(), [id]: done })
  }
  reset() {
    this.record.clear()
  }
}

class LocalPreferences implements PreferencesRepository {
  constructor(private readonly record: JsonRecord<Preferences>) {
    this.get = this.get.bind(this)
    this.subscribe = this.subscribe.bind(this)
  }
  get() {
    return this.record.get()
  }
  subscribe(listener: () => void) {
    return this.record.subscribe(listener)
  }
  update(patch: Partial<Preferences>) {
    this.record.set({ ...this.record.get(), ...patch })
  }
}

class LocalUserData implements UserData {
  readonly favorites: FavoritesRepository
  readonly trip: TripRepository
  readonly checklist: ChecklistRepository
  readonly preferences: PreferencesRepository
  private readonly records: JsonRecord<unknown>[]

  constructor(store: KeyValueStore, namespace: string, ids: IdGenerator, now: () => number) {
    const key = (name: string) => `vei.data.${namespace}.${name}`
    const favorites = new JsonRecord<string[]>(store, key('favorites'), [])
    const trip = new JsonRecord<TripItem[]>(store, key('trip'), [])
    const checklist = new JsonRecord<Record<string, boolean>>(store, key('checklist'), {})
    const preferences = new JsonRecord<Preferences>(store, key('preferences'), DEFAULT_PREFERENCES)

    this.favorites = new LocalFavorites(favorites)
    this.trip = new LocalTrip(trip, ids, now)
    this.checklist = new LocalChecklist(checklist)
    this.preferences = new LocalPreferences(preferences)
    this.records = [favorites, trip, checklist, preferences] as JsonRecord<unknown>[]
  }

  snapshot(): UserDataSnapshot {
    return {
      favorites: this.favorites.get(),
      trip: this.trip.get(),
      checklist: this.checklist.get(),
      preferences: this.preferences.get(),
    }
  }

  purge(): void {
    this.records.forEach((record) => record.clear())
  }
}

/** Builds (and reuses) one data space per user, so React always sees stable objects. */
export class LocalUserDataProvider implements UserDataProvider {
  private readonly spaces = new Map<string, UserData>()

  constructor(
    private readonly store: KeyValueStore,
    private readonly ids: IdGenerator,
    private readonly now: () => number = Date.now,
  ) {}

  forUser(userId: string | null): UserData {
    const namespace = userId ?? 'guest'
    let space = this.spaces.get(namespace)
    if (!space) {
      space = new LocalUserData(this.store, namespace, this.ids, this.now)
      this.spaces.set(namespace, space)
    }
    return space
  }
}
