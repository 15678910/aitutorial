import { useEffect, useRef, useState } from 'react'
import { useXPStore, LEVELS } from '../../store/xpStore'

// ─── Props ────────────────────────────────────────────────────────────────

export interface XPProgressBarProps {
  /** true = compact single-line for header; false = fuller card display */
  compact?: boolean
}

// ─── Component ───────────────────────────────────────────────────────────

export default function XPProgressBar({ compact = false }: XPProgressBarProps) {
  const {
    totalXP,
    level,
    levelTitle,
    levelEmoji,
    currentLevelXP,
    nextLevelXP,
    xpToNextLevel,
    recentXPGains,
    getProgressPercent,
  } = useXPStore()

  const progressPct = getProgressPercent()
  const nextDef = LEVELS[level] // undefined if max level

  // Track whether XP was recently gained (for glow animation)
  const [glowing, setGlowing] = useState(false)
  const prevGainsCountRef = useRef(recentXPGains.length)
  const prevTotalXPRef = useRef(totalXP)
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Track the displayed progress for smooth bar animation
  const [displayedPct, setDisplayedPct] = useState(progressPct)

  useEffect(() => {
    const xpChanged = totalXP !== prevTotalXPRef.current
    if (xpChanged) {
      prevTotalXPRef.current = totalXP

      // Trigger glow
      setGlowing(true)
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current)
      glowTimerRef.current = setTimeout(() => {
        setGlowing(false)
      }, 1400 * 3 + 200) // matches 3 iterations of xp-glow-pulse at 1.4s each

      // Brief delay then update bar so user sees it "fill"
      setTimeout(() => {
        setDisplayedPct(progressPct)
      }, 80)
    }
  }, [totalXP, progressPct])

  useEffect(() => {
    prevGainsCountRef.current = recentXPGains.length
  }, [recentXPGains.length])

  if (compact) {
    return (
      <div
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
          transition-all duration-300
          ${glowing ? 'animate-xp-glow' : ''}
        `}
        style={{
          background: 'rgba(41,38,76,0.06)',
          border: glowing
            ? '1px solid rgba(50,194,162,0.5)'
            : '1px solid rgba(41,38,76,0.12)',
        }}
        title={`${levelTitle} • ${totalXP} XP 보유${nextDef ? ` • ${xpToNextLevel} XP 남음` : ''}`}
        aria-label={`레벨 ${level} ${levelTitle}, 총 ${totalXP} XP`}
      >
        {/* Emoji + level */}
        <span className="text-base leading-none" aria-hidden="true">{levelEmoji}</span>
        <span
          className="text-xs font-bold whitespace-nowrap"
          style={{ color: '#29264c' }}
        >
          Lv.{level}
        </span>

        {/* Thin bar */}
        <div
          className="relative w-20 rounded-full overflow-hidden"
          style={{ height: '5px', background: 'rgba(41,38,76,0.12)' }}
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="레벨 진행도"
        >
          <div
            className={glowing ? 'animate-xp-bar-shimmer' : ''}
            style={{
              height: '5px',
              width: `${displayedPct}%`,
              background: 'linear-gradient(90deg, #32c2a2, #5dd4b8, #32c2a2)',
              backgroundSize: '200% 100%',
              borderRadius: '9999px',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: glowing ? '0 0 6px rgba(50,194,162,0.7)' : 'none',
            }}
          />
        </div>

        {/* XP fraction */}
        <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: '#6b7280' }}>
          {currentLevelXP}
          {nextDef ? `/${nextLevelXP}` : ''} XP
        </span>
      </div>
    )
  }

  // ── Full display (for profile / dashboard cards) ──────────────────────

  return (
    <div
      className={`
        rounded-2xl p-4 transition-all duration-300
        ${glowing ? 'animate-xp-glow' : ''}
      `}
      style={{
        background: 'linear-gradient(135deg, #29264c 0%, #3d3a66 100%)',
        border: glowing
          ? '1px solid rgba(50,194,162,0.45)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: glowing
          ? '0 4px 20px rgba(50,194,162,0.2)'
          : '0 2px 12px rgba(41,38,76,0.15)',
      }}
      aria-label={`레벨 ${level} ${levelTitle}, 총 ${totalXP} XP`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(50,194,162,0.15)', border: '1px solid rgba(50,194,162,0.25)' }}
            aria-hidden="true"
          >
            {levelEmoji}
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 leading-tight">
              레벨 {level}
            </div>
            <div className="text-sm font-extrabold text-white leading-tight">
              {levelTitle}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div
            className="text-lg font-extrabold leading-tight"
            style={{ color: '#32c2a2' }}
          >
            {totalXP.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-gray-500 leading-tight">
            총 XP
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div
          className="w-full rounded-full overflow-hidden mb-1.5"
          style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="레벨 진행도"
        >
          <div
            className={glowing ? 'animate-xp-bar-shimmer' : ''}
            style={{
              height: '8px',
              width: `${displayedPct}%`,
              background: 'linear-gradient(90deg, #32c2a2, #5dd4b8, #32c2a2)',
              backgroundSize: '200% 100%',
              borderRadius: '9999px',
              transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: glowing ? '0 0 10px rgba(50,194,162,0.6)' : '0 0 6px rgba(50,194,162,0.25)',
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[11px] font-semibold text-gray-500">
            {currentLevelXP} / {nextDef ? nextLevelXP : '—'} XP
          </span>
          {nextDef ? (
            <span className="text-[11px] font-semibold text-gray-400">
              {nextDef.emoji} {nextDef.title}까지{' '}
              <span style={{ color: '#32c2a2' }}>{xpToNextLevel}</span> XP
            </span>
          ) : (
            <span className="text-[11px] font-bold" style={{ color: '#fbbf24' }}>
              최고 레벨 달성! 👑
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
