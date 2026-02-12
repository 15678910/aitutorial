import { useState } from 'react'
import type { Essay } from '../../hooks/useEssay'
import Button from '../ui/Button'

interface PeerReviewProps {
  essay: Essay
  onSubmit: (clarity: number, accuracy: number, depth: number, feedback: string) => Promise<void>
}

export default function PeerReview({ essay, onSubmit }: PeerReviewProps) {
  const [clarityScore, setClarityScore] = useState(3)
  const [accuracyScore, setAccuracyScore] = useState(3)
  const [depthScore, setDepthScore] = useState(3)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(clarityScore, accuracyScore, depthScore, feedback)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (score: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${star <= score ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  const renderSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    description: string
  ) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="block text-sm font-medium text-gray-900">{label}</label>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {renderStars(value)}
          <span className="text-sm font-semibold text-gray-700 w-8">{value}/5</span>
        </div>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        disabled={isSubmitting}
      />
    </div>
  )

  return (
    <div className="bg-surface border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">동료 평가</h3>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-2">문제:</p>
        <p className="text-gray-900 mb-4">{essay.prompt}</p>
        <p className="text-sm font-medium text-gray-700 mb-2">제출된 답변:</p>
        <p className="text-gray-900 whitespace-pre-wrap">{essay.content}</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm font-medium text-blue-900">평가 기준</p>
        <p className="text-xs text-gray-700 mt-1">
          각 항목을 1~5점으로 평가해주세요. 평균 3.0점 이상이면 합격입니다.
        </p>
      </div>

      {renderSlider(
        '명확성 (Clarity)',
        clarityScore,
        setClarityScore,
        '논리적 구조와 표현이 명확한가요?'
      )}

      {renderSlider(
        '정확성 (Accuracy)',
        accuracyScore,
        setAccuracyScore,
        '내용이 정확하고 사실에 기반하고 있나요?'
      )}

      {renderSlider(
        '깊이 (Depth)',
        depthScore,
        setDepthScore,
        '주제를 충분히 깊이 있게 다루고 있나요?'
      )}

      <div className="mb-6">
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-900 mb-2">
          피드백 (선택사항)
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="개선 사항이나 좋았던 점을 자유롭게 작성해주세요."
          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y text-sm"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          평균 점수: <span className="font-semibold text-gray-900">
            {((clarityScore + accuracyScore + depthScore) / 3).toFixed(1)}점
          </span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="md"
        >
          {isSubmitting ? '제출 중...' : '평가 제출'}
        </Button>
      </div>
    </div>
  )
}
