import { useState } from 'react'
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

export default function QuizContainer({ quizzes, onComplete }: QuizContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<number, string>>(new Map())
  const [showResults, setShowResults] = useState(false)
  const [submitted, setSubmitted] = useState<Set<number>>(new Set())

  const currentQuiz = quizzes[currentIndex]
  const isLastQuiz = currentIndex === quizzes.length - 1

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
      const correctCount = quizzes.reduce((count, quiz, idx) => count + (answers.get(idx) === quiz.correctAnswer ? 1 : 0), 0)
      const score = Math.round((correctCount / quizzes.length) * 100)
      setShowResults(true)
      onComplete(score)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (showResults) {
    const correctCount = quizzes.reduce((count, quiz, idx) => count + (answers.get(idx) === quiz.correctAnswer ? 1 : 0), 0)
    return <QuizResult correct={correctCount} total={quizzes.length} />
  }

  const isSubmitted = submitted.has(currentIndex)
  const selectedAnswer = answers.get(currentIndex)
  const isCorrect = selectedAnswer === currentQuiz.correctAnswer

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
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">퀴즈 {currentIndex + 1} / {quizzes.length}</span>
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
