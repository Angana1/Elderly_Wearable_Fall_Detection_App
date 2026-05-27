// AEGIS Logo — a refined mark: outer protective ring (bracelet),
// a soft shield arc at the top, and a calm central dot (pulse/signal).
// Renders crisp at any size.

const LogoMark = ({ size = 36, color = 'var(--aegis-clay)', soft = 'var(--aegis-clay-soft)' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Outer bracelet ring */}
    <circle cx="32" cy="32" r="26" stroke={color} strokeWidth="2.2" fill="none" opacity="0.42" />
    {/* Soft inner ring */}
    <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="1" fill="none" opacity="0.22" />
    {/* Shield arc — top half, gently overlapping the ring */}
    <path
      d="M14 26 C 14 16, 23 9, 32 9 C 41 9, 50 16, 50 26 C 50 32, 46 38, 32 46 C 18 38, 14 32, 14 26 Z"
      fill={color}
    />
    {/* Center pulse dot (cream cutout reads as 'eye/signal') */}
    <circle cx="32" cy="24" r="4" fill="var(--aegis-canvas-soft)" />
  </svg>
);

const Wordmark = ({ size = 22, onDark = false, showMark = true }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: Math.round(size * 0.45),
    fontFamily: 'var(--font-serif)',
    fontWeight: 500,
    fontSize: size,
    letterSpacing: '2.5px',
    color: onDark ? 'var(--aegis-on-dark)' : 'var(--aegis-ink-dark)',
  }}>
    {showMark && <LogoMark size={Math.round(size * 1.5)} />}
    <span>AEGIS</span>
  </span>
);

Object.assign(window, { LogoMark, Wordmark });
