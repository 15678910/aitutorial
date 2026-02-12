import { useEffect, useState } from 'react'
import { useEssayStore, type PeerReview } from '../../hooks/useEssay'

interface EssayResultProps {
  essayId: string
}

export default function EssayResult({ essayId }: EssayResultProps) {
  const [reviews, setReviews] = useState<PeerReview[]>([])
  const { essays, fetchReviewsForEssay } = useEssayStore()

  const essay = Array.from(essays.values()).find(e => e.id === essayId)

  useEffect(() => {
    const loadReviews = async () => {
      const fetchedReviews = await fetchReviewsForEssay(essayId)
      setReviews(fetchedReviews)
    }
    loadReviews()
  }, [essayId, fetchReviewsForEssay])

  if (!essay) {
    return (
      <div className="bg-surface border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-500">에세이를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const calculateAverages = () => {
    if (reviews.length === 0) return null

    const totalClarity = reviews.reduce((sum, r) => sum + r.clarityScore, 0)
    const totalAccuracy = reviews.reduce((sum, r) => sum + r.accuracyScore, 0)
    const totalDepth = reviews.reduce((sum, r) => sum + r.depthScore, 0)

    const avgClarity = totalClarity / reviews.length
    const avgAccuracy = totalAccuracy / reviews.length
    const avgDepth = totalDepth / reviews.length
    const overall = (avgClarity + avgAccuracy + avgDepth) / 3

    return {
      clarity: avgClarity,
      accuracy: avgAccuracy,
      depth: avgDepth,
      overall,
    }
  }

  const averages = calculateAverages()
  const isPassed = averages && averages.overall >= 3.0

  const renderStars = (score: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= Math.round(score) ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-surface border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">에세이 평가 결과</h3>

      {/* Essay Content */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-2">문제:</p>
        <p className="text-gray-900 mb-4">{essay.prompt}</p>
        <p className="text-sm font-medium text-gray-700 mb-2">제출한 답변:</p>
        <p className="text-gray-900 whitespace-pre-wrap">{essay.content}</p>
      </div>

      {/* Reviews Status */}
      {reviews.length === 0 ? (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-center">
          <p className="text-sm text-blue-900">
            아직 리뷰가 없습니다. 다른 학습자들의 평가를 기다리고 있습니다.
          </p>
        </div>
      ) : (
        <>
          {/* Overall Result */}
          {averages && (
            <div className={`mb-6 p-6 rounded-lg border-2 ${isPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">최종 결과</h4>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${isPassed ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {isPassed ? '✓ 합격' : '✗ 불합격'}
                </span>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {averages.overall.toFixed(2)}점
                </div>
                <p className="text-sm text-gray-600">
                  {reviews.length}명의 동료 학습자가 평가했습니다
                </p>
              </div>
              {!isPassed && (
                <p className="mt-4 text-sm text-red-700 text-center">
                  평균 3.0점 이상을 받아야 합격입니다. 에세이를 수정하여 다시 제출해주세요.
                </p>
              )}
            </div>
          )}

          {/* Score Breakdown */}
          {averages && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">항목별 평균 점수</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">명확성 (Clarity)</span>
                  <div className="flex items-center gap-2">
                    {renderStars(averages.clarity)}
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {averages.clarity.toFixed(1)}점
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">정확성 (Accuracy)</span>
                  <div className="flex items-center gap-2">
                    {renderStars(averages.accuracy)}
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {averages.accuracy.toFixed(1)}점
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">깊이 (Depth)</span>
                  <div className="flex items-center gap-2">
                    {renderStars(averages.depth)}
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {averages.depth.toFixed(1)}점
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Individual Reviews */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              받은 평가 ({reviews.length}개)
            </h4>
            <div className="space-y-3">
              {reviews.map((review, index) => {
                const reviewAvg = (review.clarityScore + review.accuracyScore + review.depthScore) / 3
                return (
                  <div key={review.id} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        평가자 #{index + 1} (익명)
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        평균 {reviewAvg.toFixed(1)}점
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-gray-600 mb-1">명확성</div>
                        <div className="font-semibold text-gray-900">{review.clarityScore}/5</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-gray-600 mb-1">정확성</div>
                        <div className="font-semibold text-gray-900">{review.accuracyScore}/5</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-gray-600 mb-1">깊이</div>
                        <div className="font-semibold text-gray-900">{review.depthScore}/5</div>
                      </div>
                    </div>
                    {review.feedback && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-700 italic">"{review.feedback}"</p>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleString('ko-KR')}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
