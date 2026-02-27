import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const padding = 12

    // Vertical: prefer below, fallback to above
    let top = triggerRect.bottom + 8
    if (top + tooltipRect.height > viewportHeight - padding) {
      top = triggerRect.top - tooltipRect.height - 8
    }
    // Clamp to viewport
    top = Math.max(padding, Math.min(top, viewportHeight - tooltipRect.height - padding))

    // Horizontal: center on trigger, clamp to viewport
    let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
    left = Math.max(padding, Math.min(left, viewportWidth - tooltipRect.width - padding))

    setPosition({ top, left })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    // Initial position calculation (needs a frame for the tooltip to render)
    requestAnimationFrame(updatePosition)

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

    function handleScroll() {
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, updatePosition])

  return (
    <>
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

      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              'fixed z-[9999] w-80 p-4',
              'bg-white rounded-xl shadow-2xl border border-gray-200',
              'animate-fade-in'
            )}
            style={{ top: position.top, left: position.left }}
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
          </div>,
          document.body
        )}
    </>
  )
}
