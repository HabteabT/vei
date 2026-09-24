import { ObservableStore } from './ObservableStore'

/** localStorage-backed store that also reacts to changes made in other tabs. */
export class BrowserStore extends ObservableStore {
  constructor(private readonly storage: Storage, target?: Window) {
    super()
    target?.addEventListener('storage', (event) => {
      if (event.key) this.notify(event.key)
    })
  }

  /** localStorage can throw (private mode, blocked cookies), so probe it before relying on it. */
  static isAvailable(): boolean {
    try {
      const probe = '__vei_probe__'
      window.localStorage.setItem(probe, '1')
      window.localStorage.removeItem(probe)
      return true
    } catch {
      return false
    }
  }

  get(key: string): string | null {
    try {
      return this.storage.getItem(key)
    } catch {
      return null
    }
  }

  set(key: string, value: string): void {
    this.storage.setItem(key, value)
    this.notify(key)
  }

  remove(key: string): void {
    this.storage.removeItem(key)
    this.notify(key)
  }
}
