import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

const ALERT_ICONS: Record<'info' | 'error' | 'warn' | 'good', LucideIcon> = {
  info: Info,
  error: CircleAlert,
  warn: TriangleAlert,
  good: CircleCheck,
}

export function Alert({
  tone = 'info',
  children,
  role,
}: {
  tone?: 'info' | 'error' | 'warn' | 'good'
  children: ReactNode
  role?: 'alert' | 'status'
}) {
  const Icon = ALERT_ICONS[tone]
  return (
    <div className={`alert ${tone === 'info' ? '' : `alert--${tone}`}`} role={role ?? (tone === 'error' ? 'alert' : undefined)}>
      <Icon aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

export function Badge({
  tone,
  icon: Icon,
  children,
}: {
  tone?: 'good' | 'warn' | 'info' | 'brand'
  icon?: LucideIcon
  children: ReactNode
}) {
  return (
    <span className={`badge ${tone ? `badge--${tone}` : ''}`}>
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </span>
  )
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <span className="spinner" role="status" aria-label={label} />
}

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="empty">
      <span className="empty__icon">
        <Icon aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
