import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { coursesData } from '../../content/courses'
import Card from '../../components/ui/Card'

const difficultyLabel: Record<string, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

const difficultyColor: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export default function ContentManagement() {
  const courses = useMemo(
    () => [...coursesData].sort((a, b) => a.orderNum - b.orderNum),
    []
  )

  const totalCount = courses.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span role="img" aria-label="content">
            📚
          </span>
          콘텐츠 관리
        </h1>
        <p className="text-sm text-gray-500 mt-1">전체 {totalCount}개 코스</p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((course) => {
          const chaptersCount = course.chapters?.length ?? 0
          const sectionsCount = course.chapters
            ? course.chapters.reduce(
                (sum, ch) => sum + (ch.sections?.length ?? 0),
                0
              )
            : 0

          return (
            <Card key={course.slug} className="flex flex-col overflow-hidden">
              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Top row: icon + difficulty badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {(course as { icon?: string }).icon || '📖'}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      difficultyColor[course.difficulty] ||
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {difficultyLabel[course.difficulty] || course.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#29264c] mb-1.5 leading-snug">
                  {course.title}
                </h3>

                {/* Description (truncated 2 lines) */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {course.description}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                    {chaptersCount}개 챕터
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {sectionsCount}개 섹션
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {course.estimatedHours}시간
                  </span>
                </div>

                {/* Action buttons */}
                <Link
                  to={`/admin/content/${course.slug}/edit`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#32c2a2] rounded-lg hover:bg-[#2baa8e] transition-colors"
                >
                  편집
                </Link>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block" role="img" aria-label="empty">
            📭
          </span>
          <p className="text-gray-500">등록된 코스가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
