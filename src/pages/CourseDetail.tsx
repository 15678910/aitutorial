import { useParams, Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useCourseBySlug } from '../hooks/useCourse'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { getCourseTheme } from '../lib/courseThemes'
import ChapterIllustration from '../components/illustrations/ChapterIllustrations'
import { cn } from '../lib/utils'
import { CERT_MIN_COMPLETION_RATE, CERT_MIN_QUIZ_SCORE } from '../lib/constants'

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const course = useCourseBySlug(slug || '')
  const { user } = useAuthStore()
  const { completedSections, quizScores } = useProgressStore()

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">코스를 찾을 수 없습니다</h1>
        <Link to="/courses"><Button>코스 목록으로</Button></Link>
      </div>
    )
  }

  const theme = getCourseTheme(course.slug)
  const totalSections = course.chapters.reduce((s, ch) => s + ch.sections.length, 0)
  const completedCount = course.chapters.reduce((s, ch) => s + ch.sections.filter(sec => completedSections.has(sec.id)).length, 0)

  // Calculate completion criteria
  const completionRate = totalSections > 0 ? (completedCount / totalSections) * 100 : 0
  const allQuizScores = course.chapters.flatMap(ch =>
    ch.sections.map(sec => quizScores.get(sec.id)).filter((s): s is number => s !== undefined)
  )
  const avgQuizScore = allQuizScores.length > 0
    ? Math.round(allQuizScores.reduce((a, b) => a + b, 0) / allQuizScores.length)
    : 0
  const meetsCompletionCriteria = completionRate >= CERT_MIN_COMPLETION_RATE && avgQuizScore >= CERT_MIN_QUIZ_SCORE

  const firstSection = course.chapters[0]?.sections[0]
  const startUrl = firstSection ? `/learn/${course.slug}/${course.chapters[0].slug}/${firstSection.slug}` : '#'

  return (
    <div role="main">
      {/* Hero Banner with course theme color */}
      <div className={`${theme.bg} py-16 md:py-20`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm opacity-80">
            <Link to="/courses" className={`${theme.text} hover:underline font-medium`}>코스 목록</Link>
            <span className={theme.text}>→</span>
            <span className={`${theme.text} font-bold`}>{course.title}</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Course Info */}
            <div className="flex-1">
              <h1 className={`text-4xl md:text-5xl font-extrabold ${theme.text} mb-5 leading-tight`}>
                {course.title}
              </h1>
              <p className={`text-lg md:text-xl ${theme.text} opacity-90 mb-8 leading-relaxed max-w-xl`}>
                {course.description}
              </p>

              {user && completedCount > 0 && (
                <div className="mb-6">
                  <div className={`${theme.text} text-sm font-medium mb-2 opacity-80`}>
                    진행률: {completedCount}/{totalSections} 섹션 완료 ({Math.round(completionRate)}%)
                  </div>
                  <div className="w-full max-w-sm bg-white/20 rounded-full h-3" role="progressbar" aria-valuenow={Math.round(completionRate)} aria-valuemin={0} aria-valuemax={100} aria-label={`코스 진행률 ${Math.round(completionRate)}%`}>
                    <div
                      className="bg-white rounded-full h-3 transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  {allQuizScores.length > 0 && (
                    <div className={`${theme.text} text-sm font-medium mt-3 opacity-80`} aria-label={`평균 퀴즈 점수 ${avgQuizScore}%`}>
                      평균 퀴즈 점수: {avgQuizScore}%
                    </div>
                  )}
                </div>
              )}

              {user && meetsCompletionCriteria && (
                <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between max-w-md">
                  <span className={`${theme.text} font-bold text-lg`}>🎉 코스 완료!</span>
                  <button
                    onClick={() => navigate(`/certificate/${course.slug}`)}
                    className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors"
                  >
                    수료증 받기
                  </button>
                </div>
              )}

              {user && completedCount > 0 && !meetsCompletionCriteria && (
                <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-4 mb-6 max-w-md">
                  <div className={`${theme.text} font-bold text-sm mb-3`}>수료 조건</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>{completionRate >= CERT_MIN_COMPLETION_RATE ? '✅' : '❌'}</span>
                      <span className={theme.text}>섹션 진행률 {CERT_MIN_COMPLETION_RATE}% 이상 (현재: {Math.round(completionRate)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{avgQuizScore >= CERT_MIN_QUIZ_SCORE ? '✅' : '❌'}</span>
                      <span className={theme.text}>평균 퀴즈 점수 {CERT_MIN_QUIZ_SCORE}% 이상 (현재: {avgQuizScore}%)</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => user ? navigate(startUrl) : navigate('/login')}
                className="bg-white text-gray-900 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
              >
                {completedCount > 0 ? '이어서 학습하기 →' : '학습 시작하기 →'}
              </button>
            </div>

            {/* Course Illustration */}
            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
              <ChapterIllustration courseSlug={course.slug} chapterIndex={0} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Cards Grid - Elements of AI style */}
      <div className="bg-primary py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {course.chapters.map((chapter, idx) => {
              const chCompleted = chapter.sections.filter(s => completedSections.has(s.id)).length
              const allDone = chCompleted === chapter.sections.length && chapter.sections.length > 0
              return (
                <div key={chapter.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {/* Chapter Illustration with colored background */}
                  <div
                    className="h-48 flex items-center justify-center p-6"
                    style={{ backgroundColor: theme.hex + '22' }}
                  >
                    <ChapterIllustration
                      courseSlug={course.slug}
                      chapterIndex={idx}
                      className="w-40 h-40"
                    />
                  </div>

                  {/* Chapter Content */}
                  <div className="p-6">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Chapter {idx + 1}
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-4">
                      {chapter.title}
                    </h3>

                    {/* Section List */}
                    <div className="space-y-0">
                      <div className="flex items-center justify-between text-xs text-gray-400 font-medium pb-2 border-b border-gray-100">
                        <span>Section</span>
                        <span>Exercises</span>
                      </div>
                      {chapter.sections.map((section, sIdx) => {
                        const sectionCompleted = completedSections.has(section.id)
                        const quizCount = section.quizzes?.length || 0
                        const sectionUrl = `/learn/${course.slug}/${chapter.slug}/${section.slug}`

                        return (
                          <Link
                            key={section.id}
                            to={user ? sectionUrl : '/login'}
                            className="flex items-center justify-between py-3 border-b border-gray-50 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                          >
                            <span className={cn(
                              'text-sm font-medium',
                              sectionCompleted ? 'text-gray-400 line-through' : 'text-primary hover:text-accent'
                            )}>
                              {String.fromCharCode(8544 + sIdx)}. {section.title}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {quizCount > 0 ? (
                                Array.from({ length: Math.min(quizCount, 4) }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      'w-4 h-4 rounded-full border-2',
                                      sectionCompleted ? 'bg-accent border-accent' : 'border-gray-300'
                                    )}
                                  />
                                ))
                              ) : (
                                <span className="text-xs text-gray-300">---</span>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>

                    {allDone && (
                      <div className="mt-4 text-center">
                        <span className="text-accent font-bold text-sm">✅ 완료!</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
