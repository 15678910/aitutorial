import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface ProgressState {
  completedSections: Set<string>
  quizScores: Map<string, number>
  loading: boolean
  fetchProgress: (userId: string) => Promise<void>
  markComplete: (userId: string, sectionId: string) => Promise<void>
  saveQuizScore: (userId: string, sectionId: string, score: number) => Promise<void>
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedSections: new Set(),
  quizScores: new Map(),
  loading: false,

  fetchProgress: async (userId: string) => {
    set({ loading: true })
    try {
      const { data } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
      if (data) {
        const completed = new Set(data.filter(p => p.completed).map(p => p.section_id))
        const scores = new Map(data.filter(p => p.quiz_score != null).map(p => [p.section_id, p.quiz_score as number]))
        set({ completedSections: completed, quizScores: scores })
      }
    } catch {
      // DB not available
    } finally {
      set({ loading: false })
    }
  },

  markComplete: async (userId: string, sectionId: string) => {
    try {
      await supabase.from('progress').upsert({
        user_id: userId,
        section_id: sectionId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,section_id' })
      const updated = new Set(get().completedSections)
      updated.add(sectionId)
      set({ completedSections: updated })
    } catch {
      // DB not available - still update local state
      const updated = new Set(get().completedSections)
      updated.add(sectionId)
      set({ completedSections: updated })
    }
  },

  saveQuizScore: async (userId: string, sectionId: string, score: number) => {
    try {
      await supabase.from('progress').upsert({
        user_id: userId,
        section_id: sectionId,
        quiz_score: score,
        quiz_attempts: 1,
      }, { onConflict: 'user_id,section_id' })
      const updated = new Map(get().quizScores)
      updated.set(sectionId, score)
      set({ quizScores: updated })
    } catch {
      const updated = new Map(get().quizScores)
      updated.set(sectionId, score)
      set({ quizScores: updated })
    }
  },
}))
