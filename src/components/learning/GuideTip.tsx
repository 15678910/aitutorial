import { useState } from 'react'
import { findGuideTips } from '../../data/guideTips'

interface GuideTipProps {
  courseSlug: string
  sectionTitle: string
  chapterTitle: string
}

type TipType = 'think' | 'try' | 'discuss' | 'connect'

export default function GuideTip({ courseSlug, sectionTitle, chapterTitle }: GuideTipProps) {
  const [selectedType, setSelectedType] = useState<TipType>('think')
  const data = findGuideTips(courseSlug, sectionTitle, chapterTitle)

  const selectedTip = data.tips.find(tip => tip.type === selectedType)

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-200 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="px-6 py-4 bg-teal-100/50 border-b border-teal-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧭</span>
          <h3 className="text-lg font-bold text-teal-900">안내자 팁</h3>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {data.tips.map((tip) => (
            <button
              key={tip.type}
              onClick={() => setSelectedType(tip.type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedType === tip.type
                  ? 'bg-teal-600 text-white shadow-md scale-105'
                  : 'bg-white text-teal-700 hover:bg-teal-100 border border-teal-200'
              }`}
            >
              <span className="text-lg">{tip.icon}</span>
              <span className="text-sm">{tip.label}</span>
            </button>
          ))}
        </div>

        {selectedTip && (
          <div className="bg-white rounded-lg p-5 border border-teal-200 shadow-sm animate-fadeIn">
            <p className="text-base text-gray-800 leading-relaxed">{selectedTip.prompt}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
