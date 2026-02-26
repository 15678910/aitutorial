import { useState, useMemo } from 'react'
import MultipleChoice from './MultipleChoice'
import TrueFalse from './TrueFalse'
import FillBlank from './FillBlank'
import QuizResult from './QuizResult'
import Button from '../ui/Button'
import { useProgressStore } from '../../store/progressStore'
import type { Quiz } from '../../types'

// Normalize true/false answers: English "true"/"false" ↔ Korean "참"/"거짓"
function normalizeAnswer(answer: string | undefined): string {
  if (!answer) return ''
  const map: Record<string, string> = { 'true': '참', 'false': '거짓' }
  return map[answer.toLowerCase()] || answer
}

function isAnswerCorrect(userAnswer: string | undefined, correctAnswer: string): boolean {
  if (!userAnswer) return false
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer)
}

interface QuizContainerProps {
  quizzes: Quiz[]
  sectionId: string
  onComplete: (score: number) => void
}

const difficultyConfig = {
  all: { label: '전체', color: 'bg-gray-100 text-gray-700', activeColor: 'bg-gray-800 text-white' },
  beginner: { label: '초급', color: 'bg-green-50 text-green-700', activeColor: 'bg-green-600 text-white' },
  intermediate: { label: '중급', color: 'bg-yellow-50 text-yellow-700', activeColor: 'bg-yellow-500 text-white' },
  advanced: { label: '고급', color: 'bg-red-50 text-red-700', activeColor: 'bg-red-600 text-white' },
}

export default function QuizContainer({ quizzes, sectionId, onComplete }: QuizContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<number, string>>(new Map())
  const [showResults, setShowResults] = useState(false)
  const [submitted, setSubmitted] = useState<Set<number>>(new Set())
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const { getQuizAttempts, quizScores, resetQuizAttempts } = useProgressStore()
  const attemptCount = getQuizAttempts(sectionId)
  const currentScore = quizScores.get(sectionId) || 0
  const maxAttemptsReached = attemptCount >= 3

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
      const correctCount = filteredQuizzes.reduce((count, quiz, idx) => count + (isAnswerCorrect(answers.get(idx), quiz.correctAnswer) ? 1 : 0), 0)
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

  const handleKeyDown = (e: React.KeyboardEvent, d: typeof difficulty) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleDifficultyChange(d)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const keys = Object.keys(difficultyConfig) as Array<keyof typeof difficultyConfig>
      const currentIdx = keys.indexOf(difficulty)
      const nextIdx = e.key === 'ArrowRight'
        ? (currentIdx + 1) % keys.length
        : (currentIdx - 1 + keys.length) % keys.length
      handleDifficultyChange(keys[nextIdx])
    }
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
    const correctCount = filteredQuizzes.reduce((count, quiz, idx) => count + (isAnswerCorrect(answers.get(idx), quiz.correctAnswer) ? 1 : 0), 0)
    return <QuizResult correct={correctCount} total={filteredQuizzes.length} sectionId={sectionId} />
  }

  // If max attempts reached, show disabled state
  if (maxAttemptsReached) {
    return (
      <div className="bg-surface border border-gray-200 rounded-xl p-8 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100">
          <span className="text-3xl">{currentScore === 0 ? '🔄' : '🔒'}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {currentScore === 0 ? '퀴즈를 다시 풀어보세요!' : '최대 응시 횟수 도달'}
        </h3>
        <p className="text-gray-600 mb-2">
          {currentScore === 0
            ? '이전 오류로 인해 점수가 기록되지 않았습니다. 다시 도전해 보세요!'
            : '최대 응시 횟수(3회)에 도달했습니다.'}
        </p>
        {currentScore > 0 && (
          <div className="text-3xl font-bold mb-2" style={{ color: currentScore >= 60 ? '#32c2a2' : '#ef4444' }}>
            최고 점수: {currentScore}점
          </div>
        )}
        {currentScore === 0 ? (
          <button
            onClick={() => resetQuizAttempts(sectionId)}
            className="mt-4 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors"
          >
            다시 도전하기
          </button>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            {currentScore >= 60 ? '합격하셨습니다!' : '다음에 더 좋은 결과를 기대합니다.'}
          </p>
        )}
      </div>
    )
  }

  const isSubmitted = submitted.has(currentIndex)
  const selectedAnswer = answers.get(currentIndex)
  const isCorrect = isAnswerCorrect(selectedAnswer, currentQuiz.correctAnswer)
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
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-100" role="tablist" aria-label="퀴즈 난이도 선택">
          {(Object.keys(difficultyConfig) as Array<keyof typeof difficultyConfig>).map(d => (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              onKeyDown={(e) => handleKeyDown(e, d)}
              role="tab"
              aria-selected={difficulty === d}
              tabIndex={difficulty === d ? 0 : -1}
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
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">퀴즈 {currentIndex + 1} / {filteredQuizzes.length}</span>
          <span className="text-xs text-gray-400">시도 {attemptCount}/3회</span>
        </div>
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
