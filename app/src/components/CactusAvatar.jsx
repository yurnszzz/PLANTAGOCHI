import './CactusAvatar.css'

/**
 * CactusAvatar — SVG digital twin of a cactus at various growth levels.
 * level: 1 = seedling, 2 = small, 3 = medium, 4 = large, 5 = flowering
 */
export default function CactusAvatar({ level = 1, name = '', size = 200, animated = true }) {
  const configs = {
    1: { bodyRx: 6, bodyRy: 10, bodyY: 38, arms: false, flower: false, color1: '#6EE7B7', color2: '#34D399', label: 'Benih' },
    2: { bodyRx: 7, bodyRy: 13, bodyY: 35, arms: false, flower: false, color1: '#34D399', color2: '#10B981', label: 'Tunas' },
    3: { bodyRx: 8, bodyRy: 16, bodyY: 30, arms: true, flower: false, color1: '#10B981', color2: '#059669', label: 'Remaja' },
    4: { bodyRx: 9, bodyRy: 18, bodyY: 28, arms: true, flower: false, color1: '#059669', color2: '#047857', label: 'Dewasa' },
    5: { bodyRx: 9, bodyRy: 18, bodyY: 28, arms: true, flower: true, color1: '#059669', color2: '#047857', label: 'Berbunga' },
  }

  const cfg = configs[level] || configs[1]

  return (
    <div className={`cactus-avatar ${animated ? 'cactus-avatar--animated' : ''}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`cg-${level}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={cfg.color1} />
            <stop offset="100%" stopColor={cfg.color2} />
          </linearGradient>
          <linearGradient id="potG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="32" cy="58" rx="14" ry="3" fill="rgba(0,0,0,0.2)" />

        {/* Pot */}
        <path d="M18 42 L46 42 L43 56 Q42 58 40 58 L24 58 Q22 58 21 56 Z" fill="url(#potG)" />
        <rect x="16" y="39" width="32" height="5" rx="2" fill="#B45309" />

        {/* Soil */}
        <ellipse cx="32" cy="42" rx="14" ry="3" fill="#5C3A1E" />
        <ellipse cx="32" cy="42" rx="12" ry="2" fill="#6B4423" />

        {/* Cactus Body */}
        <ellipse cx="32" cy={cfg.bodyY} rx={cfg.bodyRx} ry={cfg.bodyRy} fill={`url(#cg-${level})`} filter="url(#glow)" />

        {/* Ribs / detail lines */}
        {level >= 2 && (
          <>
            <line x1="30" y1={cfg.bodyY - cfg.bodyRy + 4} x2="30" y2={cfg.bodyY + cfg.bodyRy - 4}
              stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="34" y1={cfg.bodyY - cfg.bodyRy + 4} x2="34" y2={cfg.bodyY + cfg.bodyRy - 4}
              stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          </>
        )}

        {/* Arms */}
        {cfg.arms && (
          <>
            <path d="M24 24 Q18 24 18 18 Q18 14 22 14" stroke={cfg.color2} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M40 28 Q46 28 46 22 Q46 18 42 18" stroke={cfg.color2} strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Spines */}
        {level >= 2 && (
          <>
            <line x1="28" y1={cfg.bodyY - 8} x2="26" y2={cfg.bodyY - 12} stroke="#A7F3D0" strokeWidth="1" strokeLinecap="round" />
            <line x1="36" y1={cfg.bodyY - 6} x2="38" y2={cfg.bodyY - 10} stroke="#A7F3D0" strokeWidth="1" strokeLinecap="round" />
          </>
        )}
        {level >= 3 && (
          <line x1="32" y1={cfg.bodyY - cfg.bodyRy + 2} x2="32" y2={cfg.bodyY - cfg.bodyRy - 3} stroke="#A7F3D0" strokeWidth="1" strokeLinecap="round" />
        )}

        {/* Flower */}
        {cfg.flower && (
          <g className="cactus-flower">
            <circle cx="32" cy={cfg.bodyY - cfg.bodyRy + 1} r="3.5" fill="#F472B6" />
            <circle cx="30" cy={cfg.bodyY - cfg.bodyRy - 1} r="2.5" fill="#FB7185" />
            <circle cx="34" cy={cfg.bodyY - cfg.bodyRy - 1} r="2.5" fill="#FB7185" />
            <circle cx="32" cy={cfg.bodyY - cfg.bodyRy - 2} r="1.5" fill="#FBBF24" />
          </g>
        )}

        {/* Eyes - cute face */}
        <circle cx="29" cy={cfg.bodyY - 2} r="1.2" fill="#065F46" />
        <circle cx="35" cy={cfg.bodyY - 2} r="1.2" fill="#065F46" />
        {/* Eye highlights */}
        <circle cx="29.5" cy={cfg.bodyY - 2.5} r="0.4" fill="white" />
        <circle cx="35.5" cy={cfg.bodyY - 2.5} r="0.4" fill="white" />
        {/* Mouth */}
        <path d={`M30 ${cfg.bodyY + 1} Q32 ${cfg.bodyY + 3} 34 ${cfg.bodyY + 1}`} stroke="#065F46" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </svg>

      {name && <p className="cactus-avatar__name">{name}</p>}
      <span className="cactus-avatar__level">Lv.{level} — {cfg.label}</span>
    </div>
  )
}
