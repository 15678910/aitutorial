import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PeerReview from '../components/essay/PeerReview'
import Button from '../components/ui/Button'
import { useCourseBySlug } from '../hooks/useCourse'
import { useAuthStore } from '../store/authStore'
import { useEssayStore, type Essay } from '../hooks/useEssay'
import { getCourseTheme } from '../lib/courseThemes'

export default function Review() {
  const { courseSlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const course = useCourseBySlug(courseSlug || '')
  const { fetchEssaysToReview, submitReview } = useEssayStore()
  const [essaysToReview, setEssaysToReview] = useState<Essay[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [allReviewsComplete, setAllReviewsComplete] = useState(false)

  useEffect(() => {
    if (user && course) {
      loadEssays()
    }
  }, [user, course])

  const loadEssays = async () => {
    if (!user || !course) return
    setLoading(true)
    try {
      const essays = await fetchEssaysToReview(user.id, course.id)
      setEssaysToReview(essays)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <Navigate to="/login" replace />
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 text-6xl">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">코스를 찾을 수 없습니다</h1>
          <Button onClick={() => navigate(-1)} variant="outline">뒤로 가기</Button>
        </div>
      </div>
    )
  }

  const theme = getCourseTheme(course.slug)
  const currentEssay = essaysToReview[currentIndex]

  const handleSubmitReview = async (clarity: number, accuracy: number, depth: number, feedback: string) => {
    if (!user || !currentEssay) return

    await submitReview(currentEssay.id, user.id, clarity, accuracy, depth, feedback)

    const newReviewedCount = reviewedCount + 1
    setReviewedCount(newReviewedCount)

    if (currentIndex < essaysToReview.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setAllReviewsComplete(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      {/* Top Navigation Bar */}
      <header className={`${theme.bg} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AI</span>
                </div>
                <span className={`text-lg font-bold ${theme.text}`}>AI 학습</span>
              </Link>
            </div>
            <nav className={`flex items-center gap-2 text-sm ${theme.text}`}>
              <Link to={`/courses/${courseSlug}`} className="opacity-70 hover:opacity-100 hover:underline transition-opacity">
                {course.title}
              </Link>
              <span className="opacity-50">{'>'}</span>
              <span className="font-bold">Peer Review</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className={`${theme.bg}`}>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className={`text-3xl md:text-4xl font-extrabold ${theme.text} leading-tight`}>
            동료 평가
          </h1>
          <p className={`mt-3 text-lg ${theme.text} opacity-80`}>
            다른 학습자들의 에세이를 평가해주세요
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[#faf8f5]">
        <div className="max-w-[800px] mx-auto px-6 md:px-8 py-12 md:py-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-500">에세이를 불러오는 중...</p>
            </div>
          ) : allReviewsComplete || essaysToReview.length === 0 ? (
            <div className="text-center">
              <div className="mb-8 p-8 bg-green-50 border-2 border-green-200 rounded-2xl">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-green-900 mb-3">
                  {essaysToReview.length === 0 ? '리뷰할 에세이가 없습니다' : `${reviewedCount}개의 리뷰를 완료했습니다!`}
                </h2>
                <p className="text-green-800 mb-6">
                  {essaysToReview.length === 0
                    ? '현재 리뷰할 수 있는 에세이가 없습니다. 나중에 다시 확인해주세요.'
                    : '감사합니다! 여러분의 피드백이 다른 학습자들에게 큰 도움이 됩니다.'}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => navigate(`/courses/${courseSlug}`)}>
                    코스 목록으로
                  </Button>
                  <Button onClick={() => navigate(-1)} variant="outline">
                    뒤로 가기
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Progress indicator */}
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    리뷰 진행상황
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {reviewedCount} / {essaysToReview.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(reviewedCount / essaysToReview.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current essay review */}
              {currentEssay && (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    에세이 {currentIndex + 1} / {essaysToReview.length}
                  </div>
                  <PeerReview
                    essay={currentEssay}
                    onSubmit={handleSubmitReview}
                  />
                </>
              )}

              {/* Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button onClick={() => navigate(`/courses/${courseSlug}`)} variant="outline">
                  코스 목록으로
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
