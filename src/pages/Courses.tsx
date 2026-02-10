import { Link } from 'react-router-dom'
import { useCourseList } from '../hooks/useCourse'
import { getCourseTheme } from '../lib/courseThemes'
import ChapterIllustration from '../components/illustrations/ChapterIllustrations'

export default function Courses() {
  const courses = useCourseList()

  return (
    <div>
      {/* Hero */}
      <div className="bg-primary py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">전체 코스</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            AI의 기초부터 최신 기술까지, 체계적으로 학습할 수 있는 무료 코스입니다.
          </p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => {
            const theme = getCourseTheme(course.slug)
            const totalSections = course.chapters.reduce((sum, ch) => sum + ch.sections.length, 0)

            return (
              <Link key={course.slug} to={`/courses/${course.slug}`} className="group">
                <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                  {/* Colored header with illustration */}
                  <div
                    className="h-52 flex items-center justify-center p-8 relative"
                    style={{ backgroundColor: theme.hex }}
                  >
                    <div className="w-36 h-36">
                      <ChapterIllustration courseSlug={course.slug} chapterIndex={0} className="w-full h-full" />
                    </div>
                    {/* Course number badge */}
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      코스 {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-gray-600 text-base leading-relaxed mb-5">{course.description}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        className="font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: theme.hex + '12', color: theme.hex }}
                      >
                        {course.estimatedHours}시간
                      </span>
                      <span className="text-gray-400 font-medium">{course.chapters.length}챕터</span>
                      <span className="text-gray-400 font-medium">{totalSections}섹션</span>
                    </div>

                    {/* Chapter preview */}
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {course.chapters.map((ch, ci) => (
                          <span
                            key={ch.id}
                            className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-50 text-gray-600"
                          >
                            Ch{ci + 1}. {ch.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 font-bold text-base transition-colors" style={{ color: theme.hex }}>
                      학습 시작하기 →
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
