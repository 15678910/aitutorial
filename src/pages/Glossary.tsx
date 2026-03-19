import { useState, useMemo } from 'react'
import { glossary, type GlossaryEntry } from '../lib/glossary'

type Category = GlossaryEntry['category'] | 'all'

const categoryColors: Record<GlossaryEntry['category'], string> = {
  computer: 'bg-blue-100 text-blue-700 border-blue-200',
  coding: 'bg-purple-100 text-purple-700 border-purple-200',
  web: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  tool: 'bg-green-100 text-green-700 border-green-200',
  team: 'bg-orange-100 text-orange-700 border-orange-200',
  ai: 'bg-pink-100 text-pink-700 border-pink-200',
}

const categoryLabels: Record<GlossaryEntry['category'], string> = {
  computer: '컴퓨터 기초',
  coding: '코딩/프로그래밍',
  web: '웹/인터넷',
  tool: '개발 도구',
  team: '협업/실무',
  ai: 'AI/머신러닝',
}

const filterTabs: { value: Category; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ai', label: 'AI/머신러닝' },
  { value: 'computer', label: '컴퓨터 기초' },
  { value: 'coding', label: '코딩/프로그래밍' },
  { value: 'web', label: '웹/인터넷' },
  { value: 'tool', label: '개발 도구' },
  { value: 'team', label: '협업/실무' },
]

export default function Glossary() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return glossary.filter((entry) => {
      const matchCategory = activeCategory === 'all' || entry.category === activeCategory
      if (!matchCategory) return false
      if (!q) return true
      return (
        entry.term.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        (entry.aliases ?? []).some((a) => a.toLowerCase().includes(q))
      )
    })
  }, [activeCategory, search])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">📖 용어 사전</h1>
        <p className="text-lg text-gray-500">AI와 코딩에서 자주 나오는 단어들을 쉽게 설명해 드려요!</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-xl mx-auto">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="단어를 검색해 보세요..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 text-base bg-white"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
              activeCategory === tab.value
                ? 'bg-gray-800 text-white border-gray-800 shadow'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Term count */}
      <p className="text-sm text-gray-400 mb-6 text-center">
        총 <span className="font-bold text-gray-600">{filtered.length}</span>개의 단어가 있어요
      </p>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🤔</p>
          <p className="text-lg">검색 결과가 없어요. 다른 단어로 찾아보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((entry) => (
            <div
              key={entry.term}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
            >
              {/* Term name + badge */}
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-gray-800 leading-snug">{entry.term}</h2>
                <span
                  className={`shrink-0 px-2 py-0.5 text-xs font-semibold rounded-md border ${categoryColors[entry.category]}`}
                >
                  {categoryLabels[entry.category]}
                </span>
              </div>

              {/* Definition */}
              <p className="text-sm text-gray-600 leading-relaxed">{entry.definition}</p>

              {/* Aliases */}
              {entry.aliases && entry.aliases.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">다른 표현</p>
                  <p className="text-xs text-gray-500">{entry.aliases.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
