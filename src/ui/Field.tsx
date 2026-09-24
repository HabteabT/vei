import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { useState, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { passwordStrength } from '../domain/validators'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  hint?: string
  error?: string | null
  /** Rendered inside the input box on the right, for example a show/hide button. */
  trailing?: ReactNode
}

export function TextField({ label, icon: Icon, hint, error, trailing, id, className, ...input }: FieldProps) {
  const auto = useId()
  const inputId = id ?? auto
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="field__control">
        {Icon && <Icon className="field__icon" aria-hidden="true" />}
        <input
          {...input}
          id={inputId}
          className={`field__input ${Icon ? '' : 'field__input--plain'} ${trailing ? 'field__input--trailing' : ''} ${className ?? ''}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        {trailing}
      </div>
      {error ? (
        <p className="field__error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function PasswordField({ showStrength, ...rest }: Omit<FieldProps, 'type' | 'trailing'> & { showStrength?: boolean }) {
  const [visible, setVisible] = useState(false)
  const Toggle = visible ? EyeOff : Eye
  const strength = passwordStrength(String(rest.value ?? ''))
  return (
    <div className="field">
      <TextField
        {...rest}
        type={visible ? 'text' : 'password'}
        trailing={
          <button
            type="button"
            className="field__toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
          >
            <Toggle aria-hidden="true" />
          </button>
        }
      />
      {showStrength && (
        <div className="meter" data-level={strength} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
      )}
    </div>
  )
}
