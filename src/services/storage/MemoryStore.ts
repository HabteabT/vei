import { ObservableStore } from './ObservableStore'

/** In-memory store. Used in tests, and as a fallback when the browser blocks localStorage. */
export class MemoryStore extends ObservableStore {
  private data = new Map<string, string>()

  get(key: string): string | null {
    return this.data.get(key) ?? null
  }

  set(key: string, value: string): void {
    this.data.set(key, value)
    this.notify(key)
  }

  remove(key: string): void {
    this.data.delete(key)
    this.notify(key)
  }
}
