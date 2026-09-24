import { JsonRecord } from '../storage/JsonRecord'
import type { KeyValueStore } from '../storage/KeyValueStore'

export type Theme = 'system' | 'light' | 'dark'

/** The visitor's colour theme choice. A device setting. */
export class ThemeSetting extends JsonRecord<Theme> {
  constructor(store: KeyValueStore) {
    super(store, 'vei.settings.theme', 'system')
  }
}

/** `system` removes the override so the OS setting decides. */
export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  if (theme === 'system') delete root.dataset.theme
  else root.dataset.theme = theme
}
