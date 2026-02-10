import { cn } from '../../lib/utils'
import type { Quiz } from '../../types'

interface TrueFalseProps {
  quiz: Quiz
  selectedAnswer?: string
  onAnswer: (answer: string) => void
  isSubmitted: boolean
}

export default function TrueFalse({ quiz, selectedAnswer, onAnswer, isSubmitted }: TrueFalseProps) {
  const options = quiz.options || ['참', '거짓']

  return (
    <div className="flex gap-4">
      {options.map((option) => {
        const isSelected = selectedAnswer === option
        const isCorrect = option === quiz.correctAnswer
        let style = 'border-gray-200 hover:border-gray-300 bg-white'
        if (isSubmitted && isCorrect) style = 'border-green-400 bg-green-50'
        else if (isSubmitted && isSelected && !isCorrect) style = 'border-red-400 bg-red-50'
        else if (isSelected) style = 'border-accent bg-accent/5'

        return (
          <button key={option} onClick={() => !isSubmitted && onAnswer(option)} disabled={isSubmitted}
            className={cn('flex-1 py-4 px-6 rounded-lg border-2 text-center font-semibold text-lg transition-all', style, !isSubmitted && 'cursor-pointer')}>
            {option}
          </button>
        )
      })}
    </div>
  )
}
