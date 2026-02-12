import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useCourseList } from '../hooks/useCourse'
import { getCourseTheme } from '../lib/courseThemes'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../lib/constants'

// Calculate letter grade from numeric score
function getLetterGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: 'A', color: 'text-green-600' }
  if (score >= 80) return { grade: 'B', color: 'text-blue-600' }
  if (score >= 70) return { grade: 'C', color: 'text-yellow-600' }
  if (score >= 60) return { grade: 'D', color: 'text-orange-600' }
  return { grade: 'F', color: 'text-red-600' }
}

export default function Transcript() {
  const { user } = useAuthStore()
  const { completedSections, quizScores, fetchProgress, loading } = useProgressStore()
  const courses = useCourseList()

  useEffect(() => {
    if (user) fetchProgress(user.id)
  }, [user, fetchProgress])

  if (!user) return <Navigate to="/login" replace />

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Calculate course stats
  const courseStats = courses.map(course => {
    const totalSections = course.chapters.reduce((s, ch) => s + ch.sections.length, 0)
    const completed = course.chapters.reduce(
      (s, ch) => s + ch.sections.filter(sec => completedSections.has(sec.id)).length,
      0
    )
    const completionRate = totalSections > 0 ? Math.round((completed / totalSections) * 100) : 0

    const sectionIds = course.chapters.flatMap(ch => ch.sections.map(s => s.id))
    const courseScores = sectionIds
      .map(id => quizScores.get(id))
      .filter((s): s is number => s !== undefined)
    const avgQuizScore = courseScores.length > 0
      ? Math.round(courseScores.reduce((a, b) => a + b, 0) / courseScores.length)
      : 0

    // Grade calculation: quiz avg * 0.7 + essay avg * 0.3
    // For now, essay is 0 (no essay system yet), so grade = quiz avg
    const overallScore = avgQuizScore // Will add essay component later
    const { grade, color } = getLetterGrade(overallScore)

    return {
      ...course,
      totalSections,
      completed,
      completionRate,
      avgQuizScore,
      quizzesTaken: courseScores.length,
      overallScore,
      grade,
      gradeColor: color,
    }
  })

  // Only include courses that have at least some progress
  const coursesWithProgress = courseStats.filter(c => c.completed > 0)

  // Summary stats
  const totalCoursesCompleted = courseStats.filter(c => c.completionRate === 100).length
  const allGrades = coursesWithProgress.filter(c => c.quizzesTaken > 0).map(c => c.overallScore)
  const gpa = allGrades.length > 0
    ? (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(2)
    : '0.00'
  const totalStudyHours = courseStats
    .filter(c => c.completionRate === 100)
    .reduce((sum, c) => sum + c.estimatedHours, 0)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">학습 성적표</h1>
        <p className="text-gray-500">전체 코스의 학습 성과를 확인하세요.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Card className="p-5 text-center border-2 border-transparent hover:border-primary/20 transition-colors">
          <div className="text-4xl font-extrabold text-primary">{totalCoursesCompleted}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">완료한 코스</div>
        </Card>
        <Card className="p-5 text-center border-2 border-transparent hover:border-blue-200 transition-colors">
          <div className="text-4xl font-extrabold text-blue-600">{gpa}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">평균 학점 (GPA)</div>
        </Card>
        <Card className="p-5 text-center border-2 border-transparent hover:border-purple-200 transition-colors">
          <div className="text-4xl font-extrabold text-purple-600">{totalStudyHours}h</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">총 학습 시간</div>
        </Card>
      </div>

      {/* Print Button */}
      <div className="mb-6 no-print">
        <Button onClick={handlePrint} size="lg">
          성적표 인쇄하기
        </Button>
      </div>

      {/* Course Grades */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> 코스별 성적
        </h2>
        {coursesWithProgress.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">아직 시작한 코스가 없습니다.</p>
            <Link to="/courses" className="inline-block mt-4">
              <Button>코스 둘러보기</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {coursesWithProgress.map(course => {
              const theme = getCourseTheme(course.slug)
              return (
                <Card key={course.slug} className="p-0 overflow-hidden">
                  <div className="h-2" style={{ backgroundColor: theme.hex }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-3">
                          {course.title}
                          <span className={`text-xs px-2 py-1 rounded ${DIFFICULTY_COLORS[course.difficulty]}`}>
                            {DIFFICULTY_LABELS[course.difficulty]}
                          </span>
                        </h3>
                      </div>
                      {course.quizzesTaken > 0 && (
                        <div className="text-center ml-4">
                          <div className={`text-4xl font-extrabold ${course.gradeColor}`}>
                            {course.grade}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">등급</div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">완료율</div>
                        <div className="text-lg font-bold text-gray-900">
                          {course.completionRate}%
                        </div>
                        <div className="text-xs text-gray-400">
                          {course.completed}/{course.totalSections} 섹션
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">퀴즈 평균</div>
                        <div className="text-lg font-bold text-gray-900">
                          {course.avgQuizScore > 0 ? `${course.avgQuizScore}점` : '—'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {course.quizzesTaken}개 완료
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">에세이</div>
                        <div className="text-lg font-bold text-gray-400">—</div>
                        <div className="text-xs text-gray-400">미제출</div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">종합 점수</div>
                        <div className="text-lg font-bold text-gray-900">
                          {course.overallScore > 0 ? `${course.overallScore}점` : '—'}
                        </div>
                        <div className="text-xs text-gray-400">100점 만점</div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Link to={`/courses/${course.slug}`}>
                        <Button size="sm" variant="outline">코스 보기</Button>
                      </Link>
                      {course.completionRate === 100 && course.avgQuizScore >= 60 && (
                        <Link to={`/certificate/${course.slug}`}>
                          <Button size="sm">수료증 보기</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 1cm;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
