import { LocalAuthService, cryptoIds, systemClock } from '../services/auth/LocalAuthService'
import type { AuthService } from '../services/auth/AuthService'
import { Pbkdf2Hasher } from '../services/auth/Pbkdf2Hasher'
import { LiveDataSetting } from '../services/settings/LiveDataSetting'
import { ThemeSetting } from '../services/settings/ThemeSetting'
import { BrowserStore } from '../services/storage/BrowserStore'
import type { KeyValueStore } from '../services/storage/KeyValueStore'
import { MemoryStore } from '../services/storage/MemoryStore'
import { EnturTransitService } from '../services/transit/EnturTransitService'
import type { TransitService } from '../services/transit/TransitService'
import { LocalUserDataProvider } from '../services/userdata/LocalUserData'
import type { UserDataProvider } from '../services/userdata/repositories'
import { OpenMeteoWeatherService } from '../services/weather/OpenMeteoWeatherService'
import type { WeatherService } from '../services/weather/WeatherService'

export interface Container {
  auth: AuthService
  userData: UserDataProvider
  transit: TransitService
  weather: WeatherService
  liveData: LiveDataSetting
  theme: ThemeSetting
  /** False when the browser blocks storage, so nothing will survive a reload. */
  persistent: boolean
}

/**
 * The composition root: the only place that chooses concrete implementations.
 * Swapping the demo auth for a real backend means changing the `auth` line here and nothing else.
 */
export function createContainer(): Container {
  const persistent = BrowserStore.isAvailable()
  const store: KeyValueStore = persistent ? new BrowserStore(window.localStorage, window) : new MemoryStore()

  const auth = new LocalAuthService({ store, hasher: new Pbkdf2Hasher(), clock: systemClock, ids: cryptoIds })
  const userData = new LocalUserDataProvider(store, cryptoIds)
  auth.onAccountDeleted((userId) => userData.forUser(userId).purge())

  return {
    auth,
    userData,
    transit: new EnturTransitService(),
    weather: new OpenMeteoWeatherService(),
    liveData: new LiveDataSetting(store),
    theme: new ThemeSetting(store),
    persistent,
  }
}
