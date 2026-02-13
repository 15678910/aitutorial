import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import { useAuthStore } from '../store/authStore'
import { useAdminStats, type AdminUser } from '../hooks/useAdmin'
import { coursesData } from '../content/courses'
import { loadCourse } from '../content/courses'
import { getCourseTheme } from '../lib/courseThemes'

type Tab = 'overview' | 'users' | 'content'

interface CourseContentStats {
  slug: string
  title: string
  icon: string
  difficulty: string
  chapters: number
  sections: number
  quizzes: number
  learners: number
  completedSections: number
}

export default function Admin() {
  const { user } = useAuthStore()
  const { stats, loading, refetch } = useAdminStats()
  const [tab, setTab] = useState<Tab>('overview')
  const [search, setSearch] = useState('')
  const [contentStats, setContentStats] = useState<CourseContentStats[]>([])
  const [contentLoading, setContentLoading] = useState(false)

  // 콘텐츠 탭 선택 시 코스 데이터 로드
  useEffect(() => {
    if (tab === 'content' && contentStats.length === 0) {
      loadContentStats()
    }
  }, [tab])

  async function loadContentStats() {
    setContentLoading(true)
    try {
      const results: CourseContentStats[] = []
      for (const meta of coursesData) {
        const course = await loadCourse(meta.slug)
        if (course) {
          const sections = course.chapters.reduce((s, ch) => s + ch.sections.length, 0)
          const quizzes = course.chapters.reduce((s, ch) => s + ch.sections.reduce((ss, sec) => ss + (sec.quizzes?.length || 0), 0), 0)
          const courseData = stats?.courseStats.get(meta.slug)
          results.push({
            slug: meta.slug,
            title: course.title,
            icon: (course as any).icon || '📖',
            difficulty: course.difficulty,
            chapters: course.chapters.length,
            sections,
            quizzes,
            learners: courseData?.learners || 0,
            completedSections: courseData?.completedSections || 0,
          })
        }
      }
      setContentStats(results)
    } catch (error) {
      console.error('Failed to load content stats:', error)
    } finally {
      setContentLoading(false)
    }
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

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
      </div>
    )
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: '통계 개요', icon: '📊' },
    { key: 'users', label: '사용자 관리', icon: '👥' },
    { key: 'content', label: '콘텐츠 현황', icon: '📚' },
  ]

  const filteredUsers = stats?.users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  ) || []

  const difficultyLabel = (d: string) => d === 'beginner' ? '입문' : d === 'intermediate' ? '중급' : '고급'
  const difficultyColor = (d: string) => d === 'beginner' ? 'bg-green-50 text-green-700' : d === 'intermediate' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">🛡️ 관리자 대시보드</h1>
            <p className="text-gray-500">플랫폼 현황을 한눈에 확인하고 관리합니다.</p>
          </div>
          <button onClick={refetch} className="text-sm text-gray-500 hover:text-primary border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary transition-colors">
            🔄 새로고침
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* 탭 1: 통계 개요 */}
      {tab === 'overview' && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard value={stats.totalUsers} label="총 학습자" icon="👤" color="text-primary" />
            <StatCard value={stats.totalCompletedSections} label="완료된 섹션" icon="✅" color="text-green-600" />
            <StatCard value={stats.averageQuizScore !== null ? `${stats.averageQuizScore}점` : '—'} label="평균 퀴즈 점수" icon="📝" color="text-blue-600" />
            <StatCard value={stats.totalDiscussions} label="총 토론 수" icon="💬" color="text-purple-600" />
            <StatCard value={stats.totalEssays} label="총 에세이 수" icon="✍️" color="text-orange-600" />
          </div>

          {/* 코스별 학습 현황 */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">코스별 학습 현황</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">코스</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">학습자</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">완료 섹션</th>
                  </tr>
                </thead>
                <tbody>
                  {coursesData.map(course => {
                    const data = stats.courseStats.get(course.slug)
                    const theme = getCourseTheme(course.slug)
                    return (
                      <tr key={course.slug} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.hex }} />
                            <span className="font-medium text-gray-900">{course.title}</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-2 text-gray-600">{data?.learners || 0}명</td>
                        <td className="text-center py-3 px-2 text-gray-600">{data?.completedSections || 0}개</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 최근 가입 사용자 */}
          <Card className="p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">최근 가입 사용자</h2>
            <div className="space-y-3">
              {stats.users.slice(0, 5).map(u => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      {(u.name || u.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{u.name || '이름 없음'}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{formatDate(u.createdAt)}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* 탭 2: 사용자 관리 */}
      {tab === 'users' && stats && (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="이름 또는 이메일로 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">사용자</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">역할</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">가입일</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">완료 섹션</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">평균 점수</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">마지막 활동</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <UserRow key={u.id} user={u} formatDate={formatDate} />
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        {search ? '검색 결과가 없습니다.' : '등록된 사용자가 없습니다.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-4 text-sm text-gray-400 text-right">
            총 {filteredUsers.length}명 {search && `(전체 ${stats.users.length}명 중)`}
          </div>
        </>
      )}

      {/* 탭 3: 콘텐츠 현황 */}
      {tab === 'content' && (
        <>
          {contentLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* 전체 요약 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard value={contentStats.length} label="총 코스" icon="📚" color="text-primary" />
                <StatCard value={contentStats.reduce((s, c) => s + c.chapters, 0)} label="총 챕터" icon="📖" color="text-blue-600" />
                <StatCard value={contentStats.reduce((s, c) => s + c.sections, 0)} label="총 섹션" icon="📄" color="text-green-600" />
                <StatCard value={contentStats.reduce((s, c) => s + c.quizzes, 0)} label="총 퀴즈" icon="❓" color="text-purple-600" />
              </div>

              {/* 코스별 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentStats.map(course => {
                  const theme = getCourseTheme(course.slug)
                  return (
                    <Card key={course.slug} className="p-0 overflow-hidden">
                      <div className="h-2" style={{ backgroundColor: theme.hex }} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{course.icon}</span>
                            <h3 className="font-bold text-gray-900">{course.title}</h3>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor(course.difficulty)}`}>
                            {difficultyLabel(course.difficulty)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-gray-900">{course.chapters}</div>
                            <div className="text-xs text-gray-500">챕터</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-gray-900">{course.sections}</div>
                            <div className="text-xs text-gray-500">섹션</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-gray-900">{course.quizzes}</div>
                            <div className="text-xs text-gray-500">퀴즈</div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                          <span>👤 학습자 {course.learners}명</span>
                          <span>✅ 완료 {course.completedSections}개 섹션</span>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

// 통계 카드 컴포넌트
function StatCard({ value, label, icon, color }: { value: string | number; label: string; icon: string; color: string }) {
  return (
    <Card className="p-5 text-center border-2 border-transparent hover:border-gray-100 transition-colors">
      <div className="text-xs text-gray-400 mb-1">{icon}</div>
      <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
    </Card>
  )
}

// 사용자 행 컴포넌트
function UserRow({ user, formatDate }: { user: AdminUser; formatDate: (d: string | null) => string }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs shrink-0">
            {(user.name || user.email)[0].toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">{user.name || '이름 없음'}</div>
            <div className="text-xs text-gray-400">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="text-center py-3 px-4">
        <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
          {user.role === 'admin' ? '관리자' : '사용자'}
        </span>
      </td>
      <td className="text-center py-3 px-4 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
      <td className="text-center py-3 px-4">
        <span className="font-medium text-gray-900">{user.completedSections}</span>
        <span className="text-gray-400 text-xs">개</span>
      </td>
      <td className="text-center py-3 px-4">
        {user.avgQuizScore !== null ? (
          <span className={`font-medium ${user.avgQuizScore >= 80 ? 'text-green-600' : user.avgQuizScore >= 60 ? 'text-blue-600' : 'text-orange-600'}`}>
            {user.avgQuizScore}점
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>
      <td className="text-center py-3 px-4 text-gray-500 text-xs">{formatDate(user.lastActivity)}</td>
    </tr>
  )
}
