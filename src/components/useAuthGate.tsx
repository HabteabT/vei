import { Heart } from 'lucide-react'
import { useCallback, useState, type ReactNode } from 'react'
import { useAuth } from '../app/auth'
import { Button, LinkButton } from '../ui/Button'
import { Modal } from '../ui/Modal'

/**
 * Wrap an action that needs an account. Signed-in visitors run it straight away;
 * everyone else sees a friendly sign-in prompt instead.
 */
export function useAuthGate(reason = 'Sign in to save places and plan your trip.'): [(action: () => void) => () => void, ReactNode] {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const gate = useCallback(
    (action: () => void) => () => {
      if (user) action()
      else setOpen(true)
    },
    [user],
  )

  const modal = (
    <Modal open={open} onClose={() => setOpen(false)} title="Sign in to keep this">
      <p style={{ color: 'var(--ink-2)' }}>
        <Heart aria-hidden="true" style={{ width: 16, height: 16, verticalAlign: '-2px', color: 'var(--danger)' }} /> {reason}
        {' '}Your saved items stay tied to your account.
      </p>
      <div className="modal__actions">
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Not now
        </Button>
        <LinkButton to="/signup" variant="secondary">
          Create account
        </LinkButton>
        <LinkButton to="/login">Sign in</LinkButton>
      </div>
    </Modal>
  )

  return [gate, modal]
}
