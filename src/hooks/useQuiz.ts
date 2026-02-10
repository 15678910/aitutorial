import { useState, useCallback } from 'react'
import type { Quiz } from '../types'

export function useQuiz(quizzes: Quiz[]) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<number, string>>(new Map())
  const [isComplete, setIsComplete] = useState(false)

  const currentQuiz = quizzes[currentIndex]
  const isLastQuiz = currentIndex === quizzes.length - 1

  const answer = useCallback((value: string) => {
    setAnswers(prev => {
      const next = new Map(prev)
      next.set(currentIndex, value)
      return next
    })
  }, [currentIndex])

  const next = useCallback(() => {
    if (isLastQuiz) {
      setIsComplete(true)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }, [isLastQuiz])

  const score = useCallback(() => {
    let correct = 0
    quizzes.forEach((quiz, idx) => {
      if (answers.get(idx) === quiz.correctAnswer) correct++
    })
    return Math.round((correct / quizzes.length) * 100)
  }, [quizzes, answers])

  const reset = useCallback(() => {
    setCurrentIndex(0)
    setAnswers(new Map())
    setIsComplete(false)
  }, [])

  return { currentQuiz, currentIndex, isLastQuiz, isComplete, selectedAnswer: answers.get(currentIndex), answer, next, score, reset }
}
