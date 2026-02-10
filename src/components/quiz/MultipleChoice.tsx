import { cn } from '../../lib/utils'
import type { Quiz } from '../../types'

interface MultipleChoiceProps {
  quiz: Quiz
  selectedAnswer?: string
  onAnswer: (answer: string) => void
  isSubmitted: boolean
}

export default function MultipleChoice({ quiz, selectedAnswer, onAnswer, isSubmitted }: MultipleChoiceProps) {
  const options = quiz.options || []

  return (
    <div className="space-y-3">
      {options.map((option, idx) => {
        const isSelected = selectedAnswer === option
        const isCorrect = option === quiz.correctAnswer
        const letter = String.fromCharCode(65 + idx)

        let borderColor = 'border-gray-200 hover:border-gray-300'
        let bgColor = 'bg-white'
        if (isSubmitted && isCorrect) { borderColor = 'border-green-400'; bgColor = 'bg-green-50' }
        else if (isSubmitted && isSelected && !isCorrect) { borderColor = 'border-red-400'; bgColor = 'bg-red-50' }
        else if (isSelected) { borderColor = 'border-accent'; bgColor = 'bg-accent/5' }

        return (
          <button
            key={idx}
            onClick={() => !isSubmitted && onAnswer(option)}
            disabled={isSubmitted}
            className={cn('w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all', borderColor, bgColor, !isSubmitted && 'cursor-pointer')}
          >
            <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 border-2', isSelected ? 'bg-accent border-accent text-white' : 'border-gray-300 text-gray-500')}>{letter}</span>
            <span className="text-gray-800">{option}</span>
          </button>
        )
      })}
    </div>
  )
}
