import type { User } from '../../domain/types'
import type { Unsubscribe } from '../storage/KeyValueStore'

export type AuthErrorCode =
  | 'invalid_email'
  | 'invalid_name'
  | 'weak_password'
  | 'email_taken'
  | 'invalid_credentials'
  | 'locked'
  | 'not_signed_in'

export class AuthError extends Error {
  constructor(
    readonly code: AuthErrorCode,
    message: string,
    /** For `locked`: how long until the next try is allowed. */
    readonly retryAfterSeconds?: number,
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export interface SignUpInput {
  name: string
  email: string
  password: string
}

export interface SignInInput {
  email: string
  password: string
}

/**
 * What the UI needs from "the thing that knows who you are".
 * The demo implementation lives in the browser. A real backend (for example an EU-hosted one)
 * only has to implement this same contract.
 */
export interface AuthService {
  getCurrentUser(): Promise<User | null>
  signUp(input: SignUpInput): Promise<User>
  signIn(input: SignInInput): Promise<User>
  signOut(): Promise<void>
  updateName(name: string): Promise<User>
  changePassword(current: string, next: string): Promise<void>
  /** Needs the password again. Removes the account and everything tied to it. */
  deleteAccount(password: string): Promise<void>
  onAuthChange(listener: () => void): Unsubscribe
}
