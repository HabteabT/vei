import { JsonRecord } from '../storage/JsonRecord'
import type { KeyValueStore } from '../storage/KeyValueStore'

/**
 * Whether the visitor allows live data (train times, routes, weather). Off by default.
 * Turning it on means the browser talks to Entur and Open-Meteo, which can see the visitor's IP address.
 * This is a device setting, not part of any account.
 */
export class LiveDataSetting extends JsonRecord<boolean> {
  constructor(store: KeyValueStore) {
    super(store, 'vei.settings.liveData', false)
  }
}
