import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { coursesData, loadCourse } from '../../content/courses'
import Card from '../../components/ui/Card'
import type { Chapter, Section } from '../../types/course'
import type { EditableCourse } from '../../types/admin'

type TabKey = 'info' | 'chapters'

const difficultyOptions: { value: EditableCourse['difficulty']; label: string }[] = [
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

const contentTypeLabel: Record<string, string> = {
  text: '텍스트',
  video: '비디오',
  interactive: '인터랙티브',
}

const contentTypeBadge: Record<string, string> = {
  text: 'bg-blue-100 text-blue-700',
  video: 'bg-purple-100 text-purple-700',
  interactive: 'bg-orange-100 text-orange-700',
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */

function EditorSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-5 w-32 bg-gray-200 rounded" />
      </div>
      <div className="h-8 w-64 bg-gray-200 rounded" />
      <Card className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-10 w-full bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#29264c] text-white text-sm font-medium rounded-lg shadow-lg">
      <svg className="w-4 h-4 text-[#32c2a2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Chapter Accordion                                                  */
/* ------------------------------------------------------------------ */

function ChapterAccordion({
  chapter,
  chapterIndex,
  onTitleChange,
}: {
  chapter: Chapter
  chapterIndex: number
  onTitleChange: (index: number, title: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Chapter Header */}
      <div
        className="flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-400 w-8 shrink-0">
            {chapterIndex + 1}.
          </span>
          <input
            type="text"
            value={chapter.title}
            onChange={(e) => onTitleChange(chapterIndex, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 text-sm font-medium text-[#29264c] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#32c2a2] outline-none py-0.5 transition-colors"
          />
          <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
            {chapter.sections?.length ?? 0}개 섹션
          </span>
        </div>
        <button
          className="ml-3 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          aria-label={expanded ? '접기' : '펼치기'}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Sections List */}
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50/50">
          {chapter.sections && chapter.sections.length > 0 ? (
            chapter.sections.map((section) => (
              <SectionItem key={section.id} section={section} />
            ))
          ) : (
            <div className="px-5 py-6 text-center text-sm text-gray-400">
              섹션이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section Item                                                       */
/* ------------------------------------------------------------------ */

function SectionItem({ section }: { section: Section }) {
  const [showPreview, setShowPreview] = useState(false)

  const truncatedContent = section.content
    ? section.content.length > 300
      ? section.content.slice(0, 300) + '...'
      : section.content
    : '(콘텐츠 없음)'

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div
        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100/50 transition-colors cursor-pointer"
        onClick={() => setShowPreview(!showPreview)}
      >
        <span className="text-xs text-gray-400 w-6 shrink-0 text-right">
          {section.orderNum}.
        </span>
        <span className="text-sm text-gray-800 flex-1 min-w-0 truncate">
          {section.title}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
            contentTypeBadge[section.contentType] || 'bg-gray-100 text-gray-600'
          }`}
        >
          {contentTypeLabel[section.contentType] || section.contentType}
        </span>
        <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
          {section.estimatedMinutes}분
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${showPreview ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {showPreview && (
        <div className="px-5 pb-4 pl-14">
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-600 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {truncatedContent}
          </div>
          {section.quizzes && section.quizzes.length > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              퀴즈 {section.quizzes.length}개 포함
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ContentEditor() {
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab] = useState<TabKey>('info')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Editable form state
  const [title, setTitle] = useState('')
  const [courseSlug, setCourseSlug] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<EditableCourse['difficulty']>('beginner')
  const [estimatedHours, setEstimatedHours] = useState(0)
  const [icon, setIcon] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([])

  const loadCourseData = useCallback(async () => {
    if (!slug) {
      setNotFound(true)
      setLoading(false)
      return
    }

    // Find meta first
    const meta = coursesData.find((c) => c.slug === slug)
    if (!meta) {
      setNotFound(true)
      setLoading(false)
      return
    }

    // Set meta fields immediately
    setTitle(meta.title)
    setCourseSlug(meta.slug)
    setDescription(meta.description)
    setDifficulty(meta.difficulty)
    setEstimatedHours(meta.estimatedHours)
    setIcon((meta as { icon?: string }).icon || '')

    // Load full course with chapters
    try {
      const fullCourse = await loadCourse(slug)
      if (fullCourse && fullCourse.chapters) {
        setChapters(fullCourse.chapters)
      }
    } catch (err) {
      console.error('Failed to load course chapters:', err)
    }

    setLoading(false)
  }, [slug])

  useEffect(() => {
    loadCourseData()
  }, [loadCourseData])

  const handleSave = () => {
    // Save to local state (already done via controlled inputs)
    setToastMessage('변경사항이 저장되었습니다.')
  }

  const handleExportJSON = () => {
    const courseData = {
      slug: courseSlug,
      title,
      description,
      icon,
      difficulty,
      estimatedHours,
      chapters: chapters.map((ch) => ({
        id: ch.id,
        courseId: ch.courseId,
        slug: ch.slug,
        title: ch.title,
        description: ch.description,
        orderNum: ch.orderNum,
        sections: ch.sections?.map((s) => ({
          id: s.id,
          chapterId: s.chapterId,
          slug: s.slug,
          title: s.title,
          content: s.content,
          contentType: s.contentType,
          orderNum: s.orderNum,
          estimatedMinutes: s.estimatedMinutes,
          quizzes: s.quizzes,
        })),
      })),
    }

    const blob = new Blob([JSON.stringify(courseData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${courseSlug}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setToastMessage('JSON 파일이 다운로드되었습니다.')
  }

  const handleChapterTitleChange = (index: number, newTitle: string) => {
    setChapters((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], title: newTitle }
      return updated
    })
  }

  /* ---- Loading ---- */
  if (loading) {
    return <EditorSkeleton />
  }

  /* ---- Not Found ---- */
  if (notFound) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/content"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#32c2a2] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          콘텐츠 목록으로
        </Link>
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block" role="img" aria-label="not found">
            🔍
          </span>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            코스를 찾을 수 없습니다
          </h2>
          <p className="text-sm text-gray-500">
            요청한 코스 &quot;{slug}&quot;이(가) 존재하지 않습니다.
          </p>
        </div>
      </div>
    )
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'info', label: '기본 정보' },
    { key: 'chapters', label: '챕터 관리' },
  ]

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Back Link */}
      <Link
        to="/admin/content"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#32c2a2] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        콘텐츠 목록으로
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl" role="img" aria-hidden="true">
          {icon || '📖'}
        </span>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#32c2a2] text-[#32c2a2]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <Card className="p-6">
          <div className="space-y-5 max-w-2xl">
            {/* 코스 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                코스 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#32c2a2] focus:ring-1 focus:ring-[#32c2a2] outline-none transition-colors"
              />
            </div>

            {/* 슬러그 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                슬러그
              </label>
              <input
                type="text"
                value={courseSlug}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                설명
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#32c2a2] focus:ring-1 focus:ring-[#32c2a2] outline-none transition-colors resize-none"
              />
            </div>

            {/* 난이도 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                난이도
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as EditableCourse['difficulty'])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#32c2a2] focus:ring-1 focus:ring-[#32c2a2] outline-none transition-colors bg-white"
              >
                {difficultyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 예상 학습 시간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                예상 학습 시간 (시간)
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) =>
                  setEstimatedHours(Math.max(0, Number(e.target.value)))
                }
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#32c2a2] focus:ring-1 focus:ring-[#32c2a2] outline-none transition-colors"
              />
            </div>

            {/* 아이콘 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                아이콘
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="이모지를 입력하세요 (예: 🤖)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#32c2a2] focus:ring-1 focus:ring-[#32c2a2] outline-none transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={handleSave}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#32c2a2] rounded-lg hover:bg-[#2baa8e] transition-colors"
              >
                저장
              </button>
              <button
                onClick={handleExportJSON}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                JSON 내보내기
              </button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'chapters' && (
        <div className="space-y-3">
          {chapters.length > 0 ? (
            chapters.map((chapter, index) => (
              <ChapterAccordion
                key={chapter.id}
                chapter={chapter}
                chapterIndex={index}
                onTitleChange={handleChapterTitleChange}
              />
            ))
          ) : (
            <Card className="p-10 text-center">
              <span
                className="text-4xl mb-3 block"
                role="img"
                aria-label="empty chapters"
              >
                📂
              </span>
              <p className="text-sm text-gray-500">
                이 코스에는 아직 챕터가 없습니다.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
