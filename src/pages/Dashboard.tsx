import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Progress from '../components/ui/Progress'
import Button from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { useCourseList } from '../hooks/useCourse'
import { calculateProgress } from '../lib/utils'
import { getCourseTheme } from '../lib/courseThemes'
import LevelProgress from '../components/gamification/LevelProgress'
import AchievementBadge, { getBadgesForProgress, BADGES } from '../components/gamification/AchievementBadge'
import StreakTracker from '../components/gamification/StreakTracker'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { completedSections, quizScores, fetchProgress, loading } = useProgressStore()
  const courses = useCourseList()

  useEffect(() => { if (user) fetchProgress(user.id) }, [user, fetchProgress])

  if (!user) return <Navigate to="/login" replace />

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
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

  const courseStats = courses.map(course => {
    const totalSections = course.chapters.reduce((s, ch) => s + ch.sections.length, 0)
    const completed = course.chapters.reduce((s, ch) => s + ch.sections.filter(sec => completedSections.has(sec.id)).length, 0)
    const isCompleted = totalSections > 0 && completed === totalSections
    const sectionIds = course.chapters.flatMap(ch => ch.sections.map(s => s.id))
    const courseScores = sectionIds.map(id => quizScores.get(id)).filter((s): s is number => s !== undefined)
    const avgScore = courseScores.length > 0 ? Math.round(courseScores.reduce((a, b) => a + b, 0) / courseScores.length) : null
    const totalQuizzes = course.chapters.reduce((s, ch) => s + ch.sections.reduce((ss, sec) => ss + (sec.quizzes?.length || 0), 0), 0)
    return { ...course, totalSections, completed, progress: calculateProgress(completed, totalSections), isCompleted, avgScore, totalQuizzes, quizzesTaken: courseScores.length }
  })

  const inProgress = courseStats.filter(c => c.completed > 0 && !c.isCompleted)
  const completedCourses = courseStats.filter(c => c.isCompleted)
  const notStarted = courseStats.filter(c => c.completed === 0)

  const totalCompleted = courseStats.reduce((s, c) => s + c.completed, 0)
  const totalSections = courseStats.reduce((s, c) => s + c.totalSections, 0)
  const overallProgress = totalSections > 0 ? Math.round((totalCompleted / totalSections) * 100) : 0
  const allScores = Array.from(quizScores.values())
  const overallAvgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null

  // Study streak (simplified: days with activity)
  // const studyDays = completedSections.size > 0 ? Math.min(completedSections.size, 30) : 0

  // Gamification data
  const earnedBadges = getBadgesForProgress(completedSections, quizScores)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="main">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">안녕하세요, {user.name || '학습자'}님!</h1>
            <p className="text-gray-500">학습 현황을 한눈에 확인하세요.</p>
          </div>
          <Link to="/transcript">
            <Button variant="outline">성적표 보기</Button>
          </Link>
        </div>
        <div className="mt-4">
          <StreakTracker />
        </div>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card className="p-5 text-center border-2 border-transparent hover:border-primary/20 transition-colors">
          <div className="text-4xl font-extrabold text-primary">{overallProgress}%</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">전체 진행률</div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2" role="progressbar" aria-valuenow={overallProgress} aria-valuemin={0} aria-valuemax={100} aria-label="전체 진행률">
            <div className="bg-primary rounded-full h-2 transition-all duration-700" style={{ width: `${overallProgress}%` }} />
          </div>
        </Card>
        <Card className="p-5 text-center border-2 border-transparent hover:border-accent/20 transition-colors">
          <div className="text-4xl font-extrabold text-accent">{completedCourses.length}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">완료한 코스</div>
          <div className="mt-3 text-lg">{'🏆'.repeat(Math.min(completedCourses.length, 5)) || '—'}</div>
        </Card>
        <Card className="p-5 text-center border-2 border-transparent hover:border-blue-200 transition-colors">
          <div className="text-4xl font-extrabold text-blue-600">{totalCompleted}<span className="text-lg text-gray-400">/{totalSections}</span></div>
          <div className="text-xs text-gray-500 mt-1 font-medium">완료한 섹션</div>
        </Card>
        <Card className="p-5 text-center border-2 border-transparent hover:border-purple-200 transition-colors">
          <div className="text-4xl font-extrabold text-purple-600">{overallAvgScore !== null ? `${overallAvgScore}점` : '—'}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">평균 퀴즈 점수</div>
          {overallAvgScore !== null && (
            <div className="mt-2 text-sm">
              {overallAvgScore >= 80 ? '🌟 우수' : overallAvgScore >= 60 ? '👍 양호' : '💪 노력 중'}
            </div>
          )}
        </Card>
      </div>

      {/* Level Progress */}
      <div className="mb-10">
        <LevelProgress totalCompleted={totalCompleted} />
      </div>

      {/* Achievement Badges */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>🏅</span> 획득한 배지
        </h2>
        <Card className="p-6">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {BADGES.map(badge => (
              <AchievementBadge
                key={badge.id}
                badgeId={badge.id}
                earned={earnedBadges.includes(badge.id)}
                size="md"
              />
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-primary">{earnedBadges.length}</span> / {BADGES.length} 배지 획득
            </p>
          </div>
        </Card>
      </section>

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏆</span> 완료한 코스
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedCourses.map(c => {
              const theme = getCourseTheme(c.slug)
              return (
                <Card key={c.slug} className="p-0 overflow-hidden">
                  <div className="h-2" style={{ backgroundColor: theme.hex }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-lg">{c.title}</h3>
                      <span className="text-accent text-sm font-bold bg-accent/10 px-3 py-1 rounded-full">✓ 완료</span>
                    </div>
                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                      <span>{c.totalSections}개 섹션</span>
                      {c.avgScore !== null && <span>평균 {c.avgScore}점</span>}
                    </div>
                    <Progress value={c.completed} max={c.totalSections} size="md" showLabel className="mb-4" />
                    <div className="flex gap-2 flex-wrap">
                      <Link to={`/courses/${c.slug}`}><Button size="sm" variant="outline">다시 보기</Button></Link>
                      <Link to={`/certificate/${c.slug}`}><Button size="sm">수료증 보기</Button></Link>
                      {c.chapters.length > 0 && (
                        <Link to={`/essay/${c.slug}/${c.chapters[0].id}`}><Button size="sm" variant="outline">에세이 작성</Button></Link>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📚</span> 진행 중인 코스
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgress.map(c => {
              const theme = getCourseTheme(c.slug)
              return (
                <Card key={c.slug} className="p-0 overflow-hidden">
                  <div className="h-2" style={{ backgroundColor: theme.hex }} />
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{c.title}</h3>
                    <div className="flex items-center gap-6 mb-3 text-sm text-gray-500">
                      <span>{c.completed}/{c.totalSections} 섹션</span>
                      {c.avgScore !== null && <span>평균 {c.avgScore}점</span>}
                    </div>
                    <Progress value={c.completed} max={c.totalSections} size="md" showLabel className="mb-4" />
                    {/* Chapter-level progress */}
                    <div className="space-y-2 mb-4">
                      {c.chapters.map((ch, ci) => {
                        const chDone = ch.sections.filter(s => completedSections.has(s.id)).length
                        const chTotal = ch.sections.length
                        return (
                          <div key={ch.id} className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 w-6">{ci + 1}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                              <div className="rounded-full h-1.5 transition-all" style={{ width: `${(chDone / chTotal) * 100}%`, backgroundColor: theme.hex }} />
                            </div>
                            <span className="text-xs text-gray-400 w-10 text-right">{chDone}/{chTotal}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Link to={`/courses/${c.slug}`}><Button size="sm">이어서 학습하기</Button></Link>
                      {c.chapters.length > 0 && (
                        <Link to={`/essay/${c.slug}/${c.chapters[0].id}`}><Button size="sm" variant="outline">에세이 작성</Button></Link>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Not Started */}
      {notStarted.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🆕</span> 아직 시작하지 않은 코스
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notStarted.map(c => {
              const theme = getCourseTheme(c.slug)
              return (
                <Card key={c.slug} className="p-0 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-2" style={{ backgroundColor: theme.hex }} />
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{c.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span>{c.chapters.length}개 챕터</span>
                      <span>{c.totalSections}개 섹션</span>
                      <span>{c.totalQuizzes}개 퀴즈</span>
                    </div>
                    <Link to={`/courses/${c.slug}`}><Button size="sm" variant="outline">시작하기</Button></Link>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
