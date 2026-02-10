import { Link, useParams } from 'react-router-dom'
import { cn } from '../../lib/utils'
import type { Chapter } from '../../types'

interface SidebarProps {
  chapters: Chapter[]
  courseSlug: string
  completedSections?: Set<string>
}

export default function Sidebar({ chapters, courseSlug, completedSections = new Set() }: SidebarProps) {
  const { chapterSlug, sectionSlug } = useParams()

  return (
    <aside className="w-72 border-r border-gray-100 bg-[#fafbfc] overflow-y-auto h-[calc(100vh-4rem)] sticky top-0 hidden lg:block">
      <nav className="p-5">
        {chapters.map((chapter, chapterIdx) => (
          <div key={chapter.id} className={cn('mb-6', chapterIdx > 0 && 'pt-5 border-t border-gray-100')}>
            <h3 className="text-[0.7rem] font-bold text-primary/60 uppercase tracking-[0.15em] mb-3 px-3">{chapter.title}</h3>
            <ul className="space-y-1">
              {chapter.sections.map((section) => {
                const isActive = chapterSlug === chapter.slug && sectionSlug === section.slug
                const isCompleted = completedSections.has(section.id)
                return (
                  <li key={section.id}>
                    <Link
                      to={`/learn/${courseSlug}/${chapter.slug}/${section.slug}`}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.82rem] leading-snug transition-all',
                        isActive ? 'bg-accent/10 text-accent font-semibold shadow-sm' : 'text-gray-600 hover:bg-white hover:shadow-sm'
                      )}
                    >
                      <span className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[0.6rem] transition-colors',
                        isCompleted ? 'bg-accent border-accent text-white' : isActive ? 'border-accent bg-accent/5' : 'border-gray-300'
                      )}>
                        {isCompleted && '\u2713'}
                      </span>
                      <span className="truncate">{section.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
