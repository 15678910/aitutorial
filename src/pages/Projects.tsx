import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import CommunityNav from '../components/community/CommunityNav'
import ProjectCard from '../components/community/ProjectCard'
import { useAuthStore } from '../store/authStore'
import { useProjectStore } from '../store/projectStore'
import { PROJECT_CATEGORY_LABELS, type ProjectCategory } from '../types/community'

const STATUS_OPTIONS = [
  { value: 'all', label: '전체 상태' },
  { value: 'recruiting', label: '모집 중' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
  { value: 'showcase', label: '쇼케이스' },
]

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: '전체 카테고리' },
  ...Object.entries(PROJECT_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
]

export default function Projects() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getProjects, addProject } = useProjectStore()

  const [showForm, setShowForm] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState<ProjectCategory>('education')
  const [formMaxMembers, setFormMaxMembers] = useState(5)
  const [formSkills, setFormSkills] = useState('')
  const [formRelatedCourses, setFormRelatedCourses] = useState('')

  const filter = useMemo(() => ({
    category: categoryFilter !== 'all' ? (categoryFilter as ProjectCategory) : undefined,
    status: statusFilter !== 'all' ? (statusFilter as 'recruiting' | 'in_progress' | 'completed' | 'showcase') : undefined,
    search: searchQuery || undefined,
  }), [categoryFilter, statusFilter, searchQuery])

  const projects = getProjects(filter)

  const handleNewProject = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formTitle.trim() || !formDescription.trim()) return

    const skills = formSkills.split(',').map(s => s.trim()).filter(Boolean)
    const relatedCourses = formRelatedCourses.split(',').map(s => s.trim()).filter(Boolean)

    addProject({
      title: formTitle.trim(),
      description: formDescription.trim(),
      category: formCategory,
      status: 'recruiting',
      authorId: user.id,
      authorName: user.name || '익명',
      members: [{ userId: user.id, userName: user.name || '익명', role: '팀장', joinedAt: new Date().toISOString() }],
      maxMembers: Math.min(10, Math.max(2, formMaxMembers)),
      skills,
      relatedCourses,
    })

    // Reset form
    setFormTitle('')
    setFormDescription('')
    setFormCategory('education')
    setFormMaxMembers(5)
    setFormSkills('')
    setFormRelatedCourses('')
    setShowForm(false)
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold">프로젝트 허브</h1>
          <p className="text-white/80 mt-2">AI 프로젝트를 함께 만들고 성장하세요</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Community Navigation */}
        <CommunityNav activeTab="projects" />

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            전체 프로젝트 <span className="text-gray-400 font-normal text-base ml-2">{projects.length}개</span>
          </h2>
          <Button onClick={handleNewProject}>
            새 프로젝트
          </Button>
        </div>

        {/* Inline Creation Form */}
        {showForm && (
          <Card className="mt-6 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">새 프로젝트 만들기</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="프로젝트 이름"
                id="project-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="프로젝트 이름을 입력하세요"
                required
              />

              <div className="w-full">
                <label htmlFor="project-desc" className="block text-sm font-medium text-gray-700 mb-1">
                  프로젝트 설명
                </label>
                <textarea
                  id="project-desc"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[100px]"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="프로젝트에 대해 자세히 설명해주세요"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <label htmlFor="project-category" className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리
                  </label>
                  <select
                    id="project-category"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProjectCategory)}
                  >
                    {Object.entries(PROJECT_CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label htmlFor="project-max-members" className="block text-sm font-medium text-gray-700 mb-1">
                    최대 인원 (2~10명)
                  </label>
                  <input
                    type="number"
                    id="project-max-members"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={formMaxMembers}
                    onChange={(e) => setFormMaxMembers(Number(e.target.value))}
                    min={2}
                    max={10}
                  />
                </div>
              </div>

              <Input
                label="필요 기술 (쉼표로 구분)"
                id="project-skills"
                value={formSkills}
                onChange={(e) => setFormSkills(e.target.value)}
                placeholder="예: Python, TensorFlow, NLP"
              />

              <Input
                label="관련 코스 (쉼표로 구분, 선택사항)"
                id="project-courses"
                value={formRelatedCourses}
                onChange={(e) => setFormRelatedCourses(e.target.value)}
                placeholder="예: AI 입문, 딥러닝 기초"
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit">프로젝트 생성</Button>
                <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>취소</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <div className="flex-1">
            <Input
              placeholder="프로젝트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">조건에 맞는 프로젝트가 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">필터를 변경하거나 새 프로젝트를 만들어보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
