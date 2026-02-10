import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Progress from '../components/ui/Progress'
import Button from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useCourseList } from '../hooks/useCourse'
import { calculateProgress } from '../lib/utils'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { completedSections, fetchProgress } = useProgressStore()
  const courses = useCourseList()

  useEffect(() => { if (user) fetchProgress(user.id) }, [user, fetchProgress])

  if (!user) return <Navigate to="/login" replace />

  const courseStats = courses.map(course => {
    const totalSections = course.chapters.reduce((s, ch) => s + ch.sections.length, 0)
    const completed = course.chapters.reduce((s, ch) => s + ch.sections.filter(sec => completedSections.has(sec.id)).length, 0)
    const isCompleted = totalSections > 0 && completed === totalSections
    return { ...course, totalSections, completed, progress: calculateProgress(completed, totalSections), isCompleted }
  })

  const inProgress = courseStats.filter(c => c.completed > 0 && c.completed < c.totalSections)
  const completedCourses = courseStats.filter(c => c.isCompleted)
  const notStarted = courseStats.filter(c => c.completed === 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">안녕하세요, {user.name || '학습자'}님!</h1>
      <p className="text-gray-600 mb-8">학습 현황을 확인하세요.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Card className="p-6 text-center"><div className="text-3xl font-bold text-accent">{completedCourses.length}</div><div className="text-sm text-gray-600 mt-1">완료한 코스</div></Card>
        <Card className="p-6 text-center"><div className="text-3xl font-bold text-primary">{inProgress.length}</div><div className="text-sm text-gray-600 mt-1">진행 중</div></Card>
        <Card className="p-6 text-center"><div className="text-3xl font-bold text-gray-400">{courseStats.reduce((s, c) => s + c.completed, 0)}</div><div className="text-sm text-gray-600 mt-1">완료한 섹션</div></Card>
      </div>
      {completedCourses.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">완료한 코스</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedCourses.map(c => (
              <Card key={c.slug} className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{c.title}</h3>
                  <span className="text-accent text-sm font-medium">✓ 완료</span>
                </div>
                <Progress value={c.completed} max={c.totalSections} size="md" showLabel className="mb-4" />
                <div className="flex gap-2">
                  <Link to={`/courses/${c.slug}`}><Button size="sm" variant="outline">다시 보기</Button></Link>
                  <Link to={`/certificate/${c.slug}`}><Button size="sm">수료증 보기</Button></Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
      {inProgress.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">진행 중인 코스</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgress.map(c => (
              <Card key={c.slug} className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
                <Progress value={c.completed} max={c.totalSections} size="md" showLabel className="mb-4" />
                <Link to={`/courses/${c.slug}`}><Button size="sm">이어서 학습하기</Button></Link>
              </Card>
            ))}
          </div>
        </section>
      )}
      {notStarted.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">아직 시작하지 않은 코스</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notStarted.map(c => (
              <Card key={c.slug} className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{c.description}</p>
                <Link to={`/courses/${c.slug}`}><Button size="sm" variant="outline">시작하기</Button></Link>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
