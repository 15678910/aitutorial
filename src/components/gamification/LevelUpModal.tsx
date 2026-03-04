import { useEffect, useRef } from 'react'
import { LEVELS } from '../../store/xpStore'

// ─── Confetti particle definitions (deterministic, CSS-only) ───────────────

const CONFETTI_PIECES = [
  // [left%, size, color, animation-variant, delay, duration]
  [8,   10, '#32c2a2', 1, 0,    1.8],
  [16,  7,  '#fbbf24', 2, 0.15, 2.1],
  [24,  12, '#f472b6', 3, 0.05, 1.6],
  [33,  8,  '#818cf8', 1, 0.3,  2.3],
  [41,  6,  '#32c2a2', 2, 0.1,  1.9],
  [50,  11, '#fb923c', 3, 0.2,  2.0],
  [58,  7,  '#a78bfa', 1, 0.35, 1.7],
  [67,  9,  '#34d399', 2, 0.08, 2.2],
  [75,  6,  '#fbbf24', 3, 0.25, 1.8],
  [83,  10, '#f472b6', 1, 0.12, 2.0],
  [91,  8,  '#818cf8', 2, 0.4,  1.6],
  [12,  6,  '#fb923c', 3, 0.18, 2.1],
  [46,  9,  '#32c2a2', 1, 0.28, 1.9],
  [70,  7,  '#fbbf24', 2, 0.06, 2.3],
  [88,  11, '#a78bfa', 3, 0.32, 1.7],
] as const

// ─── Props ────────────────────────────────────────────────────────────────

export interface LevelUpModalProps {
  previousLevel: { level: number; title: string; emoji: string }
  newLevel: { level: number; title: string; emoji: string }
  totalXP: number
  onDismiss: () => void
}

// ─── Component ───────────────────────────────────────────────────────────

export default function LevelUpModal({
  previousLevel,
  newLevel,
  totalXP,
  onDismiss,
}: LevelUpModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Auto-focus the dismiss button for keyboard accessibility
  useEffect(() => {
    const timer = setTimeout(() => {
      buttonRef.current?.focus()
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onDismiss])

  // Compute XP progress within the new level
  const newLevelDef = LEVELS[newLevel.level - 1]
  const nextLevelDef = LEVELS[newLevel.level] // undefined if max
  const xpIntoNewLevel = totalXP - newLevelDef.xpRequired
  const xpNeededForNextLevel = nextLevelDef
    ? nextLevelDef.xpRequired - newLevelDef.xpRequired
    : 0
  const progressPct = xpNeededForNextLevel > 0
    ? Math.min(100, Math.round((xpIntoNewLevel / xpNeededForNextLevel) * 100))
    : 100

  const animVariantClass = (v: number) =>
    v === 1
      ? 'confetti-1'
      : v === 2
        ? 'confetti-2'
        : 'confetti-3'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
      className="animate-levelup-overlay fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 12, 41, 0.75)', backdropFilter: 'blur(8px)' }}
      onClick={e => {
        // Dismiss on backdrop click
        if (e.target === e.currentTarget) onDismiss()
      }}
    >
      {/* ── Confetti particles ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {CONFETTI_PIECES.map(([left, size, color, variant, delay, duration], i) => (
          <div
            key={i}
            className={animVariantClass(variant as number)}
            style={{
              position: 'absolute',
              top: '-20px',
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: color as string,
              borderRadius: (i % 3 === 0) ? '2px' : '50%',
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              animationFillMode: 'both',
            }}
          />
        ))}
      </div>

      {/* ── Card ── */}
      <div
        className="animate-levelup-card relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1e1b4b 0%, #29264c 45%, #1a1833 100%)',
          boxShadow:
            '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(50,194,162,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top glow accent */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #32c2a2, transparent)' }}
          aria-hidden="true"
        />

        {/* Radial glow behind emoji */}
        <div
          className="absolute top-0 left-0 right-0 h-56 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(50,194,162,0.18) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative px-8 pt-10 pb-8 text-center">
          {/* Level emoji */}
          <div className="animate-levelup-emoji text-6xl mb-2 leading-none" aria-hidden="true">
            {newLevel.emoji}
          </div>

          {/* "레벨 업!" headline */}
          <h2
            id="levelup-title"
            className="animate-levelup-title text-3xl font-extrabold tracking-tight mb-1"
            style={{
              background: 'linear-gradient(135deg, #32c2a2 0%, #5dd4b8 50%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            레벨 업!
          </h2>

          {/* Level number */}
          <div className="animate-levelup-title text-sm font-bold text-indigo-300 mb-5 tracking-widest uppercase">
            레벨 {newLevel.level}
          </div>

          {/* Level transition display */}
          <div
            className="animate-levelup-body flex items-center justify-center gap-3 mb-6 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Previous level */}
            <div className="text-center">
              <span className="block text-2xl mb-0.5 opacity-60" aria-hidden="true">
                {previousLevel.emoji}
              </span>
              <span className="block text-xs font-semibold text-gray-400">
                {previousLevel.title}
              </span>
            </div>

            {/* Arrow */}
            <div
              className="flex items-center gap-0.5 px-2"
              aria-label="에서"
            >
              <div className="w-6 h-px" style={{ background: 'linear-gradient(90deg, rgba(50,194,162,0.3), rgba(50,194,162,0.8))' }} />
              <div
                className="w-0 h-0"
                style={{
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderLeft: '6px solid rgba(50,194,162,0.8)',
                }}
              />
            </div>

            {/* New level */}
            <div className="text-center">
              <span className="block text-2xl mb-0.5" aria-hidden="true">
                {newLevel.emoji}
              </span>
              <span
                className="block text-xs font-bold"
                style={{ color: '#32c2a2' }}
              >
                {newLevel.title}
              </span>
            </div>
          </div>

          {/* XP progress bar for new level */}
          <div className="animate-levelup-body mb-7">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-gray-400">
                XP 진행도
              </span>
              <span className="text-xs font-bold" style={{ color: '#32c2a2' }}>
                {totalXP.toLocaleString()} XP
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
              }}
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`레벨 ${newLevel.level} XP 진행도 ${progressPct}%`}
            >
              <div
                style={{
                  height: '8px',
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #32c2a2, #5dd4b8)',
                  boxShadow: '0 0 10px rgba(50,194,162,0.5)',
                  transition: 'width 1s ease-out 0.8s',
                  borderRadius: '9999px',
                }}
              />
            </div>
            {nextLevelDef && (
              <div className="text-[11px] text-gray-500 mt-1 text-right">
                다음 레벨까지{' '}
                <span className="text-gray-400 font-semibold">
                  {nextLevelDef.xpRequired - totalXP}
                </span>{' '}
                XP 남음
              </div>
            )}
          </div>

          {/* Dismiss button */}
          <button
            ref={buttonRef}
            onClick={onDismiss}
            className="animate-levelup-body w-full py-3.5 rounded-2xl font-bold text-base text-white transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            style={{
              background: 'linear-gradient(135deg, #32c2a2 0%, #28a88c 100%)',
              boxShadow: '0 4px 20px rgba(50,194,162,0.4)',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 6px 24px rgba(50,194,162,0.55)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 4px 20px rgba(50,194,162,0.4)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = ''
            }}
          >
            계속하기
          </button>
        </div>
      </div>

      {/* ── Inject confetti keyframes into document head (inline style) ── */}
      <style>{`
        .confetti-1 {
          animation: confetti-fall-1 var(--dur, 1.8s) ease-in var(--del, 0s) both;
        }
        .confetti-2 {
          animation: confetti-fall-2 var(--dur, 2.1s) ease-in var(--del, 0s) both;
        }
        .confetti-3 {
          animation: confetti-fall-3 var(--dur, 2.0s) ease-in var(--del, 0s) both;
        }
      `}</style>
    </div>
  )
}
