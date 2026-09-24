import { Lock, LogIn, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/auth'
import { validateEmail } from '../../domain/validators'
import { AuthError } from '../../services/auth/AuthService'
import { DEMO_ACCOUNT } from '../../services/auth/DemoAccount'
import { Button } from '../../ui/Button'
import { Alert } from '../../ui/Feedback'
import { PasswordField, TextField } from '../../ui/Field'
import { useToast } from '../../ui/Toast'

export function LoginPage() {
  const { signIn, signInDemo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const notify = useToast()
  const from = (location.state as { from?: string } | null)?.from ?? '/app'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [error, setError] = useState<{ message: string; locked: boolean } | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const invalid = validateEmail(email)
    setEmailError(invalid)
    if (invalid) return
    setBusy(true)
    try {
      await signIn({ email, password })
      notify('Welcome back')
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err instanceof AuthError
          ? { message: err.message, locked: err.code === 'locked' }
          : { message: 'Something went wrong. Please try again.', locked: false },
      )
    } finally {
      setBusy(false)
    }
  }

  const demo = async () => {
    setBusy(true)
    setError(null)
    try {
      await signInDemo()
      navigate(from, { replace: true })
    } catch {
      setError({ message: 'Could not start the demo. Please try again.', locked: false })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="stack stack--loose">
      <header>
        <h1 className="auth__title">Welcome back</h1>
        <p className="muted">Sign in to see your saved places and trip plan.</p>
      </header>

      {from !== '/app' && <Alert>That page needs an account. Sign in and we will take you straight there.</Alert>}
      {error && <Alert tone={error.locked ? 'warn' : 'error'}>{error.message}</Alert>}

      <form className="stack" onSubmit={submit} noValidate>
        <TextField
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <PasswordField label="Password" icon={Lock} autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" size="lg" block loading={busy} disabled={!email || !password}>
          <LogIn aria-hidden="true" /> Sign in
        </Button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <div className="stack stack--tight">
        <Button variant="secondary" size="lg" block onClick={demo} loading={busy}>
          Continue with the demo account
        </Button>
        <p className="fineprint">
          Demo login: <code>{DEMO_ACCOUNT.email}</code> · <code>{DEMO_ACCOUNT.password}</code>
        </p>
      </div>

      <p className="auth__switch">
        New to Vei? <Link to="/signup">Create an account</Link> · <Link to="/app">Continue as guest</Link>
      </p>
    </div>
  )
}
