import { useParams, Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import CertificateComponent from '../components/certificate/Certificate'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useCourseBySlug } from '../hooks/useCourse'

export default function Certificate() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const { user } = useAuthStore()
  const { completedSections, quizScores, fetchProgress } = useProgressStore()
  const course = useCourseBySlug(courseSlug || '')

  useEffect(() => {
    if (user) fetchProgress(user.id)
  }, [user, fetchProgress])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">코스를 찾을 수 없습니다</h1>
        <Link to="/courses">
          <Button>코스 목록으로</Button>
        </Link>
      </div>
    )
  }

  const totalSections = course.chapters.reduce((sum, ch) => sum + ch.sections.length, 0)
  const completedCount = course.chapters.reduce(
    (sum, ch) => sum + ch.sections.filter(sec => completedSections.has(sec.id)).length,
    0
  )

  // Calculate completion criteria
  const completionRate = totalSections > 0 ? (completedCount / totalSections) * 100 : 0
  const allQuizScores = course.chapters.flatMap(ch =>
    ch.sections.map(sec => quizScores.get(sec.id)).filter((s): s is number => s !== undefined)
  )
  const avgQuizScore = allQuizScores.length > 0
    ? Math.round(allQuizScores.reduce((a, b) => a + b, 0) / allQuizScores.length)
    : 0
  const meetsCompletionCriteria = completionRate >= 90 && avgQuizScore >= 50
  const remainingSections = totalSections - completedCount

  if (!meetsCompletionCriteria) {
    const meetsProgressRequirement = completionRate >= 90
    const meetsQuizRequirement = avgQuizScore >= 50

    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">수료증을 받을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">
            수료 조건을 충족해야 수료증을 받을 수 있습니다.
          </p>

          <div className="mb-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold text-gray-700">섹션 진행률</div>
                <span className="text-2xl">{meetsProgressRequirement ? '✅' : '❌'}</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {Math.round(completionRate)}%
              </div>
              <div className="text-sm text-gray-600">
                필요: 90% 이상 ({completedCount}/{totalSections} 섹션 완료)
              </div>
              {!meetsProgressRequirement && (
                <div className="text-xs text-red-600 mt-2">
                  {remainingSections}개 섹션 더 완료하세요
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold text-gray-700">평균 퀴즈 점수</div>
                <span className="text-2xl">{meetsQuizRequirement ? '✅' : '❌'}</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {avgQuizScore}%
              </div>
              <div className="text-sm text-gray-600">
                필요: 50% 이상
              </div>
              {allQuizScores.length === 0 && (
                <div className="text-xs text-orange-600 mt-2">
                  퀴즈를 풀지 않았습니다
                </div>
              )}
              {!meetsQuizRequirement && allQuizScores.length > 0 && (
                <div className="text-xs text-red-600 mt-2">
                  평균 점수를 {50 - avgQuizScore}% 올려야 합니다
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link to={`/courses/${course.slug}`}>
              <Button>코스로 돌아가기</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">대시보드로 돌아가기</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const completionDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div>
      <CertificateComponent
        courseName={course.title}
        userName={user.name || user.email}
        completionDate={completionDate}
        courseId={course.id}
      />

      <div className="text-center pb-8 no-print">
        <Link to="/dashboard">
          <Button variant="outline">대시보드로 돌아가기</Button>
        </Link>
      </div>
    </div>
  )
}
