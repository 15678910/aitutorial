import { useState } from 'react'
import { cn } from '../../lib/utils'
import type { Quiz } from '../../types'

interface FillBlankProps {
  quiz: Quiz
  selectedAnswer?: string
  onAnswer: (answer: string) => void
  isSubmitted: boolean
}

export default function FillBlank({ quiz, selectedAnswer, onAnswer, isSubmitted }: FillBlankProps) {
  const [inputValue, setInputValue] = useState(selectedAnswer || '')
  const handleChange = (value: string) => { setInputValue(value); onAnswer(value) }
  const isCorrect = selectedAnswer?.trim().toLowerCase() === quiz.correctAnswer.trim().toLowerCase()

  return (
    <div>
      <input type="text" value={inputValue} onChange={(e) => handleChange(e.target.value)} disabled={isSubmitted}
        placeholder="답을 입력하세요..."
        className={cn('w-full px-4 py-3 rounded-lg border-2 text-lg transition-colors focus:outline-none',
          isSubmitted && isCorrect && 'border-green-400 bg-green-50',
          isSubmitted && !isCorrect && 'border-red-400 bg-red-50',
          !isSubmitted && 'border-gray-200 focus:border-accent')} />
      {isSubmitted && !isCorrect && (
        <p className="mt-2 text-sm text-gray-600">정답: <span className="font-semibold text-accent">{quiz.correctAnswer}</span></p>
      )}
    </div>
  )
}
