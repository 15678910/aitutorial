import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'ai-learning-progress'
const QUIZ_STORAGE_KEY = 'ai-learning-quiz-scores'
const QUIZ_ATTEMPTS_KEY = 'ai-learning-quiz-attempts'

// localStorage helpers
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

interface ProgressState {
  completedSections: Set<string>
  quizScores: Map<string, number>
  quizAttempts: Map<string, number>
  loading: boolean
  fetchProgress: (userId: string) => Promise<void>
  markComplete: (userId: string, sectionId: string) => Promise<void>
  saveQuizScore: (userId: string, sectionId: string, score: number) => Promise<boolean>
  getQuizAttempts: (sectionId: string) => number
  resetQuizAttempts: (sectionId: string) => void
  loadLocalProgress: () => void
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedSections: new Set(loadFromStorage<string[]>(STORAGE_KEY, [])),
  quizScores: new Map(Object.entries(loadFromStorage<Record<string, number>>(QUIZ_STORAGE_KEY, {}))),
  quizAttempts: new Map(Object.entries(loadFromStorage<Record<string, number>>(QUIZ_ATTEMPTS_KEY, {}))),
  loading: false,

  loadLocalProgress: () => {
    const sections = loadFromStorage<string[]>(STORAGE_KEY, [])
    const scores = loadFromStorage<Record<string, number>>(QUIZ_STORAGE_KEY, {})
    const attempts = loadFromStorage<Record<string, number>>(QUIZ_ATTEMPTS_KEY, {})
    set({
      completedSections: new Set(sections),
      quizScores: new Map(Object.entries(scores)),
      quizAttempts: new Map(Object.entries(attempts)),
    })
  },

  fetchProgress: async (userId: string) => {
    set({ loading: true })
    try {
      const { data } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
      if (data && data.length > 0) {
        // Merge DB data with local data
        const localSections = loadFromStorage<string[]>(STORAGE_KEY, [])
        const localScores = loadFromStorage<Record<string, number>>(QUIZ_STORAGE_KEY, {})

        const dbSections = data.filter(p => p.completed).map(p => p.section_id)
        const dbScores = Object.fromEntries(
          data.filter(p => p.quiz_score != null).map(p => [p.section_id, p.quiz_score as number])
        )

        // Merge: union of both sources
        const mergedSections = [...new Set([...localSections, ...dbSections])]
        const mergedScores = { ...localScores, ...dbScores }

        saveToStorage(STORAGE_KEY, mergedSections)
        saveToStorage(QUIZ_STORAGE_KEY, mergedScores)

        set({
          completedSections: new Set(mergedSections),
          quizScores: new Map(Object.entries(mergedScores)),
        })
      }
    } catch {
      // DB not available - use localStorage data (already loaded in initial state)
    } finally {
      set({ loading: false })
    }
  },

  markComplete: async (userId: string, sectionId: string) => {
    const updated = new Set(get().completedSections)
    updated.add(sectionId)
    set({ completedSections: updated })

    // Always save to localStorage
    saveToStorage(STORAGE_KEY, [...updated])

    // Try to sync with Supabase
    try {
      await supabase.from('progress').upsert({
        user_id: userId,
        section_id: sectionId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,section_id' })
    } catch {
      // DB sync failed, but localStorage has the data
    }
  },

  saveQuizScore: async (userId: string, sectionId: string, score: number) => {
    const currentAttempts = get().quizAttempts.get(sectionId) || 0
    const currentScore = get().quizScores.get(sectionId) || 0

    // Check max attempts (3)
    if (currentAttempts >= 3) {
      return false
    }

    // Increment attempt count
    const updatedAttempts = new Map(get().quizAttempts)
    updatedAttempts.set(sectionId, currentAttempts + 1)

    // Only update score if new score is higher
    const updatedScores = new Map(get().quizScores)
    if (score > currentScore) {
      updatedScores.set(sectionId, score)
    }

    set({
      quizScores: updatedScores,
      quizAttempts: updatedAttempts
    })

    // Always save to localStorage
    saveToStorage(QUIZ_STORAGE_KEY, Object.fromEntries(updatedScores))
    saveToStorage(QUIZ_ATTEMPTS_KEY, Object.fromEntries(updatedAttempts))

    // Try to sync with Supabase
    try {
      await supabase.from('progress').upsert({
        user_id: userId,
        section_id: sectionId,
        quiz_score: score > currentScore ? score : currentScore,
        quiz_attempts: currentAttempts + 1,
      }, { onConflict: 'user_id,section_id' })
    } catch {
      // DB sync failed, but localStorage has the data
    }

    return true
  },

  getQuizAttempts: (sectionId: string) => {
    return get().quizAttempts.get(sectionId) || 0
  },

  resetQuizAttempts: (sectionId: string) => {
    const updatedAttempts = new Map(get().quizAttempts)
    updatedAttempts.delete(sectionId)
    const updatedScores = new Map(get().quizScores)
    updatedScores.delete(sectionId)
    set({
      quizAttempts: updatedAttempts,
      quizScores: updatedScores,
    })
    saveToStorage(QUIZ_ATTEMPTS_KEY, Object.fromEntries(updatedAttempts))
    saveToStorage(QUIZ_STORAGE_KEY, Object.fromEntries(updatedScores))
  },
}))
