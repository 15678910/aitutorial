import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import SkillTag from './SkillTag'
import type { WikiArticle } from '../../types/community'

interface WikiArticleCardProps {
  article: WikiArticle
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/^\s*\d+\.\s/gm, '')
    .replace(/\|[^|]*\|/g, '')
    .replace(/[-]{3,}/g, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .trim()
}

export default function WikiArticleCard({ article }: WikiArticleCardProps) {
  const preview = stripMarkdown(article.content).slice(0, 100)

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}일 전`
    const months = Math.floor(days / 30)
    return `${months}개월 전`
  }

  return (
    <Link to={`/community/wiki/${article.slug}`} className="block">
      <Card hoverable className="p-5 h-full flex flex-col">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>

        {/* Content Preview */}
        <p className="text-sm text-gray-600 mb-3 flex-1">
          {preview}{preview.length >= 100 ? '...' : ''}
        </p>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.map((tag) => (
              <SkillTag key={tag} skill={tag} />
            ))}
          </div>
        )}

        {/* Bottom: Author + Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-indigo-600">
                {article.authorName.charAt(0)}
              </span>
            </div>
            <span className="text-gray-600 font-medium">{article.authorName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.views}
            </span>
            <span>{timeAgo(article.updatedAt)}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
