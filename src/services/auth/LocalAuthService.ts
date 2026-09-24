import type { User } from '../../domain/types'
import { normalizeEmail, validateEmail, validateName, validatePassword } from '../../domain/validators'
import { randomHex } from '../crypto/encoding'
import type { KeyValueStore, Unsubscribe } from '../storage/KeyValueStore'
import { JsonRecord } from '../storage/JsonRecord'
import { AuthError, type AuthService, type SignInInput, type SignUpInput } from './AuthService'
import type { PasswordHasher, PasswordRecord } from './PasswordHasher'

export interface Clock {
  now(): number
}
export const systemClock: Clock = { now: () => Date.now() }

export interface IdGenerator {
  id(): string
  token(): string
}
export const cryptoIds: IdGenerator = {
  id: () => crypto.randomUUID(),
  token: () => randomHex(32),
}

export interface LocalAuthOptions {
  sessionTtlMs: number
  maxFailedAttempts: number
  lockMs: number
}

const DEFAULTS: LocalAuthOptions = {
  sessionTtlMs: 7 * 24 * 60 * 60 * 1000,
  maxFailedAttempts: 5,
  lockMs: 60_000,
}

interface StoredUser extends User {
  password: PasswordRecord
}
interface StoredSession {
  token: string
  userId: string
  expiresAt: number
}
type Attempts = Record<string, { count: number; lockedUntil: number }>

const USERS_KEY = 'vei.auth.users'
const SESSION_KEY = 'vei.auth.session'
const ATTEMPTS_KEY = 'vei.auth.attempts'

const BAD_LOGIN = 'Wrong email or password.'

/**
 * DEMO ONLY. Accounts live in this browser's storage, so this proves the flows (sign up, sign in,
 * protected pages, sign out, delete) but is not real security: anyone with access to the device can
 * read the stored data. Passwords are still never stored in plain text.
 */
export class LocalAuthService implements AuthService {
  private readonly users: JsonRecord<StoredUser[]>
  private readonly session: JsonRecord<StoredSession | null>
  private readonly attempts: JsonRecord<Attempts>
  private readonly options: LocalAuthOptions
  private readonly deletionHooks: ((userId: string) => void)[] = []
  private dummyRecord: Promise<PasswordRecord> | null = null

  constructor(
    private readonly deps: { store: KeyValueStore; hasher: PasswordHasher; clock: Clock; ids: IdGenerator },
    options: Partial<LocalAuthOptions> = {},
  ) {
    this.options = { ...DEFAULTS, ...options }
    this.users = new JsonRecord<StoredUser[]>(deps.store, USERS_KEY, [])
    this.session = new JsonRecord<StoredSession | null>(deps.store, SESSION_KEY, null)
    this.attempts = new JsonRecord<Attempts>(deps.store, ATTEMPTS_KEY, {})
  }

  /** Lets other parts of the app clean up their own data when an account is removed. */
  onAccountDeleted(hook: (userId: string) => void): void {
    this.deletionHooks.push(hook)
  }

  async getCurrentUser(): Promise<User | null> {
    return this.readSessionUser()?.publicUser ?? null
  }

  async signUp(input: SignUpInput): Promise<User> {
    const nameError = validateName(input.name)
    if (nameError) throw new AuthError('invalid_name', nameError)
    const emailError = validateEmail(input.email)
    if (emailError) throw new AuthError('invalid_email', emailError)
    const passwordError = validatePassword(input.password)
    if (passwordError) throw new AuthError('weak_password', passwordError)

    const email = normalizeEmail(input.email)
    if (this.users.get().some((u) => u.email === email)) {
      throw new AuthError('email_taken', 'An account with this email already exists. Try signing in.')
    }

    const user: StoredUser = {
      id: this.deps.ids.id(),
      email,
      name: input.name.trim(),
      createdAt: this.deps.clock.now(),
      password: await this.deps.hasher.hash(input.password),
    }
    this.users.set([...this.users.get(), user])
    this.startSession(user.id)
    return toPublic(user)
  }

  async signIn(input: SignInInput): Promise<User> {
    const email = normalizeEmail(input.email)
    this.assertNotLocked(email)

    const user = this.users.get().find((u) => u.email === email)
    // Hash against a dummy record when the email is unknown, so timing does not reveal which emails exist.
    let ok = false
    if (user) {
      ok = await this.deps.hasher.verify(input.password, user.password)
    } else {
      await this.deps.hasher.verify(input.password, await this.getDummyRecord())
    }

    if (!ok || !user) {
      this.registerFailure(email)
      this.assertNotLocked(email)
      throw new AuthError('invalid_credentials', BAD_LOGIN)
    }

    this.clearFailures(email)
    this.startSession(user.id)
    return toPublic(user)
  }

  async signOut(): Promise<void> {
    this.session.clear()
  }

  async updateName(name: string): Promise<User> {
    const current = this.requireUser()
    const error = validateName(name)
    if (error) throw new AuthError('invalid_name', error)
    const updated: StoredUser = { ...current, name: name.trim() }
    this.users.set(this.users.get().map((u) => (u.id === updated.id ? updated : u)))
    return toPublic(updated)
  }

  async changePassword(current: string, next: string): Promise<void> {
    const user = this.requireUser()
    if (!(await this.deps.hasher.verify(current, user.password))) {
      throw new AuthError('invalid_credentials', 'Your current password is not right.')
    }
    const error = validatePassword(next)
    if (error) throw new AuthError('weak_password', error)
    const updated: StoredUser = { ...user, password: await this.deps.hasher.hash(next) }
    this.users.set(this.users.get().map((u) => (u.id === updated.id ? updated : u)))
    this.startSession(updated.id) // a fresh session token after a password change
  }

  async deleteAccount(password: string): Promise<void> {
    const user = this.requireUser()
    if (!(await this.deps.hasher.verify(password, user.password))) {
      throw new AuthError('invalid_credentials', 'That password is not right.')
    }
    this.users.set(this.users.get().filter((u) => u.id !== user.id))
    this.session.clear()
    this.clearFailures(user.email)
    this.deletionHooks.forEach((hook) => hook(user.id))
  }

  onAuthChange(listener: () => void): Unsubscribe {
    const stops = [this.session.subscribe(listener), this.users.subscribe(listener)]
    return () => stops.forEach((stop) => stop())
  }

  // ---- internals ----

  private readSessionUser(): { stored: StoredUser; publicUser: User } | null {
    const session = this.session.get()
    if (!session) return null
    if (session.expiresAt <= this.deps.clock.now()) {
      this.session.clear()
      return null
    }
    const stored = this.users.get().find((u) => u.id === session.userId)
    if (!stored) {
      this.session.clear()
      return null
    }
    return { stored, publicUser: toPublic(stored) }
  }

  private requireUser(): StoredUser {
    const found = this.readSessionUser()
    if (!found) throw new AuthError('not_signed_in', 'Please sign in first.')
    return found.stored
  }

  private startSession(userId: string): void {
    this.session.set({
      token: this.deps.ids.token(),
      userId,
      expiresAt: this.deps.clock.now() + this.options.sessionTtlMs,
    })
  }

  private getDummyRecord(): Promise<PasswordRecord> {
    this.dummyRecord ??= this.deps.hasher.hash('not-a-real-password')
    return this.dummyRecord
  }

  private assertNotLocked(email: string): void {
    const entry = this.attempts.get()[email]
    const remaining = entry ? entry.lockedUntil - this.deps.clock.now() : 0
    if (remaining > 0) {
      const seconds = Math.ceil(remaining / 1000)
      throw new AuthError('locked', `Too many tries. Wait ${seconds} seconds and try again.`, seconds)
    }
  }

  private registerFailure(email: string): void {
    const all = { ...this.attempts.get() }
    const now = this.deps.clock.now()
    const previous = all[email]
    // Old lock expired: start counting again.
    const count = previous && previous.lockedUntil > 0 && previous.lockedUntil <= now ? 1 : (previous?.count ?? 0) + 1
    all[email] =
      count >= this.options.maxFailedAttempts
        ? { count: 0, lockedUntil: now + this.options.lockMs }
        : { count, lockedUntil: 0 }
    this.attempts.set(all)
  }

  private clearFailures(email: string): void {
    const all = { ...this.attempts.get() }
    delete all[email]
    this.attempts.set(all)
  }
}

function toPublic({ id, email, name, createdAt }: StoredUser): User {
  return { id, email, name, createdAt }
}
