import { constantTimeEqual, fromHex, randomHex, toHex } from '../crypto/encoding'
import type { PasswordHasher, PasswordRecord } from './PasswordHasher'

/** PBKDF2-HMAC-SHA256 through the browser's built-in Web Crypto. A fresh random salt per password. */
export class Pbkdf2Hasher implements PasswordHasher {
  constructor(private readonly iterations = 210_000) {}

  async hash(password: string): Promise<PasswordRecord> {
    const salt = randomHex(16)
    return { salt, iterations: this.iterations, hash: await this.derive(password, salt, this.iterations) }
  }

  async verify(password: string, record: PasswordRecord): Promise<boolean> {
    const candidate = await this.derive(password, record.salt, record.iterations)
    return constantTimeEqual(candidate, record.hash)
  }

  private async derive(password: string, saltHex: string, iterations: number): Promise<string> {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations },
      key,
      256,
    )
    return toHex(new Uint8Array(bits))
  }
}
