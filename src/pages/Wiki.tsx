import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import CommunityNav from '../components/community/CommunityNav'
import WikiArticleCard from '../components/community/WikiArticleCard'
import { useAuthStore } from '../store/authStore'
import { useWikiStore } from '../store/wikiStore'

export default function Wiki() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getArticles, addArticle, getCategories } = useWikiStore()

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formTags, setFormTags] = useState('')

  const categories = useMemo(() => getCategories(), [getCategories])

  const filteredArticles = getArticles({
    category: selectedCategory,
    search: searchQuery || undefined,
  })

  const handleNewArticle = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formTitle.trim() || !formContent.trim() || !formCategory.trim()) return

    const tags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    addArticle(
      formTitle.trim(),
      formContent.trim(),
      formCategory.trim(),
      tags,
      user.id,
      user.name || '익명'
    )

    setFormTitle('')
    setFormContent('')
    setFormCategory('')
    setFormTags('')
    setShowForm(false)
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold">지식 위키</h1>
          <p className="text-white/80 mt-2">AI 학습에 필요한 지식을 함께 정리하고 공유하세요</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Community Navigation */}
        <CommunityNav activeTab="wiki" />

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            전체 문서 <span className="text-gray-400 font-normal text-base ml-2">{filteredArticles.length}개</span>
          </h2>
          <Button onClick={handleNewArticle}>새 문서 작성</Button>
        </div>

        {/* Inline Creation Form */}
        {showForm && (
          <Card className="mt-6 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">새 위키 문서 작성</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="제목"
                id="wiki-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="문서 제목을 입력하세요"
                required
              />

              <Input
                label="카테고리"
                id="wiki-category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="예: 기초, 머신러닝, Python"
                required
              />

              <Input
                label="태그 (쉼표로 구분)"
                id="wiki-tags"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="예: AI, 용어, 입문"
              />

              <div className="w-full">
                <label htmlFor="wiki-content" className="block text-sm font-medium text-gray-700 mb-1">
                  내용 (마크다운)
                </label>
                <textarea
                  id="wiki-content"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[300px] font-mono text-sm"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="마크다운으로 문서 내용을 작성하세요..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit">문서 생성</Button>
                <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
                  취소
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search Bar */}
        <div className="mt-6">
          <Input
            placeholder="위키 문서 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Main Layout: Sidebar + Grid */}
        <div className="flex gap-8 mt-8">
          {/* Sidebar - Categories (Desktop Only) */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <Card className="p-4 sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 mb-3">카테고리</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedCategory(undefined)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    전체
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() =>
                        setSelectedCategory(selectedCategory === category ? undefined : category)
                      }
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>

          {/* Mobile Category Filter */}
          <div className="lg:hidden w-full">
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mb-6"
              value={selectedCategory ?? 'all'}
              onChange={(e) =>
                setSelectedCategory(e.target.value === 'all' ? undefined : e.target.value)
              }
            >
              <option value="all">전체 카테고리</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Article Grid - Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <WikiArticleCard key={article.id} article={article} />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-gray-500 text-lg">조건에 맞는 문서가 없습니다</p>
                <p className="text-gray-400 text-sm mt-2">
                  검색어를 변경하거나 새 문서를 작성해보세요
                </p>
              </div>
            )}
          </div>

          {/* Article Grid - Desktop */}
          <div className="hidden lg:block flex-1">
            <div className="grid grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <WikiArticleCard key={article.id} article={article} />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-gray-500 text-lg">조건에 맞는 문서가 없습니다</p>
                <p className="text-gray-400 text-sm mt-2">
                  검색어를 변경하거나 새 문서를 작성해보세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
