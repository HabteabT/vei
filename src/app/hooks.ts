import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import type { Theme } from '../services/settings/ThemeSetting'
import { applyTheme } from '../services/settings/ThemeSetting'
import type { Observable, UserData } from '../services/userdata/repositories'
import { useAuth } from './auth'
import { useServices } from './services'

/** Reads a repository and re-renders when it changes. */
export function useObservable<T>(source: Observable<T>): T {
  return useSyncExternalStore(source.subscribe, source.get)
}

/** The data space for whoever is signed in, or the device-only guest space. */
export function useUserData(): UserData {
  const { user } = useAuth()
  const { userData } = useServices()
  return userData.forUser(user?.id ?? null)
}

export function useLiveData(): [boolean, (on: boolean) => void] {
  const { liveData } = useServices()
  const enabled = useObservable(liveData)
  return [enabled, useCallback((on: boolean) => liveData.set(on), [liveData])]
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const { theme } = useServices()
  const current = useObservable(theme)
  useEffect(() => applyTheme(current), [current])
  return [current, useCallback((next: Theme) => theme.set(next), [theme])]
}

type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading'; data?: T }
  | { status: 'ok'; data: T; at: number }
  | { status: 'error'; error: Error }

/**
 * Runs an async loader. Pass `null` to stay idle. Cancels the previous call when inputs change,
 * so a slow answer can never overwrite a newer one.
 */
export function useRequest<T>(load: ((signal: AbortSignal) => Promise<T>) | null, deps: readonly unknown[]) {
  const [state, setState] = useState<RequestState<T>>({ status: 'idle' })
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!load) {
      setState({ status: 'idle' })
      return
    }
    const controller = new AbortController()
    setState((previous) => ({ status: 'loading', data: previous.status === 'ok' ? previous.data : undefined }))
    load(controller.signal)
      .then((data) => setState({ status: 'ok', data, at: Date.now() }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({ status: 'error', error: error instanceof Error ? error : new Error(String(error)) })
      })
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, load === null, ...deps])

  return { state, reload: useCallback(() => setNonce((n) => n + 1), []) }
}
