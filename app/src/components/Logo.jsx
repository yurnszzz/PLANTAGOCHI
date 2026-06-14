export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoPotGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="logoCactusGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Pot */}
      <path d="M18 42 L46 42 L43 56 Q42 58 40 58 L24 58 Q22 58 21 56 Z" fill="url(#logoPotGrad)" />
      <rect x="16" y="39" width="32" height="5" rx="2" fill="#B45309" />
      {/* Cactus Body */}
      <ellipse cx="32" cy="30" rx="8" ry="16" fill="url(#logoCactusGrad)" />
      {/* Left Arm */}
      <path d="M24 24 Q18 24 18 18 Q18 14 22 14" stroke="#059669" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Right Arm */}
      <path d="M40 28 Q46 28 46 22 Q46 18 42 18" stroke="#059669" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Spines */}
      <line x1="28" y1="18" x2="26" y2="14" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="36" y1="20" x2="38" y2="16" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="15" x2="32" y2="10" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Flower */}
      <circle cx="32" cy="12" r="3" fill="#F472B6" />
      <circle cx="30" cy="10" r="2" fill="#FB7185" />
      <circle cx="34" cy="10" r="2" fill="#FB7185" />
      <circle cx="32" cy="9" r="1.5" fill="#FBBF24" />
    </svg>
  )
}
