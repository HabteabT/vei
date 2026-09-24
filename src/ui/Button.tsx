import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'aurora'
type Size = 'sm' | 'md' | 'lg'

interface Look {
  variant?: Variant
  size?: Size
  block?: boolean
}

function classes({ variant = 'primary', size = 'md', block }: Look, extra?: string) {
  return ['btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, block && 'btn--block', extra].filter(Boolean).join(' ')
}

export function Button({
  variant,
  size,
  block,
  loading,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & Look & { loading?: boolean }) {
  return (
    <button {...rest} type={type} className={classes({ variant, size, block }, className)} disabled={disabled || loading}>
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function LinkButton({ variant, size, block, className, ...rest }: LinkProps & Look) {
  return <Link {...rest} className={classes({ variant, size, block }, className)} />
}

export function IconButton({
  label,
  small,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; small?: boolean; children: ReactNode }) {
  return (
    <button {...rest} type={type} aria-label={label} title={label} className={`icon-btn ${small ? 'icon-btn--sm' : ''} ${className ?? ''}`}>
      {children}
    </button>
  )
}
