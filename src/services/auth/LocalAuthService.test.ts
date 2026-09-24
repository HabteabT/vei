import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryStore } from '../storage/MemoryStore'
import { AuthError } from './AuthService'
import { LocalAuthService, cryptoIds, type Clock } from './LocalAuthService'
import { Pbkdf2Hasher } from './Pbkdf2Hasher'

class FakeClock implements Clock {
  constructor(private t = 1_000_000) {}
  now() {
    return this.t
  }
  advance(ms: number) {
    this.t += ms
  }
}

const anna = { name: 'Anna Berg', email: 'anna@example.no', password: 'goodpass1' }

async function codeOf(promise: Promise<unknown>) {
  try {
    await promise
    return null
  } catch (error) {
    return error instanceof AuthError ? error.code : 'other'
  }
}

describe('LocalAuthService', () => {
  let store: MemoryStore
  let clock: FakeClock
  let auth: LocalAuthService

  beforeEach(() => {
    store = new MemoryStore()
    clock = new FakeClock()
    auth = new LocalAuthService({ store, hasher: new Pbkdf2Hasher(1000), clock, ids: cryptoIds })
  })

  it('signs up, starts a session and never stores the plain password', async () => {
    const user = await auth.signUp(anna)
    expect(user.email).toBe('anna@example.no')
    expect(await auth.getCurrentUser()).toEqual(user)
    expect(store.get('vei.auth.users')).not.toContain('goodpass1')
  })

  it('rejects duplicate emails regardless of case', async () => {
    await auth.signUp(anna)
    expect(await codeOf(auth.signUp({ ...anna, email: 'ANNA@example.no' }))).toBe('email_taken')
  })

  it('rejects weak passwords, bad emails and bad names', async () => {
    expect(await codeOf(auth.signUp({ ...anna, password: 'short' }))).toBe('weak_password')
    expect(await codeOf(auth.signUp({ ...anna, email: 'nope' }))).toBe('invalid_email')
    expect(await codeOf(auth.signUp({ ...anna, name: 'A' }))).toBe('invalid_name')
  })

  it('signs out and signs back in', async () => {
    await auth.signUp(anna)
    await auth.signOut()
    expect(await auth.getCurrentUser()).toBeNull()
    const user = await auth.signIn({ email: ' Anna@Example.no ', password: anna.password })
    expect(user.name).toBe('Anna Berg')
  })

  it('gives the same error for a wrong password and an unknown email', async () => {
    await auth.signUp(anna)
    await auth.signOut()
    const errorOf = async (promise: Promise<unknown>) => {
      try {
        await promise
      } catch (error) {
        return error as AuthError
      }
      throw new Error('expected the promise to reject')
    }
    const wrongPassword = await errorOf(auth.signIn({ email: anna.email, password: 'nope-nope-1' }))
    const unknownEmail = await errorOf(auth.signIn({ email: 'who@example.no', password: 'nope-nope-1' }))
    expect(wrongPassword.code).toBe('invalid_credentials')
    expect(unknownEmail.message).toBe(wrongPassword.message)
  })

  it('locks after 5 failed tries, then unlocks after the wait', async () => {
    await auth.signUp(anna)
    await auth.signOut()
    for (let i = 0; i < 4; i++) {
      expect(await codeOf(auth.signIn({ email: anna.email, password: 'wrong-pass-1' }))).toBe('invalid_credentials')
    }
    expect(await codeOf(auth.signIn({ email: anna.email, password: 'wrong-pass-1' }))).toBe('locked')
    // Even the right password is refused while locked.
    expect(await codeOf(auth.signIn({ email: anna.email, password: anna.password }))).toBe('locked')

    clock.advance(61_000)
    const user = await auth.signIn({ email: anna.email, password: anna.password })
    expect(user.email).toBe(anna.email)
  })

  it('expires sessions after the time limit', async () => {
    await auth.signUp(anna)
    clock.advance(8 * 24 * 60 * 60 * 1000)
    expect(await auth.getCurrentUser()).toBeNull()
  })

  it('changes the password only with the current one', async () => {
    await auth.signUp(anna)
    expect(await codeOf(auth.changePassword('wrong-one-1', 'brandnew1'))).toBe('invalid_credentials')
    expect(await codeOf(auth.changePassword(anna.password, 'weak'))).toBe('weak_password')
    await auth.changePassword(anna.password, 'brandnew1')
    await auth.signOut()
    expect(await codeOf(auth.signIn({ email: anna.email, password: anna.password }))).toBe('invalid_credentials')
    expect(await auth.signIn({ email: anna.email, password: 'brandnew1' })).toBeTruthy()
  })

  it('updates the name', async () => {
    await auth.signUp(anna)
    const updated = await auth.updateName('Anna B. Berg')
    expect(updated.name).toBe('Anna B. Berg')
    expect((await auth.getCurrentUser())?.name).toBe('Anna B. Berg')
  })

  it('requires a session for protected actions', async () => {
    expect(await codeOf(auth.updateName('Someone'))).toBe('not_signed_in')
    expect(await codeOf(auth.deleteAccount('whatever1'))).toBe('not_signed_in')
  })

  it('deletes the account, signs out and runs cleanup hooks', async () => {
    const removed: string[] = []
    auth.onAccountDeleted((id) => removed.push(id))
    const user = await auth.signUp(anna)

    expect(await codeOf(auth.deleteAccount('wrong-pass-1'))).toBe('invalid_credentials')
    await auth.deleteAccount(anna.password)

    expect(removed).toEqual([user.id])
    expect(await auth.getCurrentUser()).toBeNull()
    expect(await codeOf(auth.signIn({ email: anna.email, password: anna.password }))).toBe('invalid_credentials')
  })

  it('notifies listeners when the session changes', async () => {
    let calls = 0
    auth.onAuthChange(() => calls++)
    await auth.signUp(anna)
    await auth.signOut()
    expect(calls).toBeGreaterThanOrEqual(2)
  })
})
