import type { KeyValueStore, Unsubscribe } from './KeyValueStore'

/**
 * One JSON value in a store. `get` returns the same object until the stored text changes,
 * which is what React's useSyncExternalStore needs to avoid endless re-renders.
 */
export class JsonRecord<T> {
  private raw: string | null | undefined = undefined
  private value: T

  constructor(
    private readonly store: KeyValueStore,
    private readonly key: string,
    private readonly fallback: T,
  ) {
    this.value = fallback
    this.get = this.get.bind(this)
    this.subscribe = this.subscribe.bind(this)
  }

  get(): T {
    const raw = this.store.get(this.key)
    if (raw !== this.raw) {
      this.raw = raw
      this.value = parse<T>(raw) ?? this.fallback
    }
    return this.value
  }

  set(value: T): void {
    this.store.set(this.key, JSON.stringify(value))
  }

  clear(): void {
    this.store.remove(this.key)
  }

  subscribe(listener: () => void): Unsubscribe {
    return this.store.subscribe(this.key, listener)
  }
}

function parse<T>(raw: string | null): T | null {
  if (raw === null) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
