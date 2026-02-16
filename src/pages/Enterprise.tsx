import { useState } from 'react'
import Card from '../components/ui/Card'
import CommunityNav from '../components/community/CommunityNav'
import SkillTag from '../components/community/SkillTag'
import { useEnterpriseStore } from '../store/enterpriseStore'
import { useAuthStore } from '../store/authStore'
import {
  ENTERPRISE_TYPE_LABELS,
  POSITION_TYPE_LABELS,
  getCommunityRole,
  type EnterpriseType,
  type EnterprisePartner,
} from '../types/community'

const TYPE_FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'startup', label: '스타트업' },
  { key: 'sme', label: '중소기업' },
  { key: 'enterprise', label: '대기업' },
  { key: 'lab', label: '연구소' },
  { key: 'university', label: '대학교' },
]

const POSITION_TYPE_COLORS: Record<string, string> = {
  fulltime: 'bg-blue-100 text-blue-700',
  parttime: 'bg-teal-100 text-teal-700',
  intern: 'bg-green-100 text-green-700',
  freelance: 'bg-orange-100 text-orange-700',
  project: 'bg-purple-100 text-purple-700',
}

export default function Enterprise() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedPartnerId, setExpandedPartnerId] = useState<string | null>(null)

  const { getPartners, getRecommendedTalents, applyToPosition } = useEnterpriseStore()
  const { user } = useAuthStore()

  const partners = getPartners({
    type: typeFilter !== 'all' ? typeFilter : undefined,
    search: search || undefined,
  })

  const allPartners = getPartners()
  const totalPositions = allPartners.reduce((sum, p) => sum + p.positions.filter((pos) => pos.status === 'open').length, 0)
  const totalApplicants = allPartners.reduce(
    (sum, p) => sum + p.positions.reduce((s, pos) => s + pos.applicants.length, 0),
    0
  )
  const recommendations = getRecommendedTalents()

  const userReputation = 100 // 기본 사용자 평판 (실제로는 프로필에서 가져옴)

  const handleApply = (positionId: string) => {
    if (!user) return
    applyToPosition(positionId, user.id)
  }

  const toggleExpand = (partnerId: string) => {
    setExpandedPartnerId((prev) => (prev === partnerId ? null : partnerId))
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            기업 연계
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            커뮤니티에서 활발하게 기여한 인재를 기업과 연결합니다.
            <br />
            프로젝트 경험과 평판으로 검증된 AI 인재를 만나보세요.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: '파트너 기업', value: allPartners.length.toString(), icon: '🏢' },
              { label: '채용 포지션', value: totalPositions.toString(), icon: '💼' },
              { label: '추천 인재', value: recommendations.length.toString(), icon: '🌟' },
              { label: '매칭 완료', value: totalApplicants.toString(), icon: '🤝' },
            ].map((stat) => (
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
        <CommunityNav activeTab="enterprise" />

        {/* Search */}
        <div className="mt-8 mb-6">
          <input
            type="text"
            placeholder="기업명, 기술 분야 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setTypeFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                typeFilter === filter.key
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Partner Cards - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {partners.length === 0 ? (
              <Card className="p-12 text-center">
                <span className="text-4xl mb-4 block">🔍</span>
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </Card>
            ) : (
              partners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  expanded={expandedPartnerId === partner.id}
                  onToggle={() => toggleExpand(partner.id)}
                  onApply={handleApply}
                  userReputation={userReputation}
                  userId={user?.id}
                />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended Talents */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🌟</span> 추천 인재
              </h3>
              <div className="space-y-4">
                {recommendations.map((talent) => {
                  const roleInfo = getCommunityRole(talent.reputation)
                  return (
                    <div key={talent.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {talent.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{talent.userName}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span>{roleInfo.icon}</span>
                            <span>{roleInfo.name}</span>
                            <span className="text-gray-300">|</span>
                            <span>평판 {talent.reputation}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {talent.skills.map((skill) => (
                          <SkillTag key={skill} skill={skill} size="sm" />
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        프로젝트 {talent.projectCount}개 | 답변 {talent.answerCount}개 | 코스 {talent.completedCourses}개
                      </div>
                      {talent.highlights.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {talent.highlights.map((h) => (
                            <span key={h} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* CTA */}
            <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">기업 파트너 신청</h3>
              <p className="text-sm text-gray-600 mb-4">
                AI 인재를 찾고 계신가요? 파트너 기업으로 등록하고 검증된 인재를 추천받으세요.
              </p>
              <button className="w-full bg-cyan-600 text-white py-2.5 rounded-lg font-semibold hover:bg-cyan-700 transition-colors text-sm">
                파트너 등록 문의
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// ----- Partner Card Component -----
interface PartnerCardProps {
  partner: EnterprisePartner
  expanded: boolean
  onToggle: () => void
  onApply: (positionId: string) => void
  userReputation: number
  userId?: string
}

function PartnerCard({ partner, expanded, onToggle, onApply, userReputation, userId }: PartnerCardProps) {
  const openPositions = partner.positions.filter((p) => p.status === 'open')

  return (
    <Card className="overflow-hidden">
      {/* Partner Header */}
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
            {partner.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                getTypeBadgeColor(partner.type)
              }`}>
                {ENTERPRISE_TYPE_LABELS[partner.type]}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{partner.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {partner.fields.map((field) => (
                <SkillTag key={field} skill={field} />
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span>💼</span> 채용 포지션 {openPositions.length}개
              </span>
              <span className="flex items-center gap-1">
                <span>📍</span> {partner.positions[0]?.location.split(' ').slice(0, 2).join(' ')}
              </span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <svg className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Positions */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <h4 className="font-bold text-gray-900 mb-4">채용 포지션</h4>
          <div className="space-y-4">
            {openPositions.map((position) => {
              const meetsReputation = userReputation >= position.minReputation
              const alreadyApplied = userId ? position.applicants.includes(userId) : false

              return (
                <Card key={position.id} className="p-5 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h5 className="font-bold text-gray-900">{position.title}</h5>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          POSITION_TYPE_COLORS[position.type] ?? 'bg-gray-100 text-gray-700'
                        }`}>
                          {POSITION_TYPE_LABELS[position.type]}
                        </span>
                        {position.isRemote && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            원격 가능
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{position.location}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{position.description}</p>

                  {/* Requirements */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">지원 요건</p>
                    <ul className="text-sm text-gray-600 space-y-0.5">
                      {position.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-gray-400 mt-0.5 text-xs">&#8226;</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {position.skills.map((skill) => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        {meetsReputation ? (
                          <span className="text-green-500">&#10003;</span>
                        ) : (
                          <span className="text-red-400">🔒</span>
                        )}
                        최소 평판 {position.minReputation}
                      </span>
                      <span>지원자 {position.applicants.length}명</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApplyClick(position.id, meetsReputation, alreadyApplied, onApply)
                      }}
                      disabled={!meetsReputation || alreadyApplied}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        alreadyApplied
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : meetsReputation
                            ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {alreadyApplied ? '지원 완료' : meetsReputation ? '지원하기' : '평판 부족'}
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}

function handleApplyClick(positionId: string, meetsReputation: boolean, alreadyApplied: boolean, onApply: (id: string) => void) {
  if (!meetsReputation || alreadyApplied) return
  onApply(positionId)
}

function getTypeBadgeColor(type: EnterpriseType): string {
  const colors: Record<EnterpriseType, string> = {
    startup: 'bg-violet-100 text-violet-700',
    sme: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-indigo-100 text-indigo-700',
    lab: 'bg-emerald-100 text-emerald-700',
    university: 'bg-amber-100 text-amber-700',
  }
  return colors[type]
}
