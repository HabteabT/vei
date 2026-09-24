export interface PasswordRecord {
  hash: string
  salt: string
  iterations: number
}

/** Turns a password into something safe to store, and checks a password against it later. */
export interface PasswordHasher {
  hash(password: string): Promise<PasswordRecord>
  verify(password: string, record: PasswordRecord): Promise<boolean>
}
