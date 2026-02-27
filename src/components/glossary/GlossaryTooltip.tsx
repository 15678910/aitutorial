import { useState, useRef, useEffect } from 'react'
import { type GlossaryEntry } from '../../lib/glossary'
import { cn } from '../../lib/utils'

interface GlossaryTooltipProps {
  term: string
  entry: GlossaryEntry
  children: React.ReactNode
}

const categoryColors = {
  computer: 'bg-blue-100 text-blue-700 border-blue-200',
  coding: 'bg-purple-100 text-purple-700 border-purple-200',
  web: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  tool: 'bg-green-100 text-green-700 border-green-200',
  team: 'bg-orange-100 text-orange-700 border-orange-200',
}

const categoryLabels = {
  computer: '컴퓨터 기초',
  coding: '코딩/프로그래밍',
  web: '웹/인터넷',
  tool: '개발 도구',
  team: '협업/실무',
}

export default function GlossaryTooltip({ entry, children }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'cursor-help inline-flex items-center gap-0.5',
          'border-b-2 border-dashed border-accent',
          'transition-colors duration-200',
          'hover:bg-accent/5'
        )}
      >
        <span className="text-xs" aria-label="glossary term">
          📖
        </span>
        {children}
      </span>

      {isOpen && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 mt-2 w-80 p-4',
            'bg-white rounded-lg shadow-lg border border-gray-200',
            'animate-fade-in'
          )}
          style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close tooltip"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Term name */}
          <h3 className="text-lg font-bold text-primary mb-2 pr-6">{entry.term}</h3>

          {/* Category badge */}
          <span
            className={cn(
              'inline-block px-2 py-1 text-xs font-semibold rounded-md border mb-3',
              categoryColors[entry.category]
            )}
          >
            {categoryLabels[entry.category]}
          </span>

          {/* Definition */}
          <p className="text-sm text-gray-700 leading-relaxed">{entry.definition}</p>

          {/* Aliases if available */}
          {entry.aliases && entry.aliases.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">다른 표현</p>
              <p className="text-xs text-gray-600">{entry.aliases.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </span>
  )
}
