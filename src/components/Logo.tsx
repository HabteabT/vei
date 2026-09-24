export function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="var(--ink)" />
      <path
        d="M14 46 C 26 46, 22 22, 34 22 S 42 42, 50 18"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="18" r="5" fill="var(--brand)" />
    </svg>
  )
}

export function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Vei, back to top">
      <LogoMark />
      <span>vei</span>
    </a>
  )
}
