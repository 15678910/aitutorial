import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import CommunityNav from '../components/community/CommunityNav'

const STATS = [
  { label: '프로젝트', value: '128', icon: '🚀' },
  { label: '질문', value: '1,024', icon: '💬' },
  { label: '위키 문서', value: '256', icon: '📚' },
  { label: '멤버', value: '3,847', icon: '👥' },
]

const SECTIONS = [
  {
    icon: '🚀',
    title: '프로젝트 허브',
    description: 'AI 프로젝트를 함께 만들어보세요',
    link: '/community/projects',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
  },
  {
    icon: '💬',
    title: 'Q&A 포럼',
    description: '궁금한 것을 물어보고 답해주세요',
    link: '/community/qa',
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
  },
  {
    icon: '📚',
    title: '지식 위키',
    description: 'AI 지식을 함께 쌓아가세요',
    link: '/community/wiki',
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
  },
  {
    icon: '🏆',
    title: 'AI 챌린지',
    description: '월간 AI 문제 해결에 도전하세요',
    link: null,
    color: 'from-purple-500 to-pink-600',
    bgLight: 'bg-purple-50',
  },
]

const SAMPLE_CHALLENGES = [
  {
    id: 'challenge-1',
    title: '감성 분석 챌린지',
    description: '한국어 리뷰 데이터를 활용한 감성 분석 모델을 만들어보세요.',
    difficulty: 'beginner' as const,
    status: 'active' as const,
    participants: 42,
    endDate: '2026-03-15',
  },
  {
    id: 'challenge-2',
    title: '이미지 분류 대회',
    description: '의료 이미지를 분류하는 AI 모델을 개발하세요.',
    difficulty: 'intermediate' as const,
    status: 'active' as const,
    participants: 28,
    endDate: '2026-03-20',
  },
  {
    id: 'challenge-3',
    title: 'AI 챗봇 만들기',
    description: '특정 도메인에 특화된 AI 챗봇을 설계하고 구현하세요.',
    difficulty: 'advanced' as const,
    status: 'upcoming' as const,
    participants: 0,
    endDate: '2026-04-01',
  },
]

const RECENT_ACTIVITIES = [
  { type: 'project', title: '교육용 AI 튜터 개발', author: '김민수', time: '2시간 전', icon: '🚀' },
  { type: 'question', title: 'Transformer 어텐션 메커니즘 질문', author: '이지은', time: '3시간 전', icon: '💬' },
  { type: 'wiki', title: 'GPT 아키텍처 문서 업데이트', author: '박준영', time: '5시간 전', icon: '📚' },
  { type: 'challenge', title: '감성 분석 챌린지 새 제출', author: '최서연', time: '6시간 전', icon: '🏆' },
]

const DIFFICULTY_LABELS = {
  beginner: { text: '입문', color: 'bg-green-100 text-green-700' },
  intermediate: { text: '중급', color: 'bg-yellow-100 text-yellow-700' },
  advanced: { text: '고급', color: 'bg-red-100 text-red-700' },
}

const STATUS_LABELS = {
  upcoming: { text: '예정', color: 'bg-gray-100 text-gray-700' },
  active: { text: '진행 중', color: 'bg-blue-100 text-blue-700' },
  voting: { text: '투표 중', color: 'bg-purple-100 text-purple-700' },
  completed: { text: '완료', color: 'bg-green-100 text-green-700' },
}

export default function Community() {
  const [showChallenges, setShowChallenges] = useState(false)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            AI 집단지성 커뮤니티
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            함께 배우고, 만들고, 성장하는 AI 커뮤니티
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <Card key={stat.label} className="p-5 text-center">
                <span className="text-2xl mb-2 block">{stat.icon}</span>
                <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Community Navigation */}
        <CommunityNav activeTab="home" />

        {/* Section Cards - 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {SECTIONS.map((section) => {
            const content = (
              <Card hoverable className="p-6 h-full">
                <div className={`w-14 h-14 rounded-xl ${section.bgLight} flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{section.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <span className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                  자세히 보기 →
                </span>
              </Card>
            )

            if (section.link) {
              return (
                <Link key={section.title} to={section.link} className="block">
                  {content}
                </Link>
              )
            }

            return (
              <div
                key={section.title}
                className="block cursor-pointer"
                onClick={() => setShowChallenges(!showChallenges)}
              >
                {content}
              </div>
            )
          })}
        </div>

        {/* Challenge Cards (shown when AI 챌린지 clicked) */}
        {showChallenges && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">진행 중인 챌린지</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SAMPLE_CHALLENGES.map((challenge) => (
                <Card key={challenge.id} hoverable className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_LABELS[challenge.difficulty].color}`}>
                      {DIFFICULTY_LABELS[challenge.difficulty].text}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_LABELS[challenge.status].color}`}>
                      {STATUS_LABELS[challenge.status].text}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>참가자 {challenge.participants}명</span>
                    <span>마감 {challenge.endDate}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">최근 활동</h2>
          <Card className="divide-y divide-gray-100">
            {RECENT_ACTIVITIES.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <span className="text-xl flex-shrink-0">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.author}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
