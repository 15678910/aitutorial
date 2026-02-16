import { useState, useMemo } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCommunityStore } from '../store/communityStore'
import { useProjectStore } from '../store/projectStore'
import { useQAStore } from '../store/qaStore'
import { useWikiStore } from '../store/wikiStore'
import { getCommunityRole, COMMUNITY_ROLES } from '../types/community'
import CommunityNav from '../components/community/CommunityNav'
import ReputationBadge from '../components/community/ReputationBadge'
import SkillTag from '../components/community/SkillTag'
import ContributionStats from '../components/community/ContributionStats'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
  'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-red-500',
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function MyProfile() {
  const { user } = useAuthStore()
  const { getProfile, initProfile, updateProfile } = useCommunityStore()
  const { projects } = useProjectStore()
  const { questions } = useQAStore()
  const { articles } = useWikiStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editBio, setEditBio] = useState('')
  const [editSkills, setEditSkills] = useState('')
  const [activeTab, setActiveTab] = useState<'projects' | 'answers' | 'wiki'>('projects')

  if (!user) return <Navigate to="/login" replace />

  // Ensure profile exists
  let profile = getProfile(user.id)
  if (!profile) {
    initProfile(user.id, user.name || user.email)
    profile = getProfile(user.id)
  }

  if (!profile) return null

  const currentRole = getCommunityRole(profile.reputation)
  const currentRoleIndex = COMMUNITY_ROLES.findIndex((r) => r.role === currentRole.role)
  const nextRole = currentRoleIndex < COMMUNITY_ROLES.length - 1 ? COMMUNITY_ROLES[currentRoleIndex + 1] : null
  const roleProgress = nextRole
    ? ((profile.reputation - currentRole.min) / (nextRole.min - currentRole.min)) * 100
    : 100

  const initial = profile.displayName.charAt(0)
  const avatarColor = getAvatarColor(profile.displayName)

  // User projects
  const myProjects = useMemo(
    () => projects.filter((p) => p.members.some((m) => m.userId === user.id) || p.authorId === user.id),
    [projects, user.id]
  )

  // User answers
  const myAnswers = useMemo(
    () => questions.flatMap((q) =>
      q.answers
        .filter((a) => a.authorId === user.id)
        .map((a) => ({ ...a, questionTitle: q.title, questionId: q.id }))
    ),
    [questions, user.id]
  )

  // User wiki contributions
  const myWiki = useMemo(
    () => articles.filter(
      (a) =>
        a.authorId === user.id ||
        a.editHistory.some((e) => e.editorId === user.id)
    ),
    [articles, user.id]
  )

  function handleStartEdit() {
    setEditBio(profile!.bio)
    setEditSkills(profile!.skills.join(', '))
    setIsEditing(true)
  }

  function handleSave() {
    if (!user) return
    const newSkills = editSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    updateProfile(user.id, { bio: editBio, skills: newSkills })
    setIsEditing(false)
  }

  function handleCancel() {
    setIsEditing(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CommunityNav activeTab="profile" />

      <div className="mt-8 space-y-8">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className={`w-20 h-20 rounded-full ${avatarColor} flex items-center justify-center text-white text-3xl font-bold shrink-0`}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
                <ReputationBadge reputation={profile.reputation} />
              </div>

              {isEditing ? (
                <div className="space-y-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                      rows={3}
                      placeholder="자기소개를 작성해주세요"
                    />
                  </div>
                  <Input
                    label="스킬 (쉼표로 구분)"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    placeholder="Python, ML, NLP, React"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave}>저장</Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>취소</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-3">
                    {profile.bio || '아직 자기소개가 없습니다.'}
                  </p>
                  {profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {profile.skills.map((skill) => (
                        <SkillTag key={skill} skill={skill} size="md" />
                      ))}
                    </div>
                  )}
                  <Button size="sm" variant="outline" onClick={handleStartEdit}>
                    프로필 수정
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 text-center">
            <div className="text-3xl font-extrabold text-indigo-600">{profile.reputation}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">평판 포인트</div>
            {nextRole && (
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(roleProgress, 100)}%`, backgroundColor: currentRole.color }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  다음: {nextRole.icon} {nextRole.name} ({nextRole.min}P)
                </div>
              </div>
            )}
          </Card>
          <Card className="p-5 text-center">
            <div className="text-3xl font-extrabold text-blue-600">{myProjects.length}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">프로젝트</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-3xl font-extrabold text-green-600">{myAnswers.length}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">답변</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-3xl font-extrabold text-amber-600">{myWiki.length}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">위키 기여</div>
          </Card>
        </div>

        {/* Contribution Stats */}
        <ContributionStats userId={user.id} />

        {/* Activity Tabs */}
        <div>
          <div className="flex gap-0 border-b border-gray-200 mb-6">
            {[
              { key: 'projects' as const, label: '내 프로젝트', count: myProjects.length },
              { key: 'answers' as const, label: '내 답변', count: myAnswers.length },
              { key: 'wiki' as const, label: '내 위키', count: myWiki.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {activeTab === 'projects' && (
            <div className="space-y-3">
              {myProjects.length === 0 ? (
                <p className="text-gray-400 text-center py-8">참여 중인 프로젝트가 없습니다.</p>
              ) : (
                myProjects.map((p) => (
                  <Link key={p.id} to={`/community/projects/${p.id}`} className="block">
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{p.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{p.description}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                          p.status === 'recruiting' ? 'bg-green-100 text-green-700'
                          : p.status === 'in_progress' ? 'bg-blue-100 text-blue-700'
                          : p.status === 'completed' ? 'bg-gray-100 text-gray-600'
                          : 'bg-purple-100 text-purple-700'
                        }`}>
                          {p.status === 'recruiting' ? '모집중' : p.status === 'in_progress' ? '진행중' : p.status === 'completed' ? '완료' : '전시'}
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'answers' && (
            <div className="space-y-3">
              {myAnswers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">작성한 답변이 없습니다.</p>
              ) : (
                myAnswers.map((a) => (
                  <Link key={a.id} to={`/community/qa/${a.questionId}`} className="block">
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{a.questionTitle}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{a.content}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {a.isAccepted && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">채택됨</span>
                          )}
                          <span className="text-xs text-gray-400">{a.likes} 좋아요</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'wiki' && (
            <div className="space-y-3">
              {myWiki.length === 0 ? (
                <p className="text-gray-400 text-center py-8">위키 기여가 없습니다.</p>
              ) : (
                myWiki.map((a) => (
                  <Link key={a.id} to={`/community/wiki/${a.slug}`} className="block">
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{a.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            <span>{a.category}</span>
                            <span>{a.views} 조회</span>
                            <span>{a.editHistory.length} 편집</span>
                          </div>
                        </div>
                        {a.authorId === user.id && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">작성자</span>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Portfolio Export Section */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">포트폴리오 내보내기</h3>
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">프로필 요약</h4>
                <p className="text-sm text-gray-600">{profile.displayName} | {currentRole.icon} {currentRole.name}</p>
                <p className="text-sm text-gray-500">{profile.bio || '소개 없음'}</p>
                {profile.skills.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">스킬: {profile.skills.join(', ')}</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">활동 요약</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>평판 포인트: {profile.reputation}P ({currentRole.name})</li>
                  <li>프로젝트 참여: {myProjects.length}개</li>
                  <li>답변 작성: {myAnswers.length}개 (채택: {myAnswers.filter((a) => a.isAccepted).length}개)</li>
                  <li>위키 기여: {myWiki.length}개</li>
                </ul>
              </div>
            </div>
            {myProjects.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">주요 프로젝트</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {myProjects.slice(0, 5).map((p) => (
                    <li key={p.id}>- {p.title} ({p.status === 'completed' ? '완료' : '진행중'})</li>
                  ))}
                </ul>
              </div>
            )}
            <Button size="sm" variant="outline" onClick={() => {
              const text = [
                `=== ${profile!.displayName} AI 커뮤니티 포트폴리오 ===`,
                `역할: ${currentRole.icon} ${currentRole.name} (${profile!.reputation}P)`,
                profile!.bio ? `소개: ${profile!.bio}` : '',
                profile!.skills.length > 0 ? `스킬: ${profile!.skills.join(', ')}` : '',
                '',
                `[활동 요약]`,
                `프로젝트: ${myProjects.length}개`,
                `답변: ${myAnswers.length}개 (채택: ${myAnswers.filter((a) => a.isAccepted).length}개)`,
                `위키 기여: ${myWiki.length}개`,
                '',
                myProjects.length > 0 ? `[프로젝트]\n${myProjects.map((p) => `- ${p.title}`).join('\n')}` : '',
              ].filter(Boolean).join('\n')
              navigator.clipboard.writeText(text)
              alert('포트폴리오가 클립보드에 복사되었습니다!')
            }}>
              클립보드에 복사
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
