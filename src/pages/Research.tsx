import { useState } from 'react'
import Card from '../components/ui/Card'
import CommunityNav from '../components/community/CommunityNav'
import SkillTag from '../components/community/SkillTag'
import { useResearchStore } from '../store/researchStore'
import { useAuthStore } from '../store/authStore'
import {
  RESEARCH_FIELD_LABELS,
  RESEARCH_STATUS_LABELS,
  type ResearchField,
  type ResearchStatus,
  type ResearchProject,
  type ResearchCollaborator,
} from '../types/community'

const FIELD_OPTIONS: { key: string; label: string }[] = [
  { key: 'all', label: '전체 분야' },
  ...Object.entries(RESEARCH_FIELD_LABELS).map(([key, label]) => ({ key, label })),
]

const STATUS_OPTIONS: { key: string; label: string }[] = [
  { key: 'all', label: '전체 상태' },
  ...Object.entries(RESEARCH_STATUS_LABELS).map(([key, val]) => ({ key, label: val.text })),
]

const COLLABORATOR_ROLES: ResearchCollaborator['role'][] = [
  '공동 연구자',
  '데이터 분석가',
  '논문 작성자',
  '코드 개발자',
  '자문위원',
]

export default function Research() {
  const [fieldFilter, setFieldFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)
  const [showProposalForm, setShowProposalForm] = useState(false)

  const { getProjects, joinProject, toggleLike, updateMilestone, addProject } = useResearchStore()
  const { user } = useAuthStore()

  const projects = getProjects({
    field: fieldFilter !== 'all' ? fieldFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
  })

  const allProjects = getProjects()
  const inProgressCount = allProjects.filter((p) => p.status === 'in_progress').length
  const totalResearchers = new Set(allProjects.flatMap((p) => p.collaborators.map((c) => c.userId))).size
  const totalPapers = allProjects.reduce((sum, p) => sum + p.papers.length, 0)
  const totalInstitutions = new Set(allProjects.flatMap((p) => [p.institution, ...p.collaborators.map((c) => c.institution)])).size

  const toggleExpand = (projectId: string) => {
    setExpandedProjectId((prev) => (prev === projectId ? null : projectId))
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-600 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            연구 협업
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            대학, 연구소, 기업과 함께하는 AI 공동 연구 플랫폼.
            <br />
            아이디어부터 논문 발표까지, 함께 연구하세요.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: '진행 중 연구', value: inProgressCount.toString(), icon: '🔬' },
              { label: '연구자', value: totalResearchers.toString(), icon: '👩‍🔬' },
              { label: '발표 논문', value: totalPapers.toString(), icon: '📄' },
              { label: '참여 기관', value: totalInstitutions.toString(), icon: '🏛️' },
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
        <CommunityNav activeTab="research" />

        {/* Filter Bar */}
        <div className="mt-8 mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="연구 주제, 기술, 키워드 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
          />
          <select
            value={fieldFilter}
            onChange={(e) => setFieldFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
          >
            {FIELD_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Project List */}
        <div className="space-y-6">
          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </Card>
          ) : (
            projects.map((project) => (
              <ResearchProjectCard
                key={project.id}
                project={project}
                expanded={expandedProjectId === project.id}
                onToggle={() => toggleExpand(project.id)}
                onJoin={(role, institution) => {
                  if (user) joinProject(project.id, user.id, user.email?.split('@')[0] ?? '사용자', role, institution)
                }}
                onLike={() => {
                  if (user) toggleLike(project.id, user.id)
                }}
                onMilestoneToggle={(milestoneId, completed) => {
                  updateMilestone(project.id, milestoneId, completed)
                }}
                userId={user?.id}
              />
            ))
          )}
        </div>

        {/* Propose New Research */}
        <div className="mt-12">
          <Card className="p-8 bg-gradient-to-br from-rose-50 to-red-50 border-rose-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>📝</span> 새 연구 제안
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  연구 아이디어가 있으신가요? 공동 연구자를 모집하고 함께 연구를 시작하세요.
                </p>
              </div>
              <button
                onClick={() => setShowProposalForm(!showProposalForm)}
                className="bg-rose-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-rose-700 transition-colors text-sm"
              >
                {showProposalForm ? '닫기' : '연구 제안하기'}
              </button>
            </div>

            {showProposalForm && (
              <ProposalForm
                onSubmit={(data) => {
                  if (user) {
                    addProject({
                      ...data,
                      leaderId: user.id,
                      leaderName: user.email?.split('@')[0] ?? '사용자',
                      collaborators: [{
                        userId: user.id,
                        userName: user.email?.split('@')[0] ?? '사용자',
                        role: '연구 책임자',
                        institution: data.institution,
                        joinedAt: new Date().toISOString(),
                      }],
                    })
                    setShowProposalForm(false)
                  }
                }}
              />
            )}
          </Card>
        </div>

        {/* Research Guide */}
        <div className="mt-12">
          <Card className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📖</span> 연구 협업 가이드
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  title: '연구 탐색 또는 제안',
                  description: '관심 분야의 연구를 찾거나, 직접 연구 주제를 제안하세요.',
                  icon: '🔍',
                },
                {
                  step: '2',
                  title: '참여 및 협업',
                  description: '역할을 선택하고 연구에 참여하세요. 마일스톤으로 진행 상황을 관리합니다.',
                  icon: '🤝',
                },
                {
                  step: '3',
                  title: '논문 발표',
                  description: '연구 결과를 논문으로 작성하고 학회에 발표하세요. 평판 포인트가 부여됩니다.',
                  icon: '📄',
                },
              ].map((guide) => (
                <div key={guide.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3 text-xl">
                    {guide.icon}
                  </div>
                  <div className="text-xs font-bold text-rose-600 mb-1">STEP {guide.step}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{guide.title}</h3>
                  <p className="text-sm text-gray-600">{guide.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ----- Research Project Card -----
interface ResearchProjectCardProps {
  project: ResearchProject
  expanded: boolean
  onToggle: () => void
  onJoin: (role: ResearchCollaborator['role'], institution: string) => void
  onLike: () => void
  onMilestoneToggle: (milestoneId: string, completed: boolean) => void
  userId?: string
}

function ResearchProjectCard({ project, expanded, onToggle, onJoin, onLike, onMilestoneToggle, userId }: ResearchProjectCardProps) {
  const [joinRole, setJoinRole] = useState<ResearchCollaborator['role']>('공동 연구자')
  const [joinInstitution, setJoinInstitution] = useState('')
  const [showJoinForm, setShowJoinForm] = useState(false)

  const statusInfo = RESEARCH_STATUS_LABELS[project.status]
  const fieldLabel = RESEARCH_FIELD_LABELS[project.field]
  const completedMilestones = project.milestones.filter((m) => m.completed).length
  const totalMilestones = project.milestones.length
  const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0
  const isCollaborator = userId ? project.collaborators.some((c) => c.userId === userId) : false
  const hasSpace = project.collaborators.length < project.maxCollaborators
  const isLiked = userId ? project.likedBy.includes(userId) : false

  return (
    <Card className="overflow-hidden">
      {/* Card Header */}
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                {fieldLabel}
              </span>
              <span className="text-xs text-gray-500">{project.institution}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{project.abstract}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-4">
            <svg className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Leader & Collaborators */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center text-white font-bold text-xs">
              {project.leaderName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-700">{project.leaderName}</span>
            <span className="text-xs text-gray-400">연구 책임자</span>
          </div>
          {project.collaborators.length > 1 && (
            <div className="flex -space-x-2">
              {project.collaborators.slice(1, 4).map((c) => (
                <div
                  key={c.userId}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-xs border-2 border-white"
                  title={c.userName}
                >
                  {c.userName.charAt(0)}
                </div>
              ))}
              {project.collaborators.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold border-2 border-white">
                  +{project.collaborators.length - 4}
                </div>
              )}
            </div>
          )}
          <span className="text-xs text-gray-400">
            {project.collaborators.length}/{project.maxCollaborators}명
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.requiredSkills.slice(0, 5).map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
          {project.requiredSkills.length > 5 && (
            <span className="text-xs text-gray-400 self-center">+{project.requiredSkills.length - 5}</span>
          )}
        </div>

        {/* Milestones Progress + Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {totalMilestones > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${milestoneProgress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {completedMilestones}/{totalMilestones}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span>📄</span> 논문 {project.papers.length}편
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onLike()
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'
              }`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{project.likes}</span>
            </button>
            {project.status === 'recruiting' && hasSpace && !isCollaborator && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowJoinForm(true)
                  if (!expanded) onToggle()
                }}
                className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors"
              >
                참여 신청
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-6">
          {/* Full Abstract */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2">연구 개요</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{project.abstract}</p>
          </div>

          {/* Collaborators */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">연구 참여자</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.collaborators.map((collab) => (
                <div key={collab.userId} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                    {collab.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{collab.userName}</div>
                    <div className="text-xs text-gray-500">
                      {collab.role} | {collab.institution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          {project.milestones.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3">마일스톤</h4>
              <div className="space-y-3">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <button
                      onClick={() => onMilestoneToggle(milestone.id, !milestone.completed)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        milestone.completed
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : 'border-gray-300 hover:border-rose-400'
                      }`}
                    >
                      {milestone.completed && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${milestone.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {milestone.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{milestone.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        목표: {new Date(milestone.targetDate).toLocaleDateString('ko-KR')}
                        {milestone.completedAt && (
                          <span className="text-green-500 ml-2">
                            완료: {new Date(milestone.completedAt).toLocaleDateString('ko-KR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Papers */}
          {project.papers.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3">발표 논문</h4>
              <div className="space-y-3">
                {project.papers.map((paper) => (
                  <div key={paper.id} className="bg-white rounded-lg p-4 border border-gray-100">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      {paper.title}
                    </a>
                    <div className="text-xs text-gray-500 mt-1">
                      {paper.authors.join(', ')}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {paper.venue} | {new Date(paper.publishedAt).toLocaleDateString('ko-KR')}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{paper.abstract}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Datasets */}
          {project.datasets.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-2">사용 데이터셋</h4>
              <div className="flex flex-wrap gap-2">
                {project.datasets.map((dataset) => (
                  <span key={dataset} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                    {dataset}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Join Form */}
          {showJoinForm && project.status === 'recruiting' && hasSpace && !isCollaborator && (
            <div className="bg-white rounded-lg p-4 border-2 border-rose-200">
              <h4 className="font-bold text-gray-900 mb-3">공동 연구 참여</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">역할 선택</label>
                  <select
                    value={joinRole}
                    onChange={(e) => setJoinRole(e.target.value as ResearchCollaborator['role'])}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
                  >
                    {COLLABORATOR_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">소속 기관</label>
                  <input
                    type="text"
                    value={joinInstitution}
                    onChange={(e) => setJoinInstitution(e.target.value)}
                    placeholder="대학교, 연구소, 기업명..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (joinInstitution.trim()) {
                        onJoin(joinRole, joinInstitution.trim())
                        setShowJoinForm(false)
                        setJoinInstitution('')
                      }
                    }}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors"
                  >
                    참여 신청
                  </button>
                  <button
                    onClick={() => setShowJoinForm(false)}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// ----- Proposal Form -----
interface ProposalFormProps {
  onSubmit: (data: {
    title: string
    abstract: string
    field: ResearchField
    status: ResearchStatus
    institution: string
    maxCollaborators: number
    requiredSkills: string[]
    datasets: string[]
    tags: string[]
    milestones?: { title: string; description: string; targetDate: string }[]
  }) => void
}

function ProposalForm({ onSubmit }: ProposalFormProps) {
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [field, setField] = useState<ResearchField>('nlp')
  const [institution, setInstitution] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [milestoneDesc, setMilestoneDesc] = useState('')
  const [milestoneDate, setMilestoneDate] = useState('')
  const [milestones, setMilestones] = useState<{ title: string; description: string; targetDate: string }[]>([])

  const handleAddMilestone = () => {
    if (milestoneTitle.trim() && milestoneDate) {
      setMilestones([...milestones, {
        title: milestoneTitle.trim(),
        description: milestoneDesc.trim(),
        targetDate: new Date(milestoneDate).toISOString(),
      }])
      setMilestoneTitle('')
      setMilestoneDesc('')
      setMilestoneDate('')
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !abstract.trim() || !institution.trim()) return
    const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
    onSubmit({
      title: title.trim(),
      abstract: abstract.trim(),
      field,
      status: 'proposal',
      institution: institution.trim(),
      maxCollaborators: 6,
      requiredSkills: skills,
      datasets: [],
      tags: skills.slice(0, 3),
      milestones,
    })
  }

  return (
    <div className="mt-4 space-y-4 bg-white rounded-lg p-6 border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">연구 제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="연구 주제를 입력하세요"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">연구 개요 *</label>
        <textarea
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          placeholder="연구의 목적, 방법, 기대 결과를 설명하세요"
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">연구 분야 *</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value as ResearchField)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
          >
            {Object.entries(RESEARCH_FIELD_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">소속 기관 *</label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="대학교, 연구소, 기업명"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">필요 기술 (쉼표로 구분)</label>
        <input
          type="text"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          placeholder="Python, PyTorch, NLP, ..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Milestones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">마일스톤</label>
        {milestones.length > 0 && (
          <div className="space-y-2 mb-3">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{m.title}</span>
                  <span className="text-gray-400 ml-2">
                    ({new Date(m.targetDate).toLocaleDateString('ko-KR')})
                  </span>
                </div>
                <button
                  onClick={() => setMilestones(milestones.filter((_, idx) => idx !== i))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="text"
            value={milestoneTitle}
            onChange={(e) => setMilestoneTitle(e.target.value)}
            placeholder="마일스톤 제목"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
          />
          <input
            type="text"
            value={milestoneDesc}
            onChange={(e) => setMilestoneDesc(e.target.value)}
            placeholder="설명"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={milestoneDate}
              onChange={(e) => setMilestoneDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
            />
            <button
              onClick={handleAddMilestone}
              className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              추가
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !abstract.trim() || !institution.trim()}
          className="bg-rose-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          연구 제안 등록
        </button>
      </div>
    </div>
  )
}
