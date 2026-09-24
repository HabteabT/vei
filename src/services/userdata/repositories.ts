import type { Preferences, TripItem, TripSlot } from '../../domain/types'
import type { Unsubscribe } from '../storage/KeyValueStore'

/** Anything the UI can read and watch. `get` must return the same object until the data changes. */
export interface Observable<T> {
  get(): T
  subscribe(listener: () => void): Unsubscribe
}

// Each feature asks only for the small interface it needs (interface segregation).

export interface FavoritesRepository extends Observable<string[]> {
  /** Returns true when the place is now a favourite. */
  toggle(placeId: string): boolean
}

export interface TripRepository extends Observable<TripItem[]> {
  add(input: { title: string; placeId?: string | null; slot?: TripSlot; note?: string }): TripItem
  update(id: string, patch: Partial<Pick<TripItem, 'title' | 'slot' | 'note'>>): void
  remove(id: string): void
}

export interface ChecklistRepository extends Observable<Record<string, boolean>> {
  set(id: string, done: boolean): void
  reset(): void
}

export interface PreferencesRepository extends Observable<Preferences> {
  update(patch: Partial<Preferences>): void
}

export interface UserDataSnapshot {
  favorites: string[]
  trip: TripItem[]
  checklist: Record<string, boolean>
  preferences: Preferences
}

export interface UserData {
  favorites: FavoritesRepository
  trip: TripRepository
  checklist: ChecklistRepository
  preferences: PreferencesRepository
  snapshot(): UserDataSnapshot
  /** Removes everything stored for this user. */
  purge(): void
}

export interface UserDataProvider {
  /** `null` means a signed-out visitor, who gets a separate, device-only space. */
  forUser(userId: string | null): UserData
}
