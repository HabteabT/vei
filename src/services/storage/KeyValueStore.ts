export type Unsubscribe = () => void

/**
 * The smallest storage contract the app needs. Services depend on this, never on `localStorage`,
 * so tests use memory and a future version can swap in IndexedDB or a server without touching them.
 */
export interface KeyValueStore {
  get(key: string): string | null
  set(key: string, value: string): void
  remove(key: string): void
  /** Called after the key changes, in this tab or (for browser storage) another tab. */
  subscribe(key: string, listener: () => void): Unsubscribe
}
