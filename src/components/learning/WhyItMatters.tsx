import { useState } from 'react'
import { findWhyItMatters } from '../../data/whyItMatters'

interface WhyItMattersProps {
  courseSlug: string
  sectionTitle: string
  chapterTitle: string
}

export default function WhyItMatters({ courseSlug, sectionTitle, chapterTitle }: WhyItMattersProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const data = findWhyItMatters(courseSlug, sectionTitle, chapterTitle)

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-md hover:shadow-lg transition-shadow duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-amber-100/50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{data.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-amber-900">이건 왜 배울까?</h3>
            <p className="text-sm text-amber-700 mt-0.5">{data.title}</p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-amber-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.realLifeExamples.map((example, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-amber-100"
              >
                <div className="text-2xl mb-2">{example.icon}</div>
                <h4 className="font-semibold text-amber-900 mb-1">{example.title}</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{example.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💭</span>
              <div>
                <p className="text-sm font-medium text-amber-900 mb-1">생각해볼 질문</p>
                <p className="text-base text-gray-800 leading-relaxed">{data.studentQuestion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
