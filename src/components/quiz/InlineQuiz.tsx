import { useState } from 'react'
import type { Quiz } from '../../types'

interface InlineQuizProps {
  quiz: Quiz
  onAnswer?: (correct: boolean) => void
}

export default function InlineQuiz({ quiz, onAnswer }: InlineQuizProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = selected === quiz.correctAnswer

  const handleSubmit = () => {
    if (!selected) return
    setSubmitted(true)
    onAnswer?.(selected === quiz.correctAnswer)
  }

  const diffColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  }
  const diffLabels = { beginner: '초급', intermediate: '중급', advanced: '고급' }

  const handleKeyDown = (e: React.KeyboardEvent, opt: string) => {
    if ((e.key === 'Enter' || e.key === ' ') && !submitted) {
      e.preventDefault()
      setSelected(opt)
    }
  }

  return (
    <div className="my-10 bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-sm" role="group" aria-labelledby="quiz-title">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" aria-hidden="true">🤔</span>
        <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">생각해보기</span>
        {quiz.difficulty && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diffColors[quiz.difficulty]}`}>
            {diffLabels[quiz.difficulty]}
          </span>
        )}
      </div>
      <h4 id="quiz-title" className="text-lg font-bold text-gray-900 mb-4">{quiz.question}</h4>

      {quiz.type === 'true_false' ? (
        <div className="flex gap-3" role="radiogroup" aria-labelledby="quiz-title">
          {['true', 'false'].map(opt => (
            <button
              key={opt}
              onClick={() => !submitted && setSelected(opt)}
              onKeyDown={(e) => handleKeyDown(e, opt)}
              disabled={submitted}
              role="radio"
              aria-checked={selected === opt}
              tabIndex={0}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                selected === opt
                  ? submitted
                    ? opt === quiz.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : submitted && opt === quiz.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {opt === 'true' ? '⭕ 맞다' : '❌ 틀리다'}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2" role="radiogroup" aria-labelledby="quiz-title">
          {quiz.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => !submitted && setSelected(opt)}
              onKeyDown={(e) => handleKeyDown(e, opt)}
              disabled={submitted}
              role="radio"
              aria-checked={selected === opt}
              tabIndex={0}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm border-2 transition-all ${
                selected === opt
                  ? submitted
                    ? opt === quiz.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-indigo-500 bg-indigo-50 text-indigo-700 font-bold'
                  : submitted && opt === quiz.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-bold text-gray-400 mr-2" aria-hidden="true">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      )}

      {!submitted && selected && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
        >
          정답 확인
        </button>
      )}

      {submitted && (
        <div className={`mt-4 p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`} aria-live="polite">
          <div className="flex items-center justify-between">
            <div className="font-bold mb-1">{isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다'}</div>
            <button
              onClick={() => { setSelected(null); setSubmitted(false) }}
              className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              다시 풀기
            </button>
          </div>
          <p className="text-gray-700">{quiz.explanation}</p>
        </div>
      )}
    </div>
  )
}
