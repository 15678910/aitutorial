import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'ai-learning-progress'
const QUIZ_STORAGE_KEY = 'ai-learning-quiz-scores'

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
  loading: boolean
  fetchProgress: (userId: string) => Promise<void>
  markComplete: (userId: string, sectionId: string) => Promise<void>
  saveQuizScore: (userId: string, sectionId: string, score: number) => Promise<void>
  loadLocalProgress: () => void
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedSections: new Set(loadFromStorage<string[]>(STORAGE_KEY, [])),
  quizScores: new Map(Object.entries(loadFromStorage<Record<string, number>>(QUIZ_STORAGE_KEY, {}))),
  loading: false,

  loadLocalProgress: () => {
    const sections = loadFromStorage<string[]>(STORAGE_KEY, [])
    const scores = loadFromStorage<Record<string, number>>(QUIZ_STORAGE_KEY, {})
    set({
      completedSections: new Set(sections),
      quizScores: new Map(Object.entries(scores)),
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
    const updated = new Map(get().quizScores)
    updated.set(sectionId, score)
    set({ quizScores: updated })

    // Always save to localStorage
    saveToStorage(QUIZ_STORAGE_KEY, Object.fromEntries(updated))

    // Try to sync with Supabase
    try {
      await supabase.from('progress').upsert({
        user_id: userId,
        section_id: sectionId,
        quiz_score: score,
        quiz_attempts: 1,
      }, { onConflict: 'user_id,section_id' })
    } catch {
      // DB sync failed, but localStorage has the data
    }
  },
}))
