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
  const { completedSections, fetchProgress } = useProgressStore()
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

  const isCompleted = totalSections > 0 && completedCount === totalSections
  const remainingSections = totalSections - completedCount

  if (!isCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">수료증을 받을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">
            코스를 완료해야 수료증을 받을 수 있습니다.
          </p>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">{remainingSections}</div>
            <div className="text-sm text-gray-600">남은 섹션</div>
            <div className="text-xs text-gray-500 mt-2">
              진행률: {completedCount} / {totalSections} ({Math.round((completedCount / totalSections) * 100)}%)
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
