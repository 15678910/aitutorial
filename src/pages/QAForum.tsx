import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import CommunityNav from '../components/community/CommunityNav'
import SkillTag from '../components/community/SkillTag'
import QAQuestionCard from '../components/community/QAQuestionCard'
import { useAuthStore } from '../store/authStore'
import { useQAStore } from '../store/qaStore'

const SORT_OPTIONS = [
  { value: 'newest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'unanswered', label: '미답변' },
] as const

export default function QAForum() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getQuestions, addQuestion, questions: allQuestions } = useQAStore()

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'unanswered'>('newest')
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formTags, setFormTags] = useState('')

  // Extract popular tags from all questions
  const popularTags = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    allQuestions.forEach((q) => {
      q.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag)
  }, [allQuestions])

  const filteredQuestions = getQuestions({
    tag: selectedTag,
    search: searchQuery || undefined,
    sort: sortBy,
  })

  const handleAskQuestion = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formTitle.trim() || !formContent.trim()) return

    const tags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    addQuestion(formTitle.trim(), formContent.trim(), tags, user.id, user.name || '익명')

    setFormTitle('')
    setFormContent('')
    setFormTags('')
    setShowForm(false)
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold">Q&A 포럼</h1>
          <p className="text-white/80 mt-2">AI 학습 중 궁금한 점을 질문하고 답변을 공유하세요</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Community Navigation */}
        <CommunityNav activeTab="qa" />

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            전체 질문 <span className="text-gray-400 font-normal text-base ml-2">{filteredQuestions.length}개</span>
          </h2>
          <Button onClick={handleAskQuestion}>질문하기</Button>
        </div>

        {/* Inline Question Form */}
        {showForm && (
          <Card className="mt-6 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">새 질문 작성</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="제목"
                id="qa-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="질문 제목을 입력하세요"
                required
              />

              <div className="w-full">
                <label htmlFor="qa-content" className="block text-sm font-medium text-gray-700 mb-1">
                  내용
                </label>
                <textarea
                  id="qa-content"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[200px]"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="질문 내용을 자세히 작성해주세요. 마크다운을 지원합니다."
                  required
                />
              </div>

              <Input
                label="태그 (쉼표로 구분)"
                id="qa-tags"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="예: Python, 딥러닝, RAG"
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit">질문 등록</Button>
                <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
                  취소
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filter Bar */}
        <div className="mt-6 space-y-4">
          {/* Tag Filter Pills */}
          {popularTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(undefined)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !selectedTag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? undefined : tag)}
                  className={`transition-colors ${
                    selectedTag === tag ? '' : ''
                  }`}
                >
                  <SkillTag
                    skill={tag}
                    size={selectedTag === tag ? 'md' : 'sm'}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Sort + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'unanswered')}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="flex-1">
              <Input
                placeholder="질문 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-4 mt-8">
          {filteredQuestions.map((question) => (
            <QAQuestionCard key={question.id} question={question} />
          ))}
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">조건에 맞는 질문이 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">
              필터를 변경하거나 새 질문을 작성해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
