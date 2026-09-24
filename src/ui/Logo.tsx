import { Link } from 'react-router-dom'

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#19c9b0" />
          <stop offset="55%" stopColor="#3bb8f0" />
          <stop offset="100%" stopColor="#8c6cff" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#logo-gradient)" />
      <path d="M13 47 C 26 47, 20 21, 33 21 S 42 43, 51 17" fill="none" stroke="#06122a" strokeWidth="6" strokeLinecap="round" />
      <circle cx="51" cy="17" r="5.5" fill="#06122a" />
    </svg>
  )
}

export function Logo({ to = '/', compact }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="logo" aria-label="Vei home">
      <LogoMark />
      {!compact && <span>vei</span>}
    </Link>
  )
}
