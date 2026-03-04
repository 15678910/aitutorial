import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { coursesData } from '../content/courses'
import { getCourseTheme } from '../lib/courseThemes'
import { useProgressStore } from '../store/progressStore'
import { useAuthStore } from '../store/authStore'
import Button from '../components/ui/Button'
import Progress from '../components/ui/Progress'

// ---------------------------------------------------------------------------
// Data: Learning Paths
// ---------------------------------------------------------------------------

interface LearningPath {
  id: string
  title: string
  emoji: string
  target: string
  duration: string
  description: string
  goal: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisite?: string
  courseSlugs: string[]
  gradient: string
  bgLight: string
  accentHex: string
}

const learningPaths: LearningPath[] = [
  {
    id: 'ai-fundamentals',
    title: 'AI 기초 마스터',
    emoji: '\uD83E\uDDE0',
    target: 'AI 입문자, 비전공자',
    duration: '~8주',
    description: 'AI의 기본 개념부터 딥러닝, 생성형 AI까지 체계적으로 학습합니다.',
    goal: 'AI 개념 이해 + 간단한 모델 구현 가능',
    difficulty: 'beginner',
    courseSlugs: ['ai-intro', 'ml-basics', 'deep-learning', 'generative-ai', 'making-ai'],
    gradient: 'from-[#FF6B6B] via-[#7C5CFC] to-[#2EC4B6]',
    bgLight: 'bg-gradient-to-br from-red-50 via-purple-50 to-teal-50',
    accentHex: '#7C5CFC',
  },
  {
    id: 'claude-expert',
    title: 'Claude Code 전문가',
    emoji: '\uD83D\uDE80',
    target: '개발자, AI 도구 활용 원하는 직장인',
    duration: '~6주',
    description: 'Claude Code를 활용한 개발 생산성 극대화와 에이전트 개발을 마스터합니다.',
    goal: 'Claude를 활용한 생산성 극대화 + 에이전트 개발',
    difficulty: 'intermediate',
    courseSlugs: [
      'claude-code',
      'claude-code-intermediate',
      'claude-code-advanced',
      'claude-constitution',
      'claude-cowork',
      'agent-skills',
    ],
    gradient: 'from-[#D97757] via-[#3B82F6] to-[#F59E0B]',
    bgLight: 'bg-gradient-to-br from-orange-50 via-blue-50 to-amber-50',
    accentHex: '#3B82F6',
  },
  {
    id: 'ai-career',
    title: 'AI 실무 & 커리어',
    emoji: '\uD83C\uDFAF',
    target: '취업 준비생, 커리어 전환자',
    duration: '~10주',
    description: '실무 프로젝트와 포트폴리오 구축으로 AI 커리어를 준비합니다.',
    goal: '실무 스킬 + 포트폴리오 + 취업 준비 완성',
    difficulty: 'advanced',
    prerequisite: 'Path 1 (AI 기초 마스터) 수료 또는 동등 수준',
    courseSlugs: ['python-ml-practice', 'rag-vector-db', 'ai-business', 'ai-portfolio'],
    gradient: 'from-[#06B6D4] via-[#6366F1] to-[#EC4899]',
    bgLight: 'bg-gradient-to-br from-cyan-50 via-indigo-50 to-pink-50',
    accentHex: '#EC4899',
  },
]

// ---------------------------------------------------------------------------
// Persona data
// ---------------------------------------------------------------------------

interface Persona {
  emoji: string
  title: string
  description: string
  recommendedPathId: string
  tags: string[]
}

const personas: Persona[] = [
  {
    emoji: '\uD83C\uDF31',
    title: 'AI가 처음이에요',
    description: 'AI에 대해 들어봤지만 체계적으로 배운 적이 없어요. 기초부터 차근차근 배우고 싶어요.',
    recommendedPathId: 'ai-fundamentals',
    tags: ['비전공자', '입문자', '기초부터'],
  },
  {
    emoji: '\uD83D\uDCBB',
    title: '개발자인데 AI 도구를 쓰고 싶어요',
    description: '코딩은 할 줄 알지만, Claude 같은 AI 도구로 생산성을 높이고 싶어요.',
    recommendedPathId: 'claude-expert',
    tags: ['개발자', 'AI 도구', '생산성'],
  },
  {
    emoji: '\uD83C\uDFC6',
    title: 'AI로 취업/이직하고 싶어요',
    description: 'AI 분야로 커리어를 전환하거나, 포트폴리오를 만들어 취업 준비를 하고 싶어요.',
    recommendedPathId: 'ai-career',
    tags: ['취업', '포트폴리오', '커리어'],
  },
]

// ---------------------------------------------------------------------------
// Difficulty badge
// ---------------------------------------------------------------------------

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config: Record<string, { label: string; className: string }> = {
    beginner: { label: '입문', className: 'bg-green-100 text-green-700' },
    intermediate: { label: '중급', className: 'bg-yellow-100 text-yellow-700' },
    advanced: { label: '고급', className: 'bg-red-100 text-red-700' },
  }
  const c = config[difficulty] || config.beginner
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.className}`}>
      {c.label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Course card inside a path
// ---------------------------------------------------------------------------

function PathCourseCard({
  slug,
  index,
  isCompleted,
  isLast,
}: {
  slug: string
  index: number
  isCompleted: boolean
  isLast: boolean
}) {
  const course = coursesData.find((c) => c.slug === slug)
  if (!course) return null
  const theme = getCourseTheme(slug)

  return (
    <div className="flex items-stretch">
      {/* Left: step indicator + connector line */}
      <div className="flex flex-col items-center mr-4 flex-shrink-0">
        {/* Step circle */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border-2 transition-all duration-300 ${
            isCompleted
              ? 'bg-accent text-white border-accent shadow-md shadow-accent/30'
              : 'bg-white border-gray-300 text-gray-500'
          }`}
        >
          {isCompleted ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            index + 1
          )}
        </div>
        {/* Connector line */}
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-[24px] ${
              isCompleted ? 'bg-accent' : 'bg-gray-200'
            } transition-colors duration-300`}
          />
        )}
      </div>

      {/* Right: course card */}
      <Link
        to={`/courses/${slug}`}
        className="group flex-1 mb-4"
      >
        <div
          className={`rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
            isCompleted
              ? 'border-accent/30 bg-accent/5'
              : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Course icon */}
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: `${theme.hex}15` }}
            >
              {course.icon}
            </div>

            {/* Course info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {course.title}
                </h4>
                <DifficultyBadge difficulty={course.difficulty} />
                {isCompleted && (
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    완료
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.estimatedHours}시간
                </span>
              </div>
            </div>

            {/* Arrow */}
            <svg
              className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors flex-shrink-0 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Learning Path Track
// ---------------------------------------------------------------------------

function LearningPathTrack({
  path,
  completedSlugs,
  isHighlighted,
}: {
  path: LearningPath
  completedSlugs: Set<string>
  isHighlighted: boolean
}) {
  const completedCount = path.courseSlugs.filter((s) => completedSlugs.has(s)).length
  const totalCount = path.courseSlugs.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const firstIncompleteSlug = path.courseSlugs.find((s) => !completedSlugs.has(s)) || path.courseSlugs[0]

  return (
    <div
      id={`path-${path.id}`}
      className={`rounded-2xl border-2 transition-all duration-500 ${
        isHighlighted
          ? 'border-accent shadow-xl shadow-accent/10 ring-2 ring-accent/20'
          : 'border-gray-100 shadow-sm'
      }`}
    >
      {/* Path header */}
      <div className={`p-6 sm:p-8 rounded-t-2xl ${path.bgLight}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{path.emoji}</span>
              <h3 className="text-2xl font-extrabold text-gray-900">{path.title}</h3>
            </div>
            <p className="text-gray-600 max-w-xl">{path.description}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <DifficultyBadge difficulty={path.difficulty} />
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {path.target}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {path.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {completedCount > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-600">
                {completedCount}/{totalCount} 코스 완료
              </span>
              <span className="text-sm font-bold text-accent">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} size="md" />
          </div>
        )}

        {/* Prerequisite notice */}
        {path.prerequisite && (
          <div className="mt-4 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>선수 조건:</strong> {path.prerequisite}
            </span>
          </div>
        )}
      </div>

      {/* Course list */}
      <div className="p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">학습 순서</h4>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div>
          {path.courseSlugs.map((slug, idx) => (
            <PathCourseCard
              key={slug}
              slug={slug}
              index={idx}
              isCompleted={completedSlugs.has(slug)}
              isLast={idx === path.courseSlugs.length - 1}
            />
          ))}
        </div>

        {/* Goal section */}
        <div className="mt-4 flex items-start gap-3 bg-gray-50 rounded-xl px-5 py-4">
          <span className="text-xl flex-shrink-0 mt-0.5">{'\uD83C\uDFC1'}</span>
          <div>
            <p className="text-sm font-bold text-gray-700 mb-0.5">목표 달성 시</p>
            <p className="text-sm text-gray-600">{path.goal}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Link to={`/courses/${firstIncompleteSlug}`}>
            <Button size="lg" className="w-full sm:w-auto">
              {completedCount > 0 && completedCount < totalCount
                ? '이어서 학습하기'
                : completedCount === totalCount
                  ? '다시 복습하기'
                  : '이 경로 시작하기'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function Roadmap() {
  const { user } = useAuthStore()
  const { completedSections } = useProgressStore()
  const [highlightedPath, setHighlightedPath] = useState<string | null>(null)

  // Determine which courses are "completed" for each path.
  // A course counts as completed if ANY section whose ID starts with the course slug exists in completedSections.
  const completedCourseSlugs = useMemo(() => {
    const slugs = new Set<string>()
    const allSlugs = coursesData.map((c) => c.slug)
    for (const sectionId of completedSections) {
      for (const slug of allSlugs) {
        if (sectionId.startsWith(slug)) {
          slugs.add(slug)
          break
        }
      }
    }
    return slugs
  }, [completedSections])

  const handlePersonaClick = (pathId: string) => {
    setHighlightedPath(pathId)
    const el = document.getElementById(`path-${pathId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Clear highlight after animation
    setTimeout(() => setHighlightedPath(null), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================================= */}
      {/* Hero Section                                                   */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden bg-primary">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Gradient orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#7C5CFC]/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="text-accent text-sm font-semibold">{'\uD83D\uDDFA\uFE0F'} 15개 코스 {'\u00B7'} 3개 학습 경로</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight">
            학습 로드맵
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            목표에 맞는 학습 경로를 선택하고, 단계별로 AI를 마스터하세요.
            <br className="hidden sm:block" />
            입문자부터 커리어 전환까지, 체계적인 커리큘럼이 준비되어 있습니다.
          </p>
        </div>
      </section>

      {/* ============================================================= */}
      {/* Persona Section                                                */}
      {/* ============================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {personas.map((persona) => (
            <button
              key={persona.recommendedPathId}
              onClick={() => handlePersonaClick(persona.recommendedPathId)}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <span className="text-4xl block mb-3">{persona.emoji}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-accent transition-colors">
                {persona.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{persona.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {persona.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                추천 경로 보기
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================= */}
      {/* Section title                                                  */}
      {/* ============================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">학습 경로</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            각 경로는 순서대로 학습하도록 설계되었습니다. 자신에게 맞는 경로를 선택하세요.
          </p>
        </div>

        {/* Progress overview (logged-in users only) */}
        {user && completedCourseSlugs.size > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">나의 전체 진행 현황</h3>
                <p className="text-sm text-gray-500 mt-1">
                  전체 15개 코스 중 <span className="text-accent font-bold">{completedCourseSlugs.size}개</span> 완료
                </p>
              </div>
              <div className="w-full sm:w-64">
                <Progress value={completedCourseSlugs.size} max={15} size="lg" showLabel />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================= */}
      {/* Learning Path Tracks                                           */}
      {/* ============================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-10">
        {learningPaths.map((path) => (
          <LearningPathTrack
            key={path.id}
            path={path}
            completedSlugs={completedCourseSlugs}
            isHighlighted={highlightedPath === path.id}
          />
        ))}

        {/* Bottom CTA */}
        <div className="text-center pt-8 pb-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
            <span className="text-4xl block mb-4">{'\uD83D\uDCA1'}</span>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
              어디서 시작할지 모르겠다면?
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              AI 입문 코스부터 시작하세요. 기초를 탄탄히 다진 후 원하는 경로로 확장할 수 있습니다.
            </p>
            <Link to="/courses/ai-intro">
              <Button size="lg">AI 입문부터 시작하기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
