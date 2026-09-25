import { JsonRecord } from '../storage/JsonRecord'
import type { KeyValueStore } from '../storage/KeyValueStore'

/** The city the visitor is using. A device setting, shared by every screen. */
export class CitySetting extends JsonRecord<string> {
  constructor(store: KeyValueStore) {
    super(store, 'vei.settings.city', 'oslo')
  }
}
