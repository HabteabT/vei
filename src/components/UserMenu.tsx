import { LogIn, LogOut, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/auth'
import { Button, LinkButton } from '../ui/Button'
import { useToast } from '../ui/Toast'

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?'
}

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const notify = useToast()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) {
    return (
      <LinkButton to="/login" variant="secondary" size="sm">
        <LogIn aria-hidden="true" /> Sign in
      </LinkButton>
    )
  }

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/')
    notify('Signed out. See you soon.')
  }

  return (
    <div className="usermenu" ref={ref}>
      <button
        type="button"
        className="usermenu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Account menu for ${user.name}`}
      >
        <span className="avatar">{initials(user.name)}</span>
      </button>
      {open && (
        <div className="usermenu__panel card card--glass" role="menu">
          <div className="usermenu__who">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <Link to="/app/me" role="menuitem" className="usermenu__item" onClick={() => setOpen(false)}>
            <UserRound aria-hidden="true" /> Profile and privacy
          </Link>
          <Button variant="ghost" className="usermenu__item" role="menuitem" onClick={handleSignOut}>
            <LogOut aria-hidden="true" /> Sign out
          </Button>
        </div>
      )}
    </div>
  )
}
