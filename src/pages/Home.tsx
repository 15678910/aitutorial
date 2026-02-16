import { Link } from 'react-router-dom'
import { useCourseList } from '../hooks/useCourse'
import { getCourseTheme } from '../lib/courseThemes'
import ChapterIllustration from '../components/illustrations/ChapterIllustrations'
import { HeroIllustration } from '../components/illustrations'
import Button from '../components/ui/Button'

export default function Home() {
  const courses = useCourseList()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                누구나 배울 수 있는<br />
                <span className="text-accent">인공지능</span> 🤖
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                AI의 기초부터 최신 생성형 AI까지,<br />
                무료로 제공되는 체계적인 온라인 학습 과정을 통해<br />
                인공지능의 세계를 탐험하고,<br />
                AI 집단지성의 공간을 만들어 보세요.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses">
                  <button className="bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105 shadow-lg">
                    무료로 시작하기 →
                  </button>
                </Link>
                <Link to="/courses">
                  <button className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all">
                    코스 둘러보기
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block animate-fade-in-delayed">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Features - kid-friendly */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-fade-in">
            {[
              { icon: '📚', title: '체계적인 커리큘럼', desc: '입문부터 고급까지 단계별로 설계된 4개의 코스', color: '#FF6B6B' },
              { icon: '✏️', title: '이론 + 실습', desc: '개념 학습 후 퀴즈와 실습으로 이해도 확인', color: '#2EC4B6' },
              { icon: '🆓', title: '완전 무료', desc: '모든 콘텐츠를 무료로 이용할 수 있습니다', color: '#7C5CFC' },
            ].map((f) => (
              <div key={f.title} className="text-center p-8 rounded-3xl hover:shadow-lg transition-shadow" style={{ backgroundColor: f.color + '08' }}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: f.color + '18' }}
                >
                  <span className="text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Cards - Elements of AI style with colored backgrounds */}
      <section className="bg-primary py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">학습 코스</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              AI의 기초 개념부터 최신 생성형 AI 기술까지, 단계별로 학습할 수 있어요!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, courseIdx) => {
              const theme = getCourseTheme(course.slug)
              return (
                <Link key={course.slug} to={`/courses/${course.slug}`} className="group">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                    {/* Colored illustration area */}
                    <div
                      className="h-56 flex items-center justify-center p-8"
                      style={{ backgroundColor: theme.hex }}
                    >
                      <div className="w-40 h-40">
                        <ChapterIllustration courseSlug={course.slug} chapterIndex={0} className="w-full h-full" />
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-7">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ backgroundColor: theme.hex + '15', color: theme.hex }}
                        >
                          코스 {courseIdx + 1}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{course.estimatedHours}시간 · {course.chapters.length}챕터</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed mb-4">{course.description}</p>
                      <div className="font-bold transition-colors" style={{ color: theme.hex }}>
                        학습 시작하기 →
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI 집단지성 커뮤니티 Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            AI 집단지성 커뮤니티
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
            학습을 넘어 함께 만들고 성장하는 공간
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { icon: '🚀', title: '프로젝트 허브', desc: '팀을 구성하고 AI 프로젝트를 함께 만들어보세요', color: '#6366f1' },
              { icon: '💬', title: 'Q&A 포럼', desc: 'AI 학습 중 궁금한 점을 질문하고 답변하세요', color: '#3b82f6' },
              { icon: '📖', title: '지식 위키', desc: 'AI 지식을 함께 정리하고 공유하세요', color: '#f59e0b' },
              { icon: '🏆', title: 'AI 챌린지', desc: 'AI 챌린지에 참여하고 실력을 겨뤄보세요', color: '#ef4444' },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: f.color + '15' }}
                >
                  <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <Link to="/community">
            <Button size="lg">커뮤니티 참여하기</Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
            지금 바로 시작하세요! 🚀
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            회원가입 후 모든 코스를 무료로 학습할 수 있습니다.
          </p>
          <Link to="/signup">
            <button className="bg-white text-gray-900 px-10 py-5 rounded-2xl text-xl font-extrabold hover:bg-white/90 transition-all hover:scale-105 shadow-xl">
              무료 회원가입
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
