import { useState, useMemo } from 'react'
import MultipleChoice from './MultipleChoice'
import TrueFalse from './TrueFalse'
import FillBlank from './FillBlank'
import QuizResult from './QuizResult'
import Button from '../ui/Button'
import type { Quiz } from '../../types'

interface QuizContainerProps {
  quizzes: Quiz[]
  onComplete: (score: number) => void
}

const difficultyConfig = {
  all: { label: '전체', color: 'bg-gray-100 text-gray-700', activeColor: 'bg-gray-800 text-white' },
  beginner: { label: '초급', color: 'bg-green-50 text-green-700', activeColor: 'bg-green-600 text-white' },
  intermediate: { label: '중급', color: 'bg-yellow-50 text-yellow-700', activeColor: 'bg-yellow-500 text-white' },
  advanced: { label: '고급', color: 'bg-red-50 text-red-700', activeColor: 'bg-red-600 text-white' },
}

export default function QuizContainer({ quizzes, onComplete }: QuizContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<number, string>>(new Map())
  const [showResults, setShowResults] = useState(false)
  const [submitted, setSubmitted] = useState<Set<number>>(new Set())
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const hasDifficulties = quizzes.some(q => q.difficulty)

  const filteredQuizzes = useMemo(() => {
    if (difficulty === 'all' || !hasDifficulties) return quizzes
    return quizzes.filter(q => q.difficulty === difficulty)
  }, [quizzes, difficulty, hasDifficulties])

  const currentQuiz = filteredQuizzes[currentIndex]
  const isLastQuiz = currentIndex === filteredQuizzes.length - 1

  const handleAnswer = (answer: string) => {
    const newAnswers = new Map(answers)
    newAnswers.set(currentIndex, answer)
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    const newSubmitted = new Set(submitted)
    newSubmitted.add(currentIndex)
    setSubmitted(newSubmitted)
  }

  const handleNext = () => {
    if (isLastQuiz) {
      const correctCount = filteredQuizzes.reduce((count, quiz, idx) => count + (answers.get(idx) === quiz.correctAnswer ? 1 : 0), 0)
      const score = Math.round((correctCount / filteredQuizzes.length) * 100)
      setShowResults(true)
      onComplete(score)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleDifficultyChange = (d: typeof difficulty) => {
    setDifficulty(d)
    setCurrentIndex(0)
    setAnswers(new Map())
    setSubmitted(new Set())
    setShowResults(false)
  }

  if (filteredQuizzes.length === 0) {
    return (
      <div className="bg-surface border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-500">이 난이도의 퀴즈가 없습니다.</p>
        <button onClick={() => handleDifficultyChange('all')} className="mt-3 text-sm text-primary font-medium hover:underline">전체 보기</button>
      </div>
    )
  }

  if (showResults) {
    const correctCount = filteredQuizzes.reduce((count, quiz, idx) => count + (answers.get(idx) === quiz.correctAnswer ? 1 : 0), 0)
    return <QuizResult correct={correctCount} total={filteredQuizzes.length} />
  }

  const isSubmitted = submitted.has(currentIndex)
  const selectedAnswer = answers.get(currentIndex)
  const isCorrect = selectedAnswer === currentQuiz.correctAnswer
  const diffLabel = currentQuiz.difficulty ? difficultyConfig[currentQuiz.difficulty] : null

  const renderQuiz = () => {
    const props = { quiz: currentQuiz, selectedAnswer, onAnswer: handleAnswer, isSubmitted }
    switch (currentQuiz.type) {
      case 'true_false': return <TrueFalse {...props} />
      case 'fill_blank': return <FillBlank {...props} />
      default: return <MultipleChoice {...props} />
    }
  }

  return (
    <div className="bg-surface border border-gray-200 rounded-xl p-6">
      {/* Difficulty Filter Tabs */}
      {hasDifficulties && (
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-100">
          {(Object.keys(difficultyConfig) as Array<keyof typeof difficultyConfig>).map(d => (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                difficulty === d ? difficultyConfig[d].activeColor : difficultyConfig[d].color
              }`}
            >
              {difficultyConfig[d].label}
              {d !== 'all' && (
                <span className="ml-1.5 opacity-70">
                  ({quizzes.filter(q => q.difficulty === d).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">퀴즈 {currentIndex + 1} / {filteredQuizzes.length}</span>
        {diffLabel && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyConfig[currentQuiz.difficulty!].color}`}>
            {diffLabel.label}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentQuiz.question}</h3>
      {renderQuiz()}
      {isSubmitted && currentQuiz.explanation && (
        <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="font-medium mb-1">{isCorrect ? '\u2713 정답입니다!' : '\u2717 오답입니다'}</div>
          <p className="text-gray-700">{currentQuiz.explanation}</p>
        </div>
      )}
      <div className="mt-6 flex justify-end gap-3">
        {!isSubmitted ? (
          <Button onClick={handleSubmit} disabled={!selectedAnswer} size="sm">정답 확인</Button>
        ) : (
          <Button onClick={handleNext} size="sm">{isLastQuiz ? '결과 보기' : '다음 문제'}</Button>
        )}
      </div>
    </div>
  )
}
