import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import SectionContent from '../components/course/SectionContent'
import InteractiveSection from '../components/course/InteractiveSection'
import QuizContainer from '../components/quiz/QuizContainer'
import DiscussionPanel from '../components/discussion/DiscussionPanel'
import Button from '../components/ui/Button'
import { useCourseBySlug } from '../hooks/useCourse'
import { useProgress } from '../hooks/useProgress'
import { useAuthStore } from '../store/authStore'
import { getCourseTheme } from '../lib/courseThemes'
import ChapterIllustration from '../components/illustrations/ChapterIllustrations'
import { cn } from '../lib/utils'

export default function Learn() {
  const { courseSlug, chapterSlug, sectionSlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const course = useCourseBySlug(courseSlug || '')
  const { completedSections, markComplete, saveQuizScore } = useProgress()
  const [showNav, setShowNav] = useState(false)

  const { currentSection, currentChapter, currentChapterIndex, prevSection, nextSection } = useMemo(() => {
    if (!course) return { currentSection: null, currentChapter: null, currentChapterIndex: 0, prevSection: null, nextSection: null }
    const allSections: { section: typeof course.chapters[0]['sections'][0]; chapter: typeof course.chapters[0]; chapterIdx: number }[] = []
    for (let ci = 0; ci < course.chapters.length; ci++) {
      const ch = course.chapters[ci]
      for (const sec of ch.sections) { allSections.push({ section: sec, chapter: ch, chapterIdx: ci }) }
    }
    const idx = allSections.findIndex(s => s.chapter.slug === chapterSlug && s.section.slug === sectionSlug)
    return {
      currentSection: idx >= 0 ? allSections[idx].section : null,
      currentChapter: idx >= 0 ? allSections[idx].chapter : null,
      currentChapterIndex: idx >= 0 ? allSections[idx].chapterIdx : 0,
      prevSection: idx > 0 ? allSections[idx - 1] : null,
      nextSection: idx < allSections.length - 1 ? allSections[idx + 1] : null,
    }
  }, [course, chapterSlug, sectionSlug])

  if (!user) return <Navigate to="/login" replace />
  if (!course || !currentSection || !currentChapter) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold text-gray-900 mb-4">콘텐츠를 찾을 수 없습니다</h1><Link to="/courses"><Button>코스 목록으로</Button></Link></div>
  }

  const theme = getCourseTheme(course.slug)
  const isCompleted = completedSections.has(currentSection.id)
  const handleComplete = () => { markComplete(currentSection.id) }
  const handleQuizComplete = (score: number) => { saveQuizScore(currentSection.id, score); if (score >= 60) markComplete(currentSection.id) }
  const navigateTo = (item: { section: { slug: string }; chapter: { slug: string } } | null) => {
    if (item) navigate(`/learn/${courseSlug}/${item.chapter.slug}/${item.section.slug}`)
  }

  // Find section index within chapter
  const sectionInChapter = currentChapter.sections.findIndex(s => s.slug === currentSection.slug) + 1

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      {/* Top Navigation Bar - Elements of AI style */}
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
            {/* Breadcrumb */}
            <nav className={`hidden md:flex items-center gap-2 text-sm ${theme.text}`}>
              <Link to={`/courses/${courseSlug}`} className="opacity-70 hover:opacity-100 hover:underline transition-opacity">
                Course overview
              </Link>
              <span className="opacity-50">{'>'}</span>
              <span className="opacity-70">{currentChapter.title}</span>
              <span className="opacity-50">{'>'}</span>
              <span className="font-bold">{currentSection.title}</span>
            </nav>
            {/* Menu button */}
            <button
              onClick={() => setShowNav(!showNav)}
              className={`${theme.text} font-medium flex items-center gap-2 hover:opacity-80 transition-opacity`}
            >
              <span className="text-sm">Menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={showNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Panel */}
      {showNav && (
        <div className="fixed inset-0 z-50" onClick={() => setShowNav(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{course.title}</h2>
                <button onClick={() => setShowNav(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {course.chapters.map((ch, ci) => (
                <div key={ch.id} className="mb-6">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Chapter {ci + 1}</div>
                  <h3 className="font-bold text-gray-900 mb-3">{ch.title}</h3>
                  <ul className="space-y-1">
                    {ch.sections.map((sec) => {
                      const isActive = chapterSlug === ch.slug && sectionSlug === sec.slug
                      const isDone = completedSections.has(sec.id)
                      return (
                        <li key={sec.id}>
                          <Link
                            to={`/learn/${courseSlug}/${ch.slug}/${sec.slug}`}
                            onClick={() => setShowNav(false)}
                            className={cn(
                              'block px-3 py-2 rounded-lg text-sm transition-colors',
                              isActive ? 'font-bold' : '',
                              isDone ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-50'
                            )}
                            style={isActive ? { backgroundColor: theme.hex + '15', color: theme.hex } : {}}
                          >
                            <span className="flex items-center gap-2">
                              {isDone && <span className="text-accent">✓</span>}
                              {sec.title}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner with Course Color + Illustration */}
      <div className={`${theme.bg}`}>
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center text-center">
          {/* Illustration */}
          <div className="w-52 h-52 md:w-64 md:h-64 mb-8">
            <ChapterIllustration courseSlug={course.slug} chapterIndex={currentChapterIndex} className="w-full h-full" />
          </div>
          {/* Section Number + Title */}
          <h1 className={`text-3xl md:text-[2.75rem] font-extrabold ${theme.text} leading-tight`}>
            <span className="opacity-60 mr-3">{String.fromCharCode(8544 + sectionInChapter - 1)}.</span>
            {currentSection.title}
          </h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[#faf8f5]">
        <div className="max-w-[720px] mx-auto px-6 md:px-8 py-12 md:py-16">
          {/* Section intro text if available */}
          {currentChapter.description && (
            <p className="text-lg text-gray-500 italic mb-10 leading-relaxed border-l-4 pl-5" style={{ borderColor: theme.hex + '40' }}>
              {currentChapter.description}
            </p>
          )}

          <SectionContent content={currentSection.content} quizzes={currentSection.quizzes} />
          <InteractiveSection sectionId={currentSection.id} />

          {currentSection.quizzes && currentSection.quizzes.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200 flex items-center gap-3">
                <span className="text-3xl">📝</span> 확인 퀴즈
              </h2>
              <QuizContainer quizzes={currentSection.quizzes} onComplete={handleQuizComplete} />
            </div>
          )}

          {(!currentSection.quizzes || currentSection.quizzes.length === 0) && !isCompleted && (
            <div className="mt-16 text-center">
              <button
                onClick={handleComplete}
                className="px-8 py-4 rounded-2xl text-lg font-bold text-white transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: theme.hex }}
              >
                학습 완료 ✓
              </button>
            </div>
          )}

          {isCompleted && (
            <div className="mt-16 text-center">
              <div
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold shadow-sm"
                style={{ backgroundColor: theme.hex + '15', color: theme.hex }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                이 섹션을 완료했습니다!
              </div>
            </div>
          )}

          <DiscussionPanel sectionId={currentSection.id} />

          {/* Navigation - prev/next */}
          <div className="mt-20 pt-10 border-t-2 border-gray-200 flex items-stretch justify-between gap-6">
            {prevSection ? (
              <button onClick={() => navigateTo(prevSection)} className="group flex items-center gap-4 text-left px-6 py-5 rounded-2xl hover:bg-white hover:shadow-md transition-all flex-1 max-w-[45%]">
                <span className="text-2xl text-gray-300 group-hover:text-gray-500 transition-colors">←</span>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">이전</div>
                  <div className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors leading-snug">{prevSection.section.title}</div>
                </div>
              </button>
            ) : <div />}
            {nextSection ? (
              <button
                onClick={() => navigateTo(nextSection)}
                className="group flex items-center gap-4 text-right px-6 py-5 rounded-2xl transition-all flex-1 max-w-[45%] ml-auto justify-end hover:shadow-md"
                style={{ backgroundColor: theme.hex + '08' }}
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: theme.hex }}>다음</div>
                  <div className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors leading-snug">{nextSection.section.title}</div>
                </div>
                <span className="text-2xl transition-colors" style={{ color: theme.hex + '60' }}>→</span>
              </button>
            ) : (
              <Link to={`/courses/${courseSlug}`} className="ml-auto">
                <button
                  className="px-6 py-3 rounded-xl text-sm font-bold border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: theme.hex, color: theme.hex }}
                >
                  코스 목록으로
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
