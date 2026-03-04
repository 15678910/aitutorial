import { useEffect, useRef, useState } from 'react'
import { useXPStore, LEVELS } from '../../store/xpStore'

// ─── Single Toast ──────────────────────────────────────────────────────────

export interface XPToastProps {
  amount: number
  reason: string
  onDismiss: () => void
}

interface ToastState {
  phase: 'entering' | 'visible' | 'exiting'
}

export function XPToast({ amount, reason, onDismiss }: XPToastProps) {
  const [state, setState] = useState<ToastState>({ phase: 'entering' })
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Read XP state for progress bar snapshot at mount time
  const { totalXP, currentLevelXP, nextLevelXP, level } = useXPStore()

  const currentDef = LEVELS[level - 1]
  const nextDef = LEVELS[level]

  // Progress percentage within current level (capped 0–100)
  const progressPct = nextLevelXP > 0
    ? Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100))
    : 100

  // XP before this gain (for visual "before" marker on the bar)
  const previousXP = Math.max(0, totalXP - amount)
  const prevLevelXP = previousXP - (currentDef?.xpRequired ?? 0)
  const prevProgressPct = nextLevelXP > 0
    ? Math.min(100, Math.round((prevLevelXP / nextLevelXP) * 100))
    : 100

  useEffect(() => {
    // After entrance animation completes, move to visible state
    const enterTimer = setTimeout(() => {
      setState({ phase: 'visible' })
    }, 450)

    // After 2.5s total, begin exit
    dismissTimerRef.current = setTimeout(() => {
      setState({ phase: 'exiting' })
      // After exit animation, call onDismiss
      exitTimerRef.current = setTimeout(onDismiss, 400)
    }, 2500)

    return () => {
      clearTimeout(enterTimer)
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [onDismiss])

  const animClass =
    state.phase === 'exiting' ? 'animate-xp-toast-out' : 'animate-xp-toast-in'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        ${animClass}
        relative w-64 rounded-2xl overflow-hidden
        shadow-[0_8px_32px_rgba(41,38,76,0.35)]
        mb-3 select-none pointer-events-auto
      `}
      style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)',
      }}
    >
      {/* Sheen layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative px-4 py-3">
        {/* Top row: star icon + XP amount + reason */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="animate-xp-star text-xl leading-none shrink-0"
              aria-hidden="true"
            >
              ⭐
            </span>
            <div className="min-w-0">
              <span className="block text-lg font-extrabold text-white leading-tight tracking-tight">
                +{amount} XP
              </span>
              <span className="block text-xs font-medium text-indigo-200 leading-tight truncate">
                {reason}
              </span>
            </div>
          </div>

          {/* Next level label */}
          {nextDef && (
            <span className="shrink-0 text-[10px] font-bold text-indigo-300 leading-tight whitespace-nowrap mt-0.5">
              {nextDef.emoji} Lv.{nextDef.level}까지
            </span>
          )}
        </div>

        {/* XP Progress bar */}
        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-semibold text-indigo-300">
              {currentDef?.title ?? 'AI 새싹'}
            </span>
            <span className="text-[10px] font-semibold text-indigo-300">
              {nextDef ? `${nextDef.title} →` : '최고 레벨!'}
            </span>
          </div>

          <div
            className="w-full rounded-full overflow-hidden"
            style={{
              height: '6px',
              background: 'rgba(255,255,255,0.15)',
            }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="레벨 진행도"
          >
            {/* Before-gain fill */}
            <div
              className="absolute top-0 left-0 rounded-full"
              style={{
                height: '6px',
                width: `${prevProgressPct}%`,
                background: 'rgba(255,255,255,0.3)',
                transition: 'width 0.6s ease-out',
              }}
            />
            {/* Current fill with shimmer */}
            <div
              className="absolute top-0 left-0 rounded-full animate-xp-bar-shimmer"
              style={{
                height: '6px',
                width: `${progressPct}%`,
                background:
                  'linear-gradient(90deg, #32c2a2, #5dd4b8, #32c2a2)',
                backgroundSize: '200% 100%',
                transition: 'width 0.6s ease-out 0.1s',
                boxShadow: '0 0 8px rgba(50,194,162,0.6)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom taper */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'rgba(255,255,255,0.1)' }}
        aria-hidden="true"
      />
    </div>
  )
}

// ─── Toast Manager ────────────────────────────────────────────────────────

interface ToastEntry {
  id: string
  amount: number
  reason: string
  timestamp: number
}

export function XPToastManager() {
  const recentXPGains = useXPStore(s => s.recentXPGains)
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const seenTimestampsRef = useRef<Set<number>>(new Set())

  // Sync new gains into local toast queue
  useEffect(() => {
    const newGains = recentXPGains.filter(
      g => !seenTimestampsRef.current.has(g.timestamp)
    )

    if (newGains.length === 0) return

    newGains.forEach(g => seenTimestampsRef.current.add(g.timestamp))

    setToasts(prev => [
      ...prev,
      ...newGains.map(g => ({
        id: `${g.timestamp}-${g.amount}`,
        amount: g.amount,
        reason: g.reason,
        timestamp: g.timestamp,
      })),
    ])
  }, [recentXPGains])

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex flex-col-reverse items-end pointer-events-none"
      aria-label="XP 획득 알림 영역"
    >
      {toasts.map(toast => (
        <XPToast
          key={toast.id}
          amount={toast.amount}
          reason={toast.reason}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  )
}

export default XPToast
