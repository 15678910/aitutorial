import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { useState } from 'react'
import EssaySubmit from '../components/essay/EssaySubmit'
import EssayResult from '../components/essay/EssayResult'
import Button from '../components/ui/Button'
import { useCourseBySlug } from '../hooks/useCourse'
import { useAuthStore } from '../store/authStore'
import { useEssayStore } from '../hooks/useEssay'
import { getCourseTheme } from '../lib/courseThemes'

export default function Essay() {
  const { courseSlug, chapterId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const course = useCourseBySlug(courseSlug || '')
  const { essays, getEssayStatus } = useEssayStore()
  const [submitted, setSubmitted] = useState(false)

  if (!user) return <Navigate to="/login" replace />
  if (!course || !chapterId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 text-6xl">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">에세이를 찾을 수 없습니다</h1>
          <p className="text-gray-500 mb-8">요청하신 에세이를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate(-1)} variant="outline">뒤로 가기</Button>
        </div>
      </div>
    )
  }

  // Find the chapter
  const chapter = course.chapters.find(ch => ch.id === chapterId)
  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 text-6xl">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">챕터를 찾을 수 없습니다</h1>
          <Button onClick={() => navigate(-1)} variant="outline">뒤로 가기</Button>
        </div>
      </div>
    )
  }

  // For demo purposes, we'll assume there's an essay prompt for the chapter
  const essayPrompt = `${chapter.title}에 대해 배운 내용을 정리하고, 실생활에 어떻게 적용할 수 있는지 설명하세요. (최소 200자 이상)`

  const theme = getCourseTheme(course.slug)
  const key = `${course.id}-${chapterId}`
  const essay = essays.get(key)
  const essayStatus = getEssayStatus(course.id, chapterId)

  const handleSubmit = () => {
    setSubmitted(true)
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
              <span className="font-bold">Essay</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className={`${theme.bg}`}>
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className={`text-3xl md:text-4xl font-extrabold ${theme.text} leading-tight`}>
            에세이 과제
          </h1>
          <p className={`mt-3 text-lg ${theme.text} opacity-80`}>
            {chapter.title}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[#faf8f5]">
        <div className="max-w-[800px] mx-auto px-6 md:px-8 py-12 md:py-16">
          {/* Status banner if submitted */}
          {submitted && essay && (
            <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
              <h3 className="text-lg font-bold text-green-900 mb-2">✓ 에세이가 제출되었습니다!</h3>
              <p className="text-green-800 mb-4">
                다른 학생들의 에세이를 리뷰해주세요. 3개의 리뷰를 완료하면 여러분의 에세이도 평가받을 수 있습니다.
              </p>
              <Link to={`/review/${courseSlug}`}>
                <Button size="sm">리뷰하러 가기 →</Button>
              </Link>
            </div>
          )}

          {/* Show essay result if reviews exist */}
          {essay && essayStatus !== 'not_submitted' && essayStatus !== 'needs_reviews' && (
            <div className="mb-8">
              <EssayResult essayId={essay.id} />
            </div>
          )}

          {/* Essay submission form */}
          {(!essay || essayStatus === 'failed') && (
            <EssaySubmit
              courseId={course.id}
              chapterId={chapterId}
              prompt={essayPrompt}
              onSubmit={handleSubmit}
            />
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Button onClick={() => navigate(`/courses/${courseSlug}`)} variant="outline">
              코스 목록으로
            </Button>
            {essay && essayStatus !== 'failed' && (
              <Link to={`/review/${courseSlug}`}>
                <Button>다른 에세이 리뷰하기 →</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
