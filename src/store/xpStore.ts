import { create } from 'zustand'

const STORAGE_KEY = 'ai-learning-xp'

// localStorage helpers (same pattern as progressStore)
function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
  } catch { /* ignore */ }
  return defaultVal
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded, ignore */ }
}

// ─── Level definitions ────────────────────────────────────────────────────────

export interface LevelDef {
  level: number
  title: string
  xpRequired: number
  emoji: string
}

export const LEVELS: LevelDef[] = [
  { level: 1,  title: 'AI 새싹',   xpRequired: 0,    emoji: '🌱' },
  { level: 2,  title: 'AI 탐험가', xpRequired: 50,   emoji: '🔍' },
  { level: 3,  title: 'AI 학습자', xpRequired: 150,  emoji: '📚' },
  { level: 4,  title: 'AI 도전자', xpRequired: 350,  emoji: '💪' },
  { level: 5,  title: 'AI 실험가', xpRequired: 600,  emoji: '🧪' },
  { level: 6,  title: 'AI 개발자', xpRequired: 1000, emoji: '💻' },
  { level: 7,  title: 'AI 전문가', xpRequired: 1500, emoji: '🎓' },
  { level: 8,  title: 'AI 마스터', xpRequired: 2200, emoji: '🏆' },
  { level: 9,  title: 'AI 리더',   xpRequired: 3000, emoji: '⭐' },
  { level: 10, title: 'AI 레전드', xpRequired: 4000, emoji: '👑' },
]

// ─── Helper: derive level info from total XP ─────────────────────────────────

export function getLevelForXP(xp: number): { level: number; title: string; emoji: string } {
  let current = LEVELS[0]
  for (const def of LEVELS) {
    if (xp >= def.xpRequired) {
      current = def
    } else {
      break
    }
  }
  return { level: current.level, title: current.title, emoji: current.emoji }
}

function computeLevelState(totalXP: number) {
  const { level, title, emoji } = getLevelForXP(totalXP)

  const currentDef = LEVELS[level - 1]
  const nextDef = LEVELS[level] // undefined if max level

  const currentLevelXP = totalXP - currentDef.xpRequired
  const nextLevelXP = nextDef ? nextDef.xpRequired - currentDef.xpRequired : 0
  const xpToNextLevel = nextDef ? nextDef.xpRequired - totalXP : 0

  return { level, levelTitle: title, levelEmoji: emoji, currentLevelXP, nextLevelXP, xpToNextLevel }
}

// ─── Persisted shape (plain objects for JSON serialisation) ──────────────────

interface XPPersisted {
  totalXP: number
  recentXPGains: Array<{ amount: number; reason: string; timestamp: number }>
  lastDailyBonus: string | null
}

function loadPersisted(): XPPersisted {
  return loadFromStorage<XPPersisted>(STORAGE_KEY, {
    totalXP: 0,
    recentXPGains: [],
    lastDailyBonus: null,
  })
}

// ─── Store interface ──────────────────────────────────────────────────────────

export interface XPStore {
  totalXP: number
  level: number
  levelTitle: string
  levelEmoji: string
  /** XP still needed to reach the next level */
  xpToNextLevel: number
  /** XP earned since the start of the current level */
  currentLevelXP: number
  /** Total XP gap that constitutes the current level (i.e. next.xpRequired - current.xpRequired) */
  nextLevelXP: number
  /** Last 5 XP gain events */
  recentXPGains: Array<{ amount: number; reason: string; timestamp: number }>
  /** ISO date string (YYYY-MM-DD) of the last daily bonus, or null */
  lastDailyBonus: string | null

  // Actions
  addXP: (amount: number, reason: string) => void
  /** Returns true when the bonus was granted (first action of the day) */
  checkDailyBonus: () => boolean
  /** 0-100 progress percentage within the current level */
  getProgressPercent: () => number
}

// ─── Store implementation ─────────────────────────────────────────────────────

const persisted = loadPersisted()
const initialLevelState = computeLevelState(persisted.totalXP)

export const useXPStore = create<XPStore>((set, get) => ({
  totalXP: persisted.totalXP,
  ...initialLevelState,
  recentXPGains: persisted.recentXPGains,
  lastDailyBonus: persisted.lastDailyBonus,

  addXP: (amount: number, reason: string) => {
    const newTotal = get().totalXP + amount
    const levelState = computeLevelState(newTotal)

    const gain = { amount, reason, timestamp: Date.now() }
    const recentXPGains = [gain, ...get().recentXPGains].slice(0, 5)

    set({ totalXP: newTotal, ...levelState, recentXPGains })

    saveToStorage(STORAGE_KEY, {
      totalXP: newTotal,
      recentXPGains,
      lastDailyBonus: get().lastDailyBonus,
    } satisfies XPPersisted)
  },

  checkDailyBonus: () => {
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    if (get().lastDailyBonus === today) return false

    // Grant +5 XP daily bonus
    const newTotal = get().totalXP + 5
    const levelState = computeLevelState(newTotal)

    const gain = { amount: 5, reason: '일일 첫 접속 보너스', timestamp: Date.now() }
    const recentXPGains = [gain, ...get().recentXPGains].slice(0, 5)

    set({ totalXP: newTotal, ...levelState, recentXPGains, lastDailyBonus: today })

    saveToStorage(STORAGE_KEY, {
      totalXP: newTotal,
      recentXPGains,
      lastDailyBonus: today,
    } satisfies XPPersisted)

    return true
  },

  getProgressPercent: () => {
    const { currentLevelXP, nextLevelXP, level } = get()
    // Max level: show 100%
    if (level >= LEVELS.length) return 100
    if (nextLevelXP === 0) return 100
    return Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100))
  },
}))
