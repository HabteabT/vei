import { Download, KeyRound, LogOut, Mail, Save, ShieldAlert, Trash2, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/auth'
import { useObservable, useTheme, useUserData } from '../../app/hooks'
import { LiveDataSwitch } from '../../components/LiveDataSwitch'
import { PageHeader } from '../../components/PageHeader'
import { initials } from '../../components/UserMenu'
import { BUDGETS, INTERESTS, type Budget, type Interest } from '../../domain/types'
import { validateName, validatePassword } from '../../domain/validators'
import { AuthError } from '../../services/auth/AuthService'
import type { Theme } from '../../services/settings/ThemeSetting'
import { Button } from '../../ui/Button'
import { Alert } from '../../ui/Feedback'
import { PasswordField, TextField } from '../../ui/Field'
import { Modal } from '../../ui/Modal'
import { Segmented } from '../../ui/Segmented'
import { useToast } from '../../ui/Toast'

function messageOf(error: unknown): string {
  return error instanceof AuthError ? error.message : 'Something went wrong. Please try again.'
}

function ProfileCard() {
  const { user, updateName } = useAuth()
  const notify = useToast()
  const [name, setName] = useState(user?.name ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  if (!user) return null

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const problem = validateName(name)
    if (problem) return setError(problem)
    setSaving(true)
    try {
      await updateName(name)
      setError(null)
      notify('Name updated')
    } catch (err) {
      setError(messageOf(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="card card--pad me-card" aria-labelledby="profile-h">
      <div className="me-card__head">
        <span className="avatar avatar--lg">{initials(user.name)}</span>
        <div>
          <h2 id="profile-h">{user.name}</h2>
          <p className="muted">Member since {new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <form className="stack" onSubmit={save}>
        <TextField label="Name" icon={UserIcon} value={name} onChange={(e) => setName(e.target.value)} error={error} autoComplete="name" />
        <TextField label="Email" icon={Mail} value={user.email} readOnly hint="Your email is your sign-in name and cannot be changed in the demo." />
        <div>
          <Button type="submit" loading={saving} disabled={name.trim() === user.name}>
            <Save aria-hidden="true" /> Save changes
          </Button>
        </div>
      </form>
    </section>
  )
}

function PreferencesCard() {
  const { preferences } = useUserData()
  const prefs = useObservable(preferences)
  const toggle = (id: Interest) =>
    preferences.update({ interests: prefs.interests.includes(id) ? prefs.interests.filter((i) => i !== id) : [...prefs.interests, id] })

  return (
    <section className="card card--pad stack" aria-labelledby="prefs-h">
      <h2 id="prefs-h" className="card-title">
        What you like
      </h2>
      <p className="muted">Explore puts matching places first. Nothing leaves this browser.</p>
      <div className="chips" role="group" aria-label="Interests">
        {INTERESTS.map((i) => (
          <button key={i.id} type="button" className="chip" aria-pressed={prefs.interests.includes(i.id)} onClick={() => toggle(i.id)}>
            {i.label}
          </button>
        ))}
      </div>
      <div className="stack stack--tight">
        <h3 className="q__label">Budget</h3>
        <Segmented<Budget | 'none'>
          label="Budget"
          block
          value={prefs.budget ?? 'none'}
          onChange={(v) => preferences.update({ budget: v === 'none' ? null : v })}
          options={[{ value: 'none', label: 'No preference' }, ...BUDGETS.map((b) => ({ value: b.id, label: b.label }))]}
        />
      </div>
    </section>
  )
}

function DeviceCard() {
  const [theme, setTheme] = useTheme()
  return (
    <section className="card card--pad stack" aria-labelledby="device-h">
      <h2 id="device-h" className="card-title">
        This device
      </h2>
      <div className="stack stack--tight">
        <h3 className="q__label">Theme</h3>
        <Segmented<Theme>
          label="Theme"
          block
          value={theme}
          onChange={setTheme}
          options={[
            { value: 'system', label: 'System' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
      </div>
      <LiveDataSwitch />
    </section>
  )
}

function SecurityCard() {
  const { changePassword } = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDone(false)
    const problem = validatePassword(next)
    if (problem) return setError(problem)
    setSaving(true)
    try {
      await changePassword(current, next)
      setCurrent('')
      setNext('')
      setError(null)
      setDone(true)
    } catch (err) {
      setError(messageOf(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="card card--pad" aria-labelledby="sec-h">
      <h2 id="sec-h" className="card-title">
        Password
      </h2>
      <form className="stack" onSubmit={submit}>
        {error && <Alert tone="error">{error}</Alert>}
        {done && <Alert tone="good">Password changed.</Alert>}
        <PasswordField label="Current password" icon={KeyRound} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
        <PasswordField label="New password" icon={KeyRound} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" showStrength hint="At least 8 characters, with letters and a number." />
        <div>
          <Button type="submit" variant="secondary" loading={saving} disabled={!current || !next}>
            Change password
          </Button>
        </div>
      </form>
    </section>
  )
}

function DataCard() {
  const { user, deleteAccount } = useAuth()
  const data = useUserData()
  const navigate = useNavigate()
  const notify = useToast()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const exportData = () => {
    const bundle = { exportedAt: new Date().toISOString(), account: user, ...data.snapshot() }
    const url = URL.createObjectURL(new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'vei-my-data.json'
    link.click()
    URL.revokeObjectURL(url)
    notify('Your data was downloaded')
  }

  const remove = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await deleteAccount(password)
      setOpen(false)
      navigate('/')
      notify('Account deleted')
    } catch (err) {
      setError(messageOf(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card card--pad stack" aria-labelledby="data-h">
      <h2 id="data-h" className="card-title">
        Your data
      </h2>
      <p className="muted">Download everything Vei holds about you, or delete your account and all of it for good.</p>
      <div className="row">
        <Button variant="secondary" onClick={exportData}>
          <Download aria-hidden="true" /> Download my data
        </Button>
        <Button variant="danger" onClick={() => { setPassword(''); setError(null); setOpen(true) }}>
          <Trash2 aria-hidden="true" /> Delete account
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Delete your account?">
        <form className="stack" onSubmit={remove}>
          <Alert tone="warn">This removes your account, saved places, plan and settings. It cannot be undone.</Alert>
          {error && <Alert tone="error">{error}</Alert>}
          <PasswordField label="Confirm with your password" icon={KeyRound} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          <div className="modal__actions">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={busy} disabled={!password}>
              <ShieldAlert aria-hidden="true" /> Delete forever
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

export function MePage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const notify = useToast()

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile and privacy"
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              await signOut()
              navigate('/')
              notify('Signed out. See you soon.')
            }}
          >
            <LogOut aria-hidden="true" /> Sign out
          </Button>
        }
      />
      <div className="stack stack--loose">
        <Alert>
          <b>Demo accounts.</b> In this demo, accounts live only in this browser. A real launch would add an EU-hosted account service without changing the screens.
        </Alert>
        <ProfileCard />
        <PreferencesCard />
        <DeviceCard />
        <SecurityCard />
        <DataCard />
      </div>
    </>
  )
}
