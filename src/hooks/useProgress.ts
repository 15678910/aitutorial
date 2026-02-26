import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'

export function useProgress() {
  const { user } = useAuthStore()
  const { completedSections, quizScores, fetchProgress, markComplete, saveQuizScore, getQuizAttempts } = useProgressStore()

  useEffect(() => {
    if (user) {
      fetchProgress(user.id)
    }
  }, [user, fetchProgress])

  const userId = user?.id || 'local'

  return {
    completedSections,
    quizScores,
    getQuizAttempts,
    markComplete: (sectionId: string) => markComplete(userId, sectionId),
    saveQuizScore: (sectionId: string, score: number) => saveQuizScore(userId, sectionId, score),
  }
}
