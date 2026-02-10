import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'

export function useProgress() {
  const { user } = useAuthStore()
  const { completedSections, quizScores, fetchProgress, markComplete, saveQuizScore } = useProgressStore()

  useEffect(() => {
    if (user) {
      fetchProgress(user.id)
    }
  }, [user, fetchProgress])

  return {
    completedSections,
    quizScores,
    markComplete: (sectionId: string) => { if (user) markComplete(user.id, sectionId) },
    saveQuizScore: (sectionId: string, score: number) => { if (user) saveQuizScore(user.id, sectionId, score) },
  }
}
