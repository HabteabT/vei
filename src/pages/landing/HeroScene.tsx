/**
 * Illustration: a northern-lights sky over layered mountains, with a winding road (a "vei")
 * leading to a glowing pin. Always dark, so it looks the same in light and dark themes.
 */
const STARS: [number, number, number][] = [
  [40, 40, 1.4], [96, 92, 1], [150, 30, 1.6], [214, 64, 1], [268, 26, 1.2], [330, 78, 1.5], [402, 34, 1],
  [462, 70, 1.4], [520, 24, 1.1], [584, 60, 1.6], [612, 118, 1], [70, 140, 1.1], [188, 120, 0.9], [300, 130, 1],
  [430, 116, 1.2], [548, 150, 1], [110, 200, 0.9], [370, 170, 0.9], [610, 200, 1.1],
]

export function HeroScene() {
  return (
    <svg className="scene" viewBox="0 0 640 520" role="img" aria-label="Illustration: northern lights over mountains, with a winding road leading to a glowing pin">
      <defs>
        <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050a1f" />
          <stop offset="0.55" stopColor="#0d1a52" />
          <stop offset="1" stopColor="#1b2f86" />
        </linearGradient>
        <linearGradient id="sc-aur-1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#19c9b0" stopOpacity="0" />
          <stop offset="0.3" stopColor="#19c9b0" />
          <stop offset="0.6" stopColor="#5be38f" />
          <stop offset="1" stopColor="#3bb8f0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sc-aur-2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8c6cff" stopOpacity="0" />
          <stop offset="0.4" stopColor="#8c6cff" />
          <stop offset="0.75" stopColor="#3bb8f0" />
          <stop offset="1" stopColor="#19c9b0" stopOpacity="0" />
        </linearGradient>
        <filter id="sc-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="sc-blur-sm" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <radialGradient id="sc-pin-glow">
          <stop offset="0" stopColor="#5eead4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
        <clipPath id="sc-clip">
          <rect width="640" height="520" rx="32" />
        </clipPath>
      </defs>

      <g clipPath="url(#sc-clip)">
        <rect width="640" height="520" fill="url(#sc-sky)" />

        {STARS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.5 + (i % 4) * 0.12} />
        ))}

        {/* aurora */}
        <path d="M-30 190 C 110 70, 230 260, 370 150 S 560 50, 690 140" fill="none" stroke="url(#sc-aur-1)" strokeWidth="56" opacity="0.55" filter="url(#sc-blur)" />
        <path d="M-30 245 C 130 150, 250 310, 390 215 S 580 130, 690 205" fill="none" stroke="url(#sc-aur-2)" strokeWidth="34" opacity="0.5" filter="url(#sc-blur)" />
        <path d="M-30 200 C 110 85, 230 270, 370 160 S 560 62, 690 150" fill="none" stroke="url(#sc-aur-1)" strokeWidth="6" opacity="0.9" filter="url(#sc-blur-sm)" />

        {/* mountains */}
        <path d="M0 330 L70 262 L130 305 L210 214 L290 300 L362 236 L440 314 L520 250 L590 304 L640 272 L640 520 L0 520Z" fill="#1c2c72" />
        <path d="M0 392 L90 318 L170 372 L262 290 L350 380 L440 306 L530 388 L610 330 L640 350 L640 520 L0 520Z" fill="#111d54" />
        <path d="M0 452 L110 384 L220 446 L330 396 L450 456 L560 398 L640 430 L640 520 L0 520Z" fill="#0a1238" />

        {/* the vei */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M268 540 C 316 486, 430 490, 396 430" stroke="#070d2b" strokeWidth="58" />
          <path d="M396 430 C 372 388, 292 396, 322 350" stroke="#070d2b" strokeWidth="38" />
          <path d="M322 350 C 342 322, 372 330, 356 296" stroke="#070d2b" strokeWidth="22" />
          <path
            d="M268 540 C 316 486, 430 490, 396 430 C 372 388, 292 396, 322 350 C 342 322, 372 330, 356 296"
            stroke="#5eead4"
            strokeWidth="3"
            strokeDasharray="2 12"
            opacity="0.95"
          />
        </g>

        {/* destination pin */}
        <circle cx="356" cy="290" r="34" fill="url(#sc-pin-glow)" />
        <circle cx="356" cy="290" r="7" fill="#5eead4" />
        <circle cx="356" cy="290" r="13" fill="none" stroke="#5eead4" strokeWidth="2" opacity="0.6" />
      </g>
    </svg>
  )
}
