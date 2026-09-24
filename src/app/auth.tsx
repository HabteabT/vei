import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '../domain/types'
import type { SignInInput, SignUpInput } from '../services/auth/AuthService'
import { signInAsDemo } from '../services/auth/DemoAccount'
import { useServices } from './services'

interface AuthApi {
  /** `loading` only lasts a moment at start-up while the saved session is checked. */
  status: 'loading' | 'ready'
  user: User | null
  /** True after the visitor deliberately signed out or deleted their account. Guards use it to send them home, not to sign-in. */
  leftOnPurpose: boolean
  signIn(input: SignInInput): Promise<void>
  signUp(input: SignUpInput): Promise<void>
  signInDemo(): Promise<void>
  signOut(): Promise<void>
  updateName(name: string): Promise<void>
  changePassword(current: string, next: string): Promise<void>
  deleteAccount(password: string): Promise<void>
}

const AuthContext = createContext<AuthApi | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth } = useServices()
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [leftOnPurpose, setLeftOnPurpose] = useState(false)

  // Pick up the saved session, and changes made in other tabs.
  useEffect(() => {
    let alive = true
    const refresh = () =>
      auth.getCurrentUser().then((current) => {
        if (!alive) return
        setUser(current)
        setStatus('ready')
      })
    void refresh()
    const stop = auth.onAuthChange(() => void refresh())
    return () => {
      alive = false
      stop()
    }
  }, [auth])

  const api = useMemo<AuthApi>(
    () => ({
      status,
      user,
      leftOnPurpose,
      // Set the user right away so a guarded page never sees a stale "signed out" state after navigating.
      signIn: async (input) => {
        setUser(await auth.signIn(input))
        setLeftOnPurpose(false)
      },
      signUp: async (input) => {
        setUser(await auth.signUp(input))
        setLeftOnPurpose(false)
      },
      signInDemo: async () => {
        await signInAsDemo(auth)
        setUser(await auth.getCurrentUser())
        setLeftOnPurpose(false)
      },
      signOut: async () => {
        await auth.signOut()
        setLeftOnPurpose(true)
        setUser(null)
      },
      updateName: async (name) => setUser(await auth.updateName(name)),
      changePassword: (current, next) => auth.changePassword(current, next),
      deleteAccount: async (password) => {
        await auth.deleteAccount(password)
        setLeftOnPurpose(true)
        setUser(null)
      },
    }),
    [auth, status, user, leftOnPurpose],
  )

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthApi {
  const api = useContext(AuthContext)
  if (!api) throw new Error('useAuth must be used inside <AuthProvider>')
  return api
}
