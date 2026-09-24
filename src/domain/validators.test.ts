import { describe, expect, it } from 'vitest'
import { normalizeEmail, passwordStrength, validateEmail, validateName, validatePassword } from './validators'

describe('validators', () => {
  it('accepts normal emails and rejects broken ones', () => {
    expect(validateEmail('anna@example.no')).toBeNull()
    expect(validateEmail('  anna@example.no  ')).toBeNull()
    expect(validateEmail('anna@')).not.toBeNull()
    expect(validateEmail('anna example.no')).not.toBeNull()
    expect(validateEmail('')).not.toBeNull()
  })

  it('normalises emails to lower case without spaces', () => {
    expect(normalizeEmail('  Anna@Example.NO ')).toBe('anna@example.no')
  })

  it('requires a sensible name', () => {
    expect(validateName('A')).not.toBeNull()
    expect(validateName('Al')).toBeNull()
    expect(validateName('x'.repeat(61))).not.toBeNull()
  })

  it('requires 8+ characters with letters and a number', () => {
    expect(validatePassword('short1')).not.toBeNull()
    expect(validatePassword('onlyletters')).not.toBeNull()
    expect(validatePassword('12345678')).not.toBeNull()
    expect(validatePassword('goodpass1')).toBeNull()
  })

  it('scores strength from 0 to 4', () => {
    expect(passwordStrength('')).toBe(0)
    expect(passwordStrength('abc')).toBe(1)
    expect(passwordStrength('Sup3r-long-passphrase!')).toBe(4)
  })
})
