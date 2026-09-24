import { KeyRound, Mail, UserPlus, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/auth'
import { validateEmail, validateName, validatePassword } from '../../domain/validators'
import { AuthError } from '../../services/auth/AuthService'
import { Button } from '../../ui/Button'
import { Alert } from '../../ui/Feedback'
import { PasswordField, TextField } from '../../ui/Field'
import { useToast } from '../../ui/Toast'

interface Errors {
  name?: string | null
  email?: string | null
  password?: string | null
  form?: string | null
}

export function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const notify = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found: Errors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    }
    setErrors(found)
    if (found.name || found.email || found.password) return

    setBusy(true)
    try {
      await signUp({ name, email, password })
      notify(`Welcome to Vei, ${name.trim().split(' ')[0]}`)
      navigate('/app', { replace: true })
    } catch (err) {
      if (err instanceof AuthError) {
        const field = err.code === 'invalid_name' ? 'name' : err.code === 'weak_password' ? 'password' : err.code === 'invalid_email' || err.code === 'email_taken' ? 'email' : 'form'
        setErrors({ [field]: err.message })
      } else {
        setErrors({ form: 'Something went wrong. Please try again.' })
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="stack stack--loose">
      <header>
        <h1 className="auth__title">Create your account</h1>
        <p className="muted">Free. Save places, plan your days and keep your checklist.</p>
      </header>

      {errors.form && <Alert tone="error">{errors.form}</Alert>}

      <form className="stack" onSubmit={submit} noValidate>
        <TextField label="Name" icon={UserRound} autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <TextField label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <PasswordField
          label="Password"
          icon={KeyRound}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint="Use letters and at least one number."
          showStrength
        />
        <Button type="submit" size="lg" block loading={busy}>
          <UserPlus aria-hidden="true" /> Create account
        </Button>
      </form>

      <p className="fineprint">
        Demo build: your account is stored only in this browser, and your password is never saved in plain text. You can download or delete
        everything from your profile at any time.
      </p>

      <p className="auth__switch">
        Already have an account? <Link to="/login">Sign in</Link> · <Link to="/app">Continue as guest</Link>
      </p>
    </div>
  )
}
