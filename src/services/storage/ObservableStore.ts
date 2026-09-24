import type { KeyValueStore, Unsubscribe } from './KeyValueStore'

/** Shared subscribe/notify behaviour for stores. Subclasses only handle where the bytes live. */
export abstract class ObservableStore implements KeyValueStore {
  private listeners = new Map<string, Set<() => void>>()

  abstract get(key: string): string | null
  abstract set(key: string, value: string): void
  abstract remove(key: string): void

  subscribe(key: string, listener: () => void): Unsubscribe {
    let set = this.listeners.get(key)
    if (!set) {
      set = new Set()
      this.listeners.set(key, set)
    }
    set.add(listener)
    return () => {
      set.delete(listener)
    }
  }

  protected notify(key: string): void {
    this.listeners.get(key)?.forEach((listener) => listener())
  }
}
